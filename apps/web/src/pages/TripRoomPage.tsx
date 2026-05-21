import type { ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { RealtimeStatus } from "@/components/ui/RealtimeStatus";
import { MobileShellLayout } from "@/layouts/MobileShellLayout";
import { AddExpenseButton } from "@/modules/expense/components/AddExpenseButton";
import { AddExpenseModal } from "@/modules/expense/components/AddExpenseModal";
import { DamageLogList } from "@/modules/expense/components/DamageLogList";
import { useExpenseRealtime } from "@/modules/expense/hooks/useExpenseRealtime";
import { publishExpenseCreated, publishExpenseDeleted } from "@/modules/expense/services/expenseRealtime.service";
import { createExpense, validateExpenseInput } from "@/modules/expense/services/expense.service";
import { useExpenseStore } from "@/modules/expense/stores/expense.store";
import type { AddExpenseDraftInput, AddExpenseInput, Expense } from "@/modules/expense/types/expense.types";
import { Leaderboard } from "@/modules/leaderboard/components/Leaderboard";
import { OvertakeFeedback } from "@/modules/leaderboard/components/OvertakeFeedback";
import type { LeaderboardEntry, OvertakeResult } from "@/modules/leaderboard/types/leaderboard.types";
import { detectOvertake } from "@/modules/leaderboard/utils/detectOvertake";
import { calculateLeaderboardRankings } from "@/modules/leaderboard/utils/calculateLeaderboardRankings";
import { useLocalIdentity } from "@/modules/member/hooks/useLocalIdentity";
import { useMemberRealtime } from "@/modules/member/hooks/useMemberRealtime";
import { publishMemberJoined } from "@/modules/member/services/memberRealtime.service";
import { useMemberStore } from "@/modules/member/stores/member.store";
import { isValidPromptPay } from "@/modules/payment/utils/validatePromptPay";
import { usePaymentRealtime } from "@/modules/payment/hooks/usePaymentRealtime";
import { usePaymentStore } from "@/modules/payment/stores/payment.store";
import { useRealtimeStoreState } from "@/modules/realtime/hooks/useRealtimeStoreState";
import { prepareTripRealtime } from "@/modules/realtime/services/realtime.service";
import { SettlementPanel } from "@/modules/settlement/components/SettlementPanel";
import { DeletedTripNoticeCard } from "@/modules/trip/components/DeletedTripNoticeCard";
import { DamageGauge } from "@/modules/trip/components/DamageGauge";
import type { DashboardSummary } from "@/modules/trip/types/dashboard.types";
import type { TripId } from "@/modules/trip/types/trip.types";
import { calculateDashboardSummary } from "@/modules/trip/utils/calculateDashboardSummary";
import { MemberPitList } from "@/modules/member/components/MemberPitList";
import { loadTripSnapshot, removeTripSnapshot, saveTripSnapshot } from "@/modules/trip/services/tripSnapshot.storage";
import { isDeletedTrip, markDeletedTrip } from "@/modules/trip/services/deletedTrip.storage";
import type { MemberRole } from "@/modules/member/types/member.types";
import { publishTripDeleted, subscribeTripDeleted } from "@/modules/trip/services/tripRealtime.service";

type TripRoomParams = {
  tripId: string;
};

function normalizeTripId(value: string | undefined): TripId | null {
  if (!value?.trim()) {
    return null;
  }

  return value.trim().toUpperCase();
}

const publishedMemberJoinedKeys = new Set<string>();

export function TripRoomPage(): ReactElement {
  const navigate = useNavigate();
  const params = useParams<TripRoomParams>();
  const [searchParams] = useSearchParams();
  const {
    getIdentity,
    markTripAsActive,
    getTripCreatorToken,
    getMemberRole,
    updatePromptPay,
    clearTripCreator,
    clearActiveTripIfMatches,
  } = useLocalIdentity();
  const { status, statusCopy, developerNote } = useRealtimeStoreState();

  const seedExpenses = useExpenseStore((state) => state.seedExpenses);
  const addExpense = useExpenseStore((state) => state.addExpense);
  const removeExpense = useExpenseStore((state) => state.removeExpense);
  const clearTripExpenses = useExpenseStore((state) => state.clearTripExpenses);
  const expenses = useExpenseStore((state) => state.expenses);
  const seedMembers = useMemberStore((state) => state.seedMembers);
  const upsertMember = useMemberStore((state) => state.upsertMember);
  const clearTripMembers = useMemberStore((state) => state.clearTripMembers);
  const membersInTrip = useMemberStore((state) => state.members);
  const paymentStatuses = usePaymentStore((state) => state.statuses);
  const setPaymentStatuses = usePaymentStore((state) => state.setPaymentStatuses);
  const resetPaymentStatuses = usePaymentStore((state) => state.resetPaymentStatuses);

  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState<boolean>(false);
  const [isDeleteTripModalOpen, setIsDeleteTripModalOpen] = useState<boolean>(false);
  const [isDeletingTrip, setIsDeletingTrip] = useState<boolean>(false);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);
  const [overtakeResult, setOvertakeResult] = useState<OvertakeResult | null>(null);
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [isSnapshotHydrated, setIsSnapshotHydrated] = useState<boolean>(false);
  const [tripName, setTripName] = useState<string>("อีเวนต์หารค่าใช้จ่าย");
  const showDeveloperNote = import.meta.env.DEV;

  const tripId = normalizeTripId(params.tripId);
  const deletedTrip = tripId ? isDeletedTrip(tripId) : false;
  const identity = getIdentity();
  const joinPath = useMemo(() => {
    if (!tripId) {
      return null;
    }

    const nameQuery = searchParams.get("name");
    return nameQuery ? `/trip/${tripId}/join?name=${encodeURIComponent(nameQuery)}` : `/trip/${tripId}/join`;
  }, [searchParams, tripId]);
  const shouldRedirectToJoin = useMemo(() => {
    if (!tripId) {
      return false;
    }
    if (deletedTrip) {
      return false;
    }

    if (!identity) {
      return true;
    }

    const role = getMemberRole(tripId, identity.member.token);
    if (role === "creator") {
      return false;
    }

    return identity.lastActiveTripId !== tripId;
  }, [deletedTrip, getMemberRole, identity, tripId]);
  const canEnterRoom = Boolean(tripId && identity && !shouldRedirectToJoin);
  const creatorToken = useMemo(() => {
    if (!tripId) {
      return null;
    }

    return getTripCreatorToken(tripId);
  }, [getTripCreatorToken, tripId]);
  const realtimeCreatorToken = useMemo(() => {
    const creatorMember = membersInTrip.find((member) => member.role === "creator");
    return creatorMember?.token ?? null;
  }, [membersInTrip]);
  const effectiveCreatorToken = realtimeCreatorToken ?? creatorToken;
  const currentRealtimeMember = useMemo(() => {
    if (!tripId || !identity) {
      return null;
    }

    const role: MemberRole = getMemberRole(tripId, identity.member.token);
    return {
      ...identity.member,
      role,
    };
  }, [getMemberRole, identity, tripId]);
  const currentMemberToken = currentRealtimeMember?.token ?? identity?.member.token ?? null;
  const identityNickname = identity?.member.nickname ?? "";
  const identityPromptPay = identity?.member.promptPay;

  useExpenseRealtime(canEnterRoom ? tripId : null, canEnterRoom ? currentMemberToken : null);
  useMemberRealtime(canEnterRoom ? tripId : null, canEnterRoom ? currentRealtimeMember : null);
  usePaymentRealtime(canEnterRoom ? tripId : null);

  const cleanupDeletedTrip = useMemo(() => {
    return (targetTripId: TripId): void => {
      markDeletedTrip(targetTripId);
      clearTripExpenses(targetTripId);
      clearTripMembers(targetTripId);
      resetPaymentStatuses();
      removeTripSnapshot(targetTripId);
      clearTripCreator(targetTripId);
      clearActiveTripIfMatches(targetTripId);
    };
  }, [clearActiveTripIfMatches, clearTripCreator, clearTripExpenses, clearTripMembers, resetPaymentStatuses]);

  useEffect(() => {
    if (!canEnterRoom || !tripId || !identity) {
      return;
    }

    markTripAsActive(tripId);
  }, [canEnterRoom, identity, markTripAsActive, tripId]);

  useEffect(() => {
    if (!tripId || !canEnterRoom) {
      return;
    }

    const snapshot = loadTripSnapshot(tripId);
    const queryName = searchParams.get("name")?.trim();
    const resolvedName = queryName && queryName.length > 0 ? queryName : snapshot?.tripName ?? "อีเวนต์หารค่าใช้จ่าย";
    setTripName(resolvedName);

    seedExpenses(tripId, snapshot?.expenses ?? []);

    if (snapshot?.members && snapshot.members.length > 0) {
      seedMembers(tripId, snapshot.members);
    }
    setPaymentStatuses(snapshot?.paymentStatuses ?? {});

    setIsSnapshotHydrated(true);
  }, [canEnterRoom, searchParams, seedExpenses, seedMembers, setPaymentStatuses, tripId]);

  useEffect(() => {
    if (!tripId || !identity || status !== "connected" || !canEnterRoom) {
      return;
    }

    const localRole: MemberRole = getMemberRole(tripId, identity.member.token);
    const localMember = { ...identity.member, role: localRole };

    seedMembers(tripId, [localMember]);
    upsertMember(localMember);

    const key = `${tripId}:${identity.member.token}`;
    if (publishedMemberJoinedKeys.has(key)) {
      return;
    }

    let active = true;
    void (async () => {
      const ready = await prepareTripRealtime(tripId);
      if (!active || !ready.ok) {
        return;
      }

      publishedMemberJoinedKeys.add(key);
      await publishMemberJoined(tripId, localMember, "join");
    })();

    return () => {
      active = false;
    };
  }, [
    canEnterRoom,
    getMemberRole,
    identityNickname,
    identityPromptPay,
    currentMemberToken,
    seedMembers,
    status,
    tripId,
    upsertMember,
  ]);

  useEffect(() => {
    if (!successFeedback && !overtakeResult) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSuccessFeedback(null);
      setOvertakeResult(null);
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [overtakeResult, successFeedback]);

  useEffect(() => {
    if (!tripId || !isSnapshotHydrated || !identity || !canEnterRoom) {
      return;
    }

    const localRole: MemberRole = getMemberRole(tripId, identity.member.token);
    const memberMap = new Map(membersInTrip.map((member) => [member.token, member]));
    memberMap.set(identity.member.token, { ...identity.member, role: localRole });

    saveTripSnapshot({
      tripId,
      tripName,
      expenses,
      members: Array.from(memberMap.values()),
      paymentStatuses,
      updatedAtIso: new Date().toISOString(),
    });
  }, [canEnterRoom, expenses, getMemberRole, identity, isSnapshotHydrated, membersInTrip, paymentStatuses, tripId, tripName]);

  useEffect(() => {
    if (!tripId) {
      return;
    }

    const subscription = subscribeTripDeleted(tripId, () => {
      cleanupDeletedTrip(tripId);
      navigate("/", { replace: true });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [cleanupDeletedTrip, navigate, tripId]);

  if (!tripId) {
    return (
      <MobileShellLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card className="space-y-3">
            <h1 className="font-display text-xl font-bold">ไม่พบรหัสอีเวนต์</h1>
            <p className="text-sm text-muted">ลิงก์อาจหมดอายุหรือไม่ครบ ลองกลับไปเปิดอีเวนต์ใหม่อีกที</p>
            <Button fullWidth onClick={() => navigate("/")}>กลับหน้าแรก</Button>
          </Card>
        </motion.div>
      </MobileShellLayout>
    );
  }

  if (deletedTrip) {
    return (
      <MobileShellLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <DeletedTripNoticeCard onBack={() => navigate("/", { replace: true })} />
        </motion.div>
      </MobileShellLayout>
    );
  }

  if (shouldRedirectToJoin && joinPath) {
    return <Navigate to={joinPath} replace />;
  }

  if (!identity) {
    return (
      <MobileShellLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card className="space-y-3">
            <h1 className="font-display text-xl font-bold">กำลังเตรียมข้อมูลอีเวนต์...</h1>
            <p className="text-sm text-muted">กำลังซิงก์สมาชิกและรายการล่าสุด เดี๋ยวพาเข้าให้ทันที</p>
          </Card>
        </motion.div>
      </MobileShellLayout>
    );
  }

  const shareUrlObject = new URL(`/trip/${tripId}`, window.location.origin);
  shareUrlObject.searchParams.set("name", tripName);
  const shareUrl = shareUrlObject.toString();

  const byToken = new Map(membersInTrip.map((member) => [member.token, member]));
  byToken.set(identity.member.token, identity.member);

  expenses.forEach((expense: Expense) => {
    if (!byToken.has(expense.payerToken)) {
      byToken.set(expense.payerToken, {
        token: expense.payerToken,
        nickname: expense.payerNickname || `Racer ${expense.payerToken.slice(-4).toUpperCase()}`,
      });
    }
  });

  const members = Array.from(byToken.values());
  const summary: DashboardSummary = calculateDashboardSummary(expenses);
  const leaderboardEntries: LeaderboardEntry[] = calculateLeaderboardRankings(members, expenses, effectiveCreatorToken);
  const myRoleLabel = getMemberRole(tripId, identity.member.token) === "creator"
    ? `🏁 ผู้สร้างอีเวนต์: ${identity.member.nickname}`
    : `🤝 สมาชิก: ${identity.member.nickname}`;
  const isCreator = getMemberRole(tripId, identity.member.token) === "creator";
  const sortedDamageLogs = [...expenses].sort((left: Expense, right: Expense) => right.amount - left.amount);

  const handleSubmitExpense = async (
    input: AddExpenseDraftInput,
  ): Promise<{ ok: true } | { ok: false; message: string }> => {
    const nextInput: AddExpenseInput = {
      ...input,
      tripId,
      payerToken: identity.member.token,
      payerNickname: identity.member.nickname,
    };

    const validated = validateExpenseInput(nextInput);

    if (!validated.ok) {
      return validated;
    }

    const previousEntries = leaderboardEntries;
    const expense = createExpense(validated.value);

    addExpense(expense);

    const nextEntries = calculateLeaderboardRankings(members, [expense, ...expenses], effectiveCreatorToken);
    const maybeOvertake = detectOvertake(previousEntries, nextEntries, identity.member.token);

    if (maybeOvertake.hasOvertake) {
      setOvertakeResult(maybeOvertake);
    }

    setSuccessFeedback("บันทึกรายการเรียบร้อยแล้ว");

    const publishResult = await publishExpenseCreated(tripId, expense);

    if (!publishResult.ok) {
      return {
        ok: false,
        message: "อัปเดตให้เพื่อนยังไม่ทัน แต่ในเครื่องเราบันทึกแล้ว",
      };
    }

    return {
      ok: true,
    };
  };

  const handleDeleteExpense = async (expenseId: string): Promise<void> => {
    const target = expenses.find((expense) => expense.id === expenseId);
    if (!target || !currentMemberToken || target.payerToken !== currentMemberToken) {
      if (target && currentMemberToken) {
        console.warn(
          "[PRC][Trip] Delete blocked by owner guard:",
          JSON.stringify({ expenseId, payerToken: target.payerToken, currentMemberToken }),
        );
      }
      return;
    }

    removeExpense(expenseId);
    const publishResult = await publishExpenseDeleted(tripId, expenseId, currentMemberToken);
    if (!publishResult.ok) {
      addExpense(target);
      console.warn("[PRC][Trip] Expense delete publish failed, local state rolled back:", publishResult.message);
      return;
    }

    setSuccessFeedback("ลบรายการแล้ว คำนวณใหม่เรียบร้อย 🧹");
  };

  const handleCopyShareUrl = async (): Promise<void> => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 1600);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = shareUrl;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1600);
  };

  const handleUpdatePromptPay = async (nextPromptPay: string): Promise<{ ok: true } | { ok: false; message: string }> => {
    if (!identity || !tripId) {
      return { ok: false, message: "ยังหาสมาชิกไม่เจอ ลองใหม่อีกที" };
    }

    const normalized = nextPromptPay.trim();
    if (!isValidPromptPay(normalized)) {
      return { ok: false, message: "PromptPay ต้องเป็นตัวเลข 10 หรือ 13 หลักเท่านั้น" };
    }

    const nextIdentity = updatePromptPay(normalized);
    if (!nextIdentity) {
      return { ok: false, message: "บันทึก PromptPay ไม่สำเร็จ" };
    }

    const role: MemberRole = getMemberRole(tripId, nextIdentity.member.token);
    const updatedMember = {
      ...nextIdentity.member,
      role,
    };
    upsertMember(updatedMember);

    const publishResult = await publishMemberJoined(tripId, updatedMember, "presence");
    if (!publishResult.ok) {
      return { ok: false, message: "บันทึกแล้ว แต่เพื่อนอาจยังเห็นค่าเดิมชั่วคราว" };
    }

    return { ok: true };
  };

  const handleDeleteTrip = async (): Promise<void> => {
    if (!tripId || !isCreator || isDeletingTrip) {
      return;
    }

    setIsDeletingTrip(true);
    const publishResult = await publishTripDeleted(tripId, identity.member.token);

    cleanupDeletedTrip(tripId);
    setIsDeleteTripModalOpen(false);
    setIsDeletingTrip(false);

    if (!publishResult.ok) {
      console.warn("[PRC][Trip] Trip deleted locally, but realtime notify failed:", publishResult.message);
    }

    navigate("/", { replace: true });
  };


  return (
    <MobileShellLayout>
      <main className="flex flex-1 flex-col gap-4">
        <Card tone="highlight" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex min-w-0 flex-col rounded-chip border border-podium/45 bg-podium/20 px-3 py-1.5">
              <span className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-podium">{tripName}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-nitro">รหัสอีเวนต์: {tripId}</span>
            </div>
            <Badge tone="live">{myRoleLabel}</Badge>
          </div>
          <RealtimeStatus status={status} copy={statusCopy} />
          <AddExpenseButton onClick={() => setIsAddExpenseOpen(true)} />
        </Card>

        <AnimatePresence>
          {successFeedback ? (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="space-y-1 border-overtake/35 bg-overtake/10">
                <p className="text-sm font-semibold text-overtake">{successFeedback}</p>
              </Card>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <OvertakeFeedback result={overtakeResult} />

        <DamageGauge summary={summary} />
        <MemberPitList members={members} creatorToken={effectiveCreatorToken} />
        <Leaderboard entries={leaderboardEntries} highlightMemberToken={overtakeResult?.memberToken} />
        <DamageLogList
          expenses={sortedDamageLogs}
          members={members}
          currentMemberToken={currentMemberToken ?? ""}
          onDeleteExpense={handleDeleteExpense}
        />
        <SettlementPanel
          tripId={tripId}
          members={members}
          expenses={expenses}
          currentMemberToken={identity.member.token}
          onUpdatePromptPay={handleUpdatePromptPay}
        />

        {developerNote ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="space-y-2 border-overtake/30 bg-overtake/10">
            <h2 className="font-display text-base font-semibold">สัญญาณสะดุดชั่วคราว ลองใหม่อีกที</h2>
              <p className="text-xs text-muted">ตอนนี้ยังใช้งานต่อได้ตามปกติ แต่เพื่อนอาจเห็นอัปเดตช้าหน่อย</p>
              {showDeveloperNote ? <p className="text-[11px] text-muted/80">dev: {developerNote}</p> : null}
            </Card>
          </motion.div>
        ) : null}

        {isCreator ? (
          <Card className="space-y-3">
            <h2 className="font-display text-lg font-semibold">แชร์ลิงก์ชวนเพื่อน</h2>
            <p className="break-all rounded-control border border-borderSoft bg-track/60 px-3 py-2 text-sm text-text">{shareUrl}</p>
            <Button fullWidth size="md" variant="ghost" onClick={() => void handleCopyShareUrl()}>
              {shareCopied ? "คัดลอกลิงก์แล้ว ✓" : "คัดลอกลิงก์"}
            </Button>
            <p className="text-xs text-muted">ส่งลิงก์ในกลุ่ม แล้วมาดูว่าใครเปย์หนักสุดในรอบนี้</p>
          </Card>
        ) : null}

        {isCreator ? (
          <Card className="space-y-3 border-danger/45 bg-danger/10">
            <h2 className="font-display text-lg font-semibold text-danger">โซนอันตราย</h2>
            <p className="text-sm text-muted">
              ปิดอีเวนต์นี้แล้ว ข้อมูลในเครื่องของทุกคนที่อยู่ในห้องนี้จะถูกเคลียร์ทันที
            </p>
            <Button fullWidth size="md" variant="danger" onClick={() => setIsDeleteTripModalOpen(true)}>
              ปิดอีเวนต์นี้
            </Button>
          </Card>
        ) : null}
      </main>

      <AddExpenseModal
        open={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmitExpense={handleSubmitExpense}
      />

      <Modal open={isDeleteTripModalOpen} title="ยืนยันปิดอีเวนต์" onClose={() => setIsDeleteTripModalOpen(false)}>
        <div className="space-y-5">
          <p className="text-sm text-muted">
            การปิดอีเวนต์นี้ย้อนกลับไม่ได้ และจะพาทุกคนออกจากห้องทันที
          </p>
          <div className="space-y-2">
            <Button
              fullWidth
              size="md"
              variant="danger"
              onClick={() => void handleDeleteTrip()}
              disabled={isDeletingTrip}
            >
              {isDeletingTrip ? "กำลังปิดอีเวนต์..." : "ตกลง"}
            </Button>
            <Button
              fullWidth
              size="md"
              variant="ghost"
              onClick={() => setIsDeleteTripModalOpen(false)}
              disabled={isDeletingTrip}
            >
              ยกเลิก
            </Button>
          </div>
        </div>
      </Modal>

    </MobileShellLayout>
  );
}
