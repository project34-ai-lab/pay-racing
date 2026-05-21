export type TripId = string;

export type Trip = {
  id: TripId;
  name: string;
  shareUrl: string;
  createdAtIso: string;
};

export type CreateTripResult = {
  trip: Trip;
  tripRoomPath: string;
};
