import type { TripId } from "@/modules/trip/types/trip.types";

const DELETED_TRIP_MAP_KEY = "prc.deletedTrips.v1";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readDeletedTripMap(): Record<string, string> {
  if (!canUseStorage()) {
    return {};
  }

  const raw = window.localStorage.getItem(DELETED_TRIP_MAP_KEY);
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, string>>((acc, [tripId, deletedAt]) => {
      if (typeof tripId === "string" && typeof deletedAt === "string") {
        acc[tripId] = deletedAt;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
}

function writeDeletedTripMap(nextMap: Record<string, string>): void {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(DELETED_TRIP_MAP_KEY, JSON.stringify(nextMap));
}

export function markDeletedTrip(tripId: TripId): void {
  const current = readDeletedTripMap();
  current[tripId] = new Date().toISOString();
  writeDeletedTripMap(current);
}

export function isDeletedTrip(tripId: TripId): boolean {
  return Boolean(readDeletedTripMap()[tripId]);
}

export function clearDeletedTripMark(tripId: TripId): void {
  const current = readDeletedTripMap();
  if (!(tripId in current)) {
    return;
  }

  delete current[tripId];
  writeDeletedTripMap(current);
}

