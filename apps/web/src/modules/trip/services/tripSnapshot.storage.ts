import type { Expense } from "@/modules/expense/types/expense.types";
import type { Member } from "@/modules/member/types/member.types";
import type { PaymentStatus } from "@/modules/settlement/types/settlement.types";
import type { TripId } from "@/modules/trip/types/trip.types";

export type TripSnapshot = {
  tripId: TripId;
  tripName?: string;
  expenses: Expense[];
  members: Member[];
  paymentStatuses: Record<string, PaymentStatus>;
  updatedAtIso: string;
};

type StoredSnapshot = {
  tripId?: unknown;
  tripName?: unknown;
  expenses?: unknown;
  members?: unknown;
  paymentStatuses?: unknown;
  updatedAtIso?: unknown;
};

const SNAPSHOT_KEY_PREFIX = "prc.tripSnapshot.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function buildSnapshotKey(tripId: TripId): string {
  return `${SNAPSHOT_KEY_PREFIX}:${tripId}`;
}

function isValidMember(value: unknown): value is Member {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Member>;
  if (typeof candidate.token !== "string" || typeof candidate.nickname !== "string") {
    return false;
  }

  if (candidate.role && candidate.role !== "creator" && candidate.role !== "member") {
    return false;
  }

  return true;
}

function normalizeExpense(value: unknown): Expense | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<Expense>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.tripId !== "string" ||
    typeof candidate.amount !== "number" ||
    typeof candidate.payerToken !== "string" ||
    typeof candidate.createdAtIso !== "string"
  ) {
    return null;
  }

  const fallbackNickname = `Racer ${candidate.payerToken.slice(-4).toUpperCase()}`;

  return {
    id: candidate.id,
    tripId: candidate.tripId,
    amount: candidate.amount,
    category: typeof candidate.category === "string" ? candidate.category : undefined,
    customLabel: typeof candidate.customLabel === "string" ? candidate.customLabel : undefined,
    payerToken: candidate.payerToken,
    payerNickname:
      typeof candidate.payerNickname === "string" && candidate.payerNickname.trim().length > 0
        ? candidate.payerNickname
        : fallbackNickname,
    createdAtIso: candidate.createdAtIso,
    note: typeof candidate.note === "string" ? candidate.note : undefined,
  };
}

function parseSnapshot(rawValue: string | null, tripId: TripId): TripSnapshot | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredSnapshot;
    if (parsed.tripId !== tripId) {
      return null;
    }

    const expensesInput = Array.isArray(parsed.expenses) ? parsed.expenses : [];
    const membersInput = Array.isArray(parsed.members) ? parsed.members : [];

    const expenses: Expense[] = expensesInput
      .map((item: unknown) => normalizeExpense(item))
      .filter((item: Expense | null): item is Expense => item !== null);
    const members: Member[] = membersInput.filter((item: unknown): item is Member => isValidMember(item));
    const statusesInput = parsed.paymentStatuses;
    const paymentStatuses =
      statusesInput && typeof statusesInput === "object"
        ? Object.entries(statusesInput as Record<string, unknown>).reduce<Record<string, PaymentStatus>>((acc, [id, status]) => {
            if (typeof id === "string" && (status === "pending" || status === "completed")) {
              acc[id] = status;
            }
            return acc;
          }, {})
        : {};

    return {
      tripId,
      tripName: typeof parsed.tripName === "string" ? parsed.tripName : undefined,
      expenses,
      members,
      paymentStatuses,
      updatedAtIso: typeof parsed.updatedAtIso === "string" ? parsed.updatedAtIso : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function loadTripSnapshot(tripId: TripId): TripSnapshot | null {
  if (!canUseStorage()) {
    return null;
  }

  return parseSnapshot(window.localStorage.getItem(buildSnapshotKey(tripId)), tripId);
}

export function saveTripSnapshot(snapshot: TripSnapshot): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(buildSnapshotKey(snapshot.tripId), JSON.stringify(snapshot));
}

export function removeTripSnapshot(tripId: TripId): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(buildSnapshotKey(tripId));
}
