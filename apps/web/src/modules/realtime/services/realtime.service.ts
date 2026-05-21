import type {
  RealtimeChannel,
  RealtimeChannelSendResponse,
  SupabaseClient,
} from "@supabase/supabase-js";

import { getSupabaseClient } from "@/lib/supabase";
import type { TripId } from "@/modules/trip/types/trip.types";
import type {
  RealtimeConnectionStatus,
  RealtimeEnvelope,
  RealtimeEventMap,
  RealtimeEventName,
} from "@/modules/realtime/types/realtime.types";

type ConnectionLifecycleHandlers = {
  onStatusChange: (status: RealtimeConnectionStatus, developerNote?: string) => void;
};

type EventHandler<TName extends RealtimeEventName> = (
  event: RealtimeEnvelope<TName, RealtimeEventMap[TName]>,
) => void;

type RealtimeSubscription = {
  unsubscribe: () => void;
};
type AnyRealtimeEnvelope = RealtimeEnvelope<RealtimeEventName, RealtimeEventMap[RealtimeEventName]>;
type InternalHandler = (event: AnyRealtimeEnvelope) => void;

const seenEventIds = new Set<string>();
let lifecycleChannel: RealtimeChannel | null = null;
const tripChannels = new Map<string, RealtimeChannel>();
const tripChannelWaiters = new Map<string, Promise<RealtimeChannel>>();
const tripChannelRefCounts = new Map<string, number>();
const tripChannelStatuses = new Map<string, string>();
const tripEventHandlers = new Map<string, Map<RealtimeEventName, Set<InternalHandler>>>();
const REALTIME_EVENT_NAMES: RealtimeEventName[] = [
  "member_joined",
  "expense_created",
  "expense_deleted",
  "trip_deleted",
  "settlement_updated",
  "payment_confirmed",
];

function logRealtimeDebug(level: "info" | "warn", message: string): void {
  if (!import.meta.env.DEV) {
    return;
  }

  const prefix = "[PRC][Realtime]";
  if (level === "warn") {
    console.warn(prefix, message);
    return;
  }

  console.info(prefix, message);
}

function getTripChannelName(tripId: TripId): string {
  return `trip:${tripId}`;
}

function releaseTripChannel(client: SupabaseClient, channelName: string): void {
  const nextCount = (tripChannelRefCounts.get(channelName) ?? 1) - 1;

  if (nextCount > 0) {
    tripChannelRefCounts.set(channelName, nextCount);
    return;
  }

  tripChannelRefCounts.delete(channelName);

  const channel = tripChannels.get(channelName);
  if (!channel) {
    return;
  }

  client.removeChannel(channel);
  tripChannels.delete(channelName);
  tripChannelWaiters.delete(channelName);
  tripChannelStatuses.delete(channelName);
  tripEventHandlers.delete(channelName);
  logRealtimeDebug("info", `Disposed trip channel ${channelName}`);
}

async function ensureTripChannel(client: SupabaseClient, tripId: TripId): Promise<RealtimeChannel> {
  const channelName = getTripChannelName(tripId);
  const existing = tripChannels.get(channelName);
  if (existing) {
    const status = tripChannelStatuses.get(channelName);
    if (status === "SUBSCRIBED") {
      return existing;
    }

    client.removeChannel(existing);
    tripChannels.delete(channelName);
    tripChannelWaiters.delete(channelName);
    tripChannelStatuses.delete(channelName);
    logRealtimeDebug("warn", `[${channelName}] dropped stale channel (status=${status ?? "unknown"})`);
  }

  const pending = tripChannelWaiters.get(channelName);
  if (pending) {
    return pending;
  }

  const channel = client.channel(channelName, {
    config: {
      broadcast: { self: true, ack: false },
    },
  });
  const handlersByEvent = tripEventHandlers.get(channelName) ?? new Map<RealtimeEventName, Set<InternalHandler>>();
  tripEventHandlers.set(channelName, handlersByEvent);

  REALTIME_EVENT_NAMES.forEach((eventName: RealtimeEventName) => {
    channel.on("broadcast", { event: eventName }, (incomingPayload: { payload?: unknown }) => {
      const payloadContainer = incomingPayload.payload;

      if (!isRealtimeEnvelope(payloadContainer, eventName)) {
        return;
      }

      const envelope: AnyRealtimeEnvelope = payloadContainer;

      if (seenEventIds.has(envelope.eventId)) {
        return;
      }

      seenEventIds.add(envelope.eventId);
      if (seenEventIds.size > 500) {
        const oldestEventId = seenEventIds.values().next().value;
        if (oldestEventId) {
          seenEventIds.delete(oldestEventId);
        }
      }

      const listeners = tripEventHandlers.get(channelName)?.get(eventName);
      if (!listeners || listeners.size === 0) {
        return;
      }

      logRealtimeDebug("info", `[${channelName}] recv ${eventName} (${envelope.eventId})`);
      listeners.forEach((listener: InternalHandler) => {
        listener(envelope);
      });
    });
  });

  const waiter = new Promise<RealtimeChannel>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      tripChannelWaiters.delete(channelName);
      reject(new Error(`subscribe timeout for ${channelName}`));
    }, 10_000);

    channel.subscribe((status: string) => {
      tripChannelStatuses.set(channelName, status);
      logRealtimeDebug("info", `[${channelName}] status: ${status}`);

      if (status === "SUBSCRIBED") {
        window.clearTimeout(timeout);
        tripChannels.set(channelName, channel);
        tripChannelWaiters.delete(channelName);
        resolve(channel);
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        window.clearTimeout(timeout);
        tripChannels.delete(channelName);
        tripChannelWaiters.delete(channelName);
        tripChannelStatuses.delete(channelName);
        reject(new Error(`subscribe failed (${status}) for ${channelName}`));
      }
    });
  });

  tripChannelWaiters.set(channelName, waiter);
  return waiter;
}

