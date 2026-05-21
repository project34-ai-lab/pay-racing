import type {
  JoinTripInput,
  LocalIdentity,
  Member,
  MemberRole,
  MemberToken,
} from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

type StoredIdentity = {
  token: MemberToken;
  nickname: string;
  promptPay?: string;
  lastActiveTripId: TripId;
};

const LOCAL_IDENTITY_KEY = "prc.localIdentity.v1";
const TRIP_CREATOR_MAP_KEY = "prc.tripCreators.v1";

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

function generateMemberToken(): MemberToken {
  if (hasWindow() && typeof window.crypto?.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `member_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function parseStoredIdentity(rawValue: string | null): StoredIdentity | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredIdentity>;

    if (
      typeof parsedValue.token !== "string" ||
      typeof parsedValue.nickname !== "string" ||
      typeof parsedValue.lastActiveTripId !== "string"
    ) {
      return null;
    }

    if (parsedValue.promptPay && typeof parsedValue.promptPay !== "string") {
      return null;
    }

    return {
      token: parsedValue.token,
      nickname: parsedValue.nickname,
      promptPay: parsedValue.promptPay,
      lastActiveTripId: parsedValue.lastActiveTripId,
    };
  } catch {
    return null;
  }
}

function readStoredIdentity(): StoredIdentity | null {
  if (!hasWindow()) {
    return null;
  }

  return parseStoredIdentity(window.localStorage.getItem(LOCAL_IDENTITY_KEY));
}

function writeStoredIdentity(value: StoredIdentity): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(LOCAL_IDENTITY_KEY, JSON.stringify(value));
}

function toLocalIdentity(storedIdentity: StoredIdentity): LocalIdentity {
  const member: Member = {
    token: storedIdentity.token,
    nickname: storedIdentity.nickname,
    promptPay: storedIdentity.promptPay,
  };

  return {
    member,
    lastActiveTripId: storedIdentity.lastActiveTripId,
  };
}

type StoredTripCreatorMap = Record<string, MemberToken>;

function readTripCreatorMap(): StoredTripCreatorMap {
  if (!hasWindow()) {
    return {};
  }

  const rawValue = window.localStorage.getItem(TRIP_CREATOR_MAP_KEY);
  if (!rawValue) {
    return {};
  }

  try {
    const parsed = JSON.parse(rawValue) as Record<string, unknown>;
    return Object.entries(parsed).reduce<StoredTripCreatorMap>((acc, [key, value]) => {
      if (typeof key === "string" && typeof value === "string") {
        acc[key] = value;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function writeTripCreatorMap(value: StoredTripCreatorMap): void {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(TRIP_CREATOR_MAP_KEY, JSON.stringify(value));
}

export function readLocalIdentity(): LocalIdentity | null {
  const storedIdentity = readStoredIdentity();

  if (!storedIdentity) {
    return null;
  }

  return toLocalIdentity(storedIdentity);
}

export function saveJoinIdentity(input: JoinTripInput): LocalIdentity {
  const storedIdentity = readStoredIdentity();

  const nextStoredIdentity: StoredIdentity = {
    token: storedIdentity?.token ?? generateMemberToken(),
    nickname: input.nickname.trim(),
    promptPay: input.promptPay?.trim() ? input.promptPay.trim() : undefined,
    lastActiveTripId: input.tripId,
  };

  writeStoredIdentity(nextStoredIdentity);

  return toLocalIdentity(nextStoredIdentity);
}

export function setLastActiveTripId(tripId: TripId): void {
  const storedIdentity = readStoredIdentity();

  if (!storedIdentity) {
    return;
  }

  writeStoredIdentity({
    ...storedIdentity,
    lastActiveTripId: tripId,
  });
}

export function updateLocalPromptPay(promptPay: string): LocalIdentity | null {
  const storedIdentity = readStoredIdentity();
  if (!storedIdentity) {
    return null;
  }

  const trimmed = promptPay.trim();
  writeStoredIdentity({
    ...storedIdentity,
    promptPay: trimmed.length > 0 ? trimmed : undefined,
  });

  const nextIdentity = readStoredIdentity();
  if (!nextIdentity) {
    return null;
  }

  return toLocalIdentity(nextIdentity);
}

export function clearLastActiveTripIdIfMatches(tripId: TripId): void {
  const storedIdentity = readStoredIdentity();

  if (!storedIdentity || storedIdentity.lastActiveTripId !== tripId) {
    return;
  }

  writeStoredIdentity({
    ...storedIdentity,
    lastActiveTripId: "",
  });
}

export function readLastActiveTripId(): TripId | null {
  const tripId = readStoredIdentity()?.lastActiveTripId ?? null;
  if (!tripId || tripId.trim().length === 0) {
    return null;
  }

  return tripId;
}

export function markTripCreator(tripId: TripId, memberToken: MemberToken): void {
  const current = readTripCreatorMap();
  current[tripId] = memberToken;
  writeTripCreatorMap(current);
}

export function readTripCreatorToken(tripId: TripId): MemberToken | null {
  return readTripCreatorMap()[tripId] ?? null;
}

export function removeTripCreator(tripId: TripId): void {
  const current = readTripCreatorMap();
  if (!(tripId in current)) {
    return;
  }

  delete current[tripId];
  writeTripCreatorMap(current);
}

export function readMemberRole(tripId: TripId, memberToken: MemberToken): MemberRole {
  const creatorToken = readTripCreatorToken(tripId);
  return creatorToken === memberToken ? "creator" : "member";
}
