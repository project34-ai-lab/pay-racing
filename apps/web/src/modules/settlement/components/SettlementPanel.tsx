import type { ReactElement } from "react";
import { useMemo } from "react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/Card";
import { publishPaymentConfirmed } from "@/modules/payment/services/paymentRealtime.service";
import { usePaymentStore } from "@/modules/payment/stores/payment.store";
import type { PaymentConfirmationEvent } from "@/modules/payment/types/payment.types";
import type { Expense } from "@/modules/expense/types/expense.types";
import type { Member } from "@/modules/member/types/member.types";
import { PromptPayDirectoryCard } from "@/modules/payment/components/PromptPayDirectoryCard";
import type { TripId } from "@/modules/trip/types/trip.types";
import { SettlementInstructionCard } from "@/modules/settlement/components/SettlementInstructionCard";
import type { SettlementInstruction } from "@/modules/settlement/types/settlement.types";
import { buildSettlementSummary } from "@/modules/settlement/utils/buildSettlementSummary";
import { calculateSettlement } from "@/modules/settlement/utils/calculateSettlement";

type SettlementPanelProps = {
  tripId: TripId;
  members: Member[];
  expenses: Expense[];
  currentMemberToken: string;
  onUpdatePromptPay: (nextPromptPay: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

export function SettlementPanel({
  tripId,
  members,
  expenses,
  currentMemberToken,
  onUpdatePromptPay,
}: SettlementPanelProps): ReactElement {
  const statuses = usePaymentStore((state) => state.statuses);
  const markPaymentComplete = usePaymentStore((state) => state.markPaymentComplete);

  const settlementResult = useMemo(() => calculateSettlement(members, expenses), [members, expenses]);

  const instructions = useMemo(() => {
    return settlementResult.instructions.map((instruction: SettlementInstruction) => ({
      ...instruction,
      status: statuses[instruction.id] ?? "pending",
    }));
  }, [settlementResult.instructions, statuses]);

  const summaryText = useMemo(() => buildSettlementSummary(instructions.filter((item) => item.status !== "completed")), [instructions]);

  const handleConfirm = async (instruction: SettlementInstruction): Promise<void> => {
    if (instruction.status === "completed" || instruction.payerToken !== currentMemberToken) {
      return;
    }

    markPaymentComplete(instruction.id);

    const payload: PaymentConfirmationEvent = {
      paymentId: instruction.id,
      fromMemberToken: instruction.payerToken,
      toMemberToken: instruction.receiverToken,
      amount: instruction.amount,
    };

    await publishPaymentConfirmed(tripId, payload);
  };

  return (
    <section className="space-y-3">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}>
        <Card tone="highlight" className="space-y-2">
          <h2 className="font-display text-2xl font-bold">🏁 สรุปยอดพร้อมแล้ว!</h2>
          <p className="text-sm text-muted">{summaryText}</p>
          <p className="text-xs text-muted">
            Pay Racing แค่ช่วยสรุปยอดและรวม PromptPay ให้คัดลอกง่าย การโอนเงินจริงทำผ่านแอปธนาคารของแต่ละคน
          </p>
        </Card>
      </motion.div>

      {instructions.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card className="space-y-2">
            <p className="text-sm font-semibold text-win">จ่ายครบแล้ว แยกย้ายนอน 🟢</p>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card className="space-y-3">
            <h3 className="font-display text-lg font-semibold">รายการโอนสรุปยอด</h3>
            <div className="space-y-2">
              {instructions.map((instruction: SettlementInstruction) => (
                <SettlementInstructionCard
                  key={instruction.id}
                  instruction={instruction}
                  currentMemberToken={currentMemberToken}
                  onConfirm={handleConfirm}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <PromptPayDirectoryCard
        members={members}
        currentMemberToken={currentMemberToken}
        onUpdatePromptPay={onUpdatePromptPay}
      />
    </section>
  );
}