function generateEventId(): string {
  if (typeof window !== "undefined" && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function isRealtimeEnvelope<TName extends RealtimeEventName>(
  value: unknown,
  expectedName: TName,
): value is RealtimeEnvelope<TName, RealtimeEventMap[TName]> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RealtimeEnvelope<TName, RealtimeEventMap[TName]>>;

  return (
    typeof candidate.eventId === "string" &&
    typeof candidate.tripId === "string" &&
    typeof candidate.emittedAtIso === "string" &&
    candidate.name === expectedName &&
    isValidRealtimePayload(expectedName, candidate.payload)
  );
}

function isValidRealtimePayload(name: RealtimeEventName, payload: unknown): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  if (name === "member_joined") {
    return (
      typeof candidate.memberToken === "string" &&
      typeof candidate.nickname === "string" &&
      (candidate.promptPay === undefined || typeof candidate.promptPay === "string") &&
      (candidate.role === undefined || candidate.role === "creator" || candidate.role === "member") &&
      (candidate.source === "join" || candidate.source === "presence")
    );
  }

  if (name === "expense_created") {
    const expense = candidate.expense;
    if (!expense || typeof expense !== "object") {
      return false;
    }

    const expenseCandidate = expense as Record<string, unknown>;
    const hasCategory = typeof expenseCandidate.category === "string";
    const hasCustomLabel = typeof expenseCandidate.customLabel === "string" && expenseCandidate.customLabel.trim().length > 0;
    return (
      typeof expenseCandidate.id === "string" &&
      typeof expenseCandidate.tripId === "string" &&
      typeof expenseCandidate.amount === "number" &&
      (hasCategory || hasCustomLabel) &&
      typeof expenseCandidate.payerToken === "string" &&
      typeof expenseCandidate.createdAtIso === "string"
    );
  }

  if (name === "expense_deleted") {
    return typeof candidate.expenseId === "string" && typeof candidate.deletedByMemberToken === "string";
  }

  if (name === "trip_deleted") {
    return typeof candidate.deletedByMemberToken === "string";
  }

  if (name === "settlement_updated") {
    return typeof candidate.settlementVersion === "number";
  }

  return (
    typeof candidate.paymentId === "string" &&
    typeof candidate.fromMemberToken === "string" &&
    typeof candidate.toMemberToken === "string" &&
    typeof candidate.amount === "number"
  );
}

function mapSupabaseSubscribeStatus(status: string): RealtimeConnectionStatus {
  if (status === "SUBSCRIBED") {
    return "connected";
  }

  if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
    return "reconnecting";
  }

  return "offline";
}

function getClientOrNotify(handlers: ConnectionLifecycleHandlers): SupabaseClient | null {
  const clientResult = getSupabaseClient();

  if (!clientResult.ok) {
    logRealtimeDebug("warn", `Cannot init realtime lifecycle: ${clientResult.message}`);
    handlers.onStatusChange("offline", clientResult.message);
    return null;
  }

  return clientResult.client;
}

