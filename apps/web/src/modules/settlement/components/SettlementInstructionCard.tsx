import type { ReactElement } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import type { SettlementInstruction } from "@/modules/settlement/types/settlement.types";

type SettlementInstructionCardProps = {
  instruction: SettlementInstruction;
  currentMemberToken: string;
  onConfirm: (instruction: SettlementInstruction) => void;
};

export function SettlementInstructionCard({
  instruction,
  currentMemberToken,
  onConfirm,
}: SettlementInstructionCardProps): ReactElement {
  const isCompleted = instruction.status === "completed";
  const canConfirm = instruction.payerToken === currentMemberToken;
  const [copiedPromptPay, setCopiedPromptPay] = useState<boolean>(false);

  const handleCopyPromptPay = async (): Promise<void> => {
    if (!instruction.receiverPromptPay) {
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(instruction.receiverPromptPay);
      setCopiedPromptPay(true);
      window.setTimeout(() => setCopiedPromptPay(false), 1200);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = instruction.receiverPromptPay;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopiedPromptPay(true);
    window.setTimeout(() => setCopiedPromptPay(false), 1200);
  };

  return (
    <motion.article layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="space-y-3 rounded-control border border-borderSoft bg-track/55 px-3 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              <span className="text-muted">{instruction.payerNickname}</span> โอนให้{" "}
              <span className="text-text">{instruction.receiverNickname}</span>
            </p>
            <p className="font-display text-2xl font-bold text-overtake">฿{instruction.amount.toLocaleString("th-TH")}</p>
          </div>
          <span
            className={`shrink-0 rounded-chip border px-3 py-1 text-xs font-semibold ${
              isCompleted ? "border-win/45 bg-win/20 text-win" : "border-overtake/35 bg-overtake/15 text-overtake"
            }`}
          >
            {isCompleted ? "เคลียร์แล้ว 🟢" : "รอโอน"}
          </span>
        </div>

        {instruction.receiverPromptPay ? (
          <div className="flex items-center justify-between gap-2 rounded-control border border-borderSoft bg-track/50 px-3 py-2">
            <p className="text-xs text-muted">
              PromptPay ผู้รับ: <span className="font-semibold text-text">{instruction.receiverPromptPay}</span>
            </p>
            <Button
              size="md"
              variant="ghost"
              className="h-10 shrink-0 px-3 text-xs"
              onClick={() => void handleCopyPromptPay()}
            >
              {copiedPromptPay ? "คัดลอกแล้ว ✓" : "คัดลอก"}
            </Button>
          </div>
        ) : (
          <div className="rounded-control border border-dashed border-borderSoft bg-track/50 px-3 py-3 text-xs text-muted">
            ผู้รับยังไม่ใส่ PromptPay ในอีเวนต์นี้
          </div>
        )}

        <Button
          fullWidth
          variant={isCompleted ? "ghost" : "turbo"}
          disabled={isCompleted || !canConfirm}
          onClick={() => onConfirm(instruction)}
        >
          {isCompleted ? "เคลียร์ครบเรียบร้อย 🟢" : canConfirm ? "โอนแล้ว กดเขียว" : "รอคนโอนกดยืนยัน"}
        </Button>
      </div>
    </motion.article>
  );
}
