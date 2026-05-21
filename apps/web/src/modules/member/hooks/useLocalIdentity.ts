import { useCallback } from "react";

import {
  clearLastActiveTripIdIfMatches,
  markTripCreator,
  removeTripCreator,
  readMemberRole,
  readLastActiveTripId,
  readLocalIdentity,
  readTripCreatorToken,
  saveJoinIdentity,
  setLastActiveTripId,
  updateLocalPromptPay,
} from "@/modules/member/services/localIdentity.storage";
import type { JoinTripInput, LocalIdentity, MemberRole, MemberToken } from "@/modules/member/types/member.types";
import type { TripId } from "@/modules/trip/types/trip.types";

type UseLocalIdentityResult = {
  getIdentity: () => LocalIdentity | null;
  getLastActiveTripId: () => TripId | null;
  saveIdentity: (input: JoinTripInput) => LocalIdentity;
  markTripAsActive: (tripId: TripId) => void;
  setTripCreator: (tripId: TripId, memberToken: MemberToken) => void;
  clearTripCreator: (tripId: TripId) => void;
  clearActiveTripIfMatches: (tripId: TripId) => void;
  getTripCreatorToken: (tripId: TripId) => MemberToken | null;
  getMemberRole: (tripId: TripId, memberToken: MemberToken) => MemberRole;
  updatePromptPay: (promptPay: string) => LocalIdentity | null;
};

export function useLocalIdentity(): UseLocalIdentityResult {
  const getIdentity = useCallback((): LocalIdentity | null => {
    return readLocalIdentity();
  }, []);

  const getLastActiveTripId = useCallback((): TripId | null => {
    return readLastActiveTripId();
  }, []);

  const saveIdentity = useCallback((input: JoinTripInput): LocalIdentity => {
    return saveJoinIdentity(input);
  }, []);

  const markTripAsActive = useCallback((tripId: TripId): void => {
    setLastActiveTripId(tripId);
  }, []);

  const setTripCreator = useCallback((tripId: TripId, memberToken: MemberToken): void => {
    markTripCreator(tripId, memberToken);
  }, []);

  const getTripCreatorToken = useCallback((tripId: TripId): MemberToken | null => {
    return readTripCreatorToken(tripId);
  }, []);

  const clearTripCreator = useCallback((tripId: TripId): void => {
    removeTripCreator(tripId);
  }, []);

  const clearActiveTripIfMatches = useCallback((tripId: TripId): void => {
    clearLastActiveTripIdIfMatches(tripId);
  }, []);

  const getMemberRole = useCallback((tripId: TripId, memberToken: MemberToken): MemberRole => {
    return readMemberRole(tripId, memberToken);
  }, []);

  const updatePromptPay = useCallback((promptPay: string): LocalIdentity | null => {
    return updateLocalPromptPay(promptPay);
  }, []);

  return {
    getIdentity,
    getLastActiveTripId,
    saveIdentity,
    markTripAsActive,
    setTripCreator,
    clearTripCreator,
    clearActiveTripIfMatches,
    getTripCreatorToken,
    getMemberRole,
    updatePromptPay,
  };
}