export function initRealtimeLifecycle(handlers: ConnectionLifecycleHandlers): () => void {
  const client = getClientOrNotify(handlers);

  if (!client) {
    return () => {
      return;
    };
  }

  if (lifecycleChannel) {
    client.removeChannel(lifecycleChannel);
    lifecycleChannel = null;
  }

  logRealtimeDebug("info", "Initializing lifecycle channel...");
  lifecycleChannel = client.channel("system:lifecycle");
  lifecycleChannel.subscribe((status: string) => {
    logRealtimeDebug("info", `Lifecycle status: ${status}`);
    handlers.onStatusChange(mapSupabaseSubscribeStatus(status));
  });

  return () => {
    if (!lifecycleChannel) {
      return;
    }

    client.removeChannel(lifecycleChannel);
    lifecycleChannel = null;
    logRealtimeDebug("info", "Lifecycle channel disposed");
  };
}

export async function publishTripEvent<TName extends RealtimeEventName>(
  tripId: TripId,
  name: TName,
  payload: RealtimeEventMap[TName],
): Promise<{ ok: true } | { ok: false; message: string }> {
  const clientResult = getSupabaseClient();

  if (!clientResult.ok) {
    return {
      ok: false,
      message: clientResult.message,
    };
  }

  const channelName = getTripChannelName(tripId);
  let channel: RealtimeChannel;
  try {
    channel = await ensureTripChannel(clientResult.client, tripId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "subscribe failed";
    logRealtimeDebug("warn", `[${channelName}] publish blocked: ${message}`);
    return {
      ok: false,
      message: `ต่อสนาม realtime ไม่สำเร็จ (${message})`,
    };
  }

  const envelope: RealtimeEnvelope<TName, RealtimeEventMap[TName]> = {
    eventId: generateEventId(),
    name,
    tripId,
    emittedAtIso: new Date().toISOString(),
    payload,
  };

  let response: RealtimeChannelSendResponse = await channel.send({
    type: "broadcast",
    event: name,
    payload: envelope,
  });
  if (response !== "ok") {
    logRealtimeDebug("warn", `[${channelName}] publish ${name} first attempt => ${response}, retrying...`);
    try {
      channel = await ensureTripChannel(clientResult.client, tripId);
      response = await channel.send({
        type: "broadcast",
        event: name,
        payload: envelope,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "retry subscribe failed";
      logRealtimeDebug("warn", `[${channelName}] publish retry blocked: ${message}`);
    }
  }
  logRealtimeDebug("info", `[${channelName}] publish ${name} => ${response}`);

  return response === "ok"
    ? {
        ok: true,
      }
    : {
        ok: false,
        message: `ส่งอีเวนต์ ${name} ไม่สำเร็จ (${response})`,
      };
}

export async function prepareTripRealtime(
  tripId: TripId,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const clientResult = getSupabaseClient();
  if (!clientResult.ok) {
    return {
      ok: false,
      message: clientResult.message,
    };
  }

  try {
    await ensureTripChannel(clientResult.client, tripId);
    return { ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "prepare failed";
    return {
      ok: false,
      message,
    };
  }
}

export function subscribeTripEvent<TName extends RealtimeEventName>(
  tripId: TripId,
  name: TName,
  handler: EventHandler<TName>,
): RealtimeSubscription | null {
  const clientResult = getSupabaseClient();

  if (!clientResult.ok) {
    return null;
  }

  const channelName = getTripChannelName(tripId);
  tripChannelRefCounts.set(channelName, (tripChannelRefCounts.get(channelName) ?? 0) + 1);
  const handlersByEvent = tripEventHandlers.get(channelName) ?? new Map<RealtimeEventName, Set<InternalHandler>>();
  const listeners = handlersByEvent.get(name) ?? new Set<InternalHandler>();
  const internalHandler: InternalHandler = (event: AnyRealtimeEnvelope): void => {
    if (event.name !== name) {
      return;
    }

    handler(event as RealtimeEnvelope<TName, RealtimeEventMap[TName]>);
  };
  listeners.add(internalHandler);
  handlersByEvent.set(name, listeners);
  tripEventHandlers.set(channelName, handlersByEvent);

  let active = true;
  let released = false;
  const releaseOnce = (): void => {
    if (released) {
      return;
    }

    released = true;
    releaseTripChannel(clientResult.client, channelName);
  };

  void ensureTripChannel(clientResult.client, tripId)
    .then(() => {
      if (!active) {
        return;
      }

      logRealtimeDebug("info", `[${channelName}] subscribed event listener for ${name}`);
    })
    .catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : "unknown error";
      logRealtimeDebug("warn", `[${channelName}] subscribe failed: ${detail}`);
      if (active) {
        releaseOnce();
      }
    });

  return {
    unsubscribe: () => {
      active = false;
      listeners.delete(internalHandler);
      if (listeners.size === 0) {
        handlersByEvent.delete(name);
      }

      releaseOnce();
    },
  };
}
