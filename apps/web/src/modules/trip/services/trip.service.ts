import type { CreateTripResult, Trip, TripId } from "@/modules/trip/types/trip.types";

function generateTripId(): TripId {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const chunks = 2;
  const chunkLength = 4;

  const nextChunk = (): string => {
    return Array.from({ length: chunkLength }, () => {
      const index = Math.floor(Math.random() * alphabet.length);
      return alphabet[index];
    }).join("");
  };

  return Array.from({ length: chunks }, nextChunk).join("-");
}

function normalizeTripName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return "อีเวนต์หารค่าใช้จ่าย";
  }

  if (trimmed.length > 40) {
    return trimmed.slice(0, 40);
  }

  return trimmed;
}

export function createTrip(baseUrl: string, tripName: string): CreateTripResult {
  const id = generateTripId();
  const name = normalizeTripName(tripName);
  const tripRoomPath = `/trip/${id}`;
  const shareUrlUrl = new URL(tripRoomPath, baseUrl);
  shareUrlUrl.searchParams.set("name", name);
  const shareUrl = shareUrlUrl.toString();

  const trip: Trip = {
    id,
    name,
    shareUrl,
    createdAtIso: new Date().toISOString(),
  };

  return {
    trip,
    tripRoomPath,
  };
}
