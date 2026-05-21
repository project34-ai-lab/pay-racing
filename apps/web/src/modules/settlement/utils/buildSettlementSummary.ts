import type { SettlementInstruction } from "@/modules/settlement/types/settlement.types";

export function buildSettlementSummary(instructions: SettlementInstruction[]): string {
  if (instructions.length === 0) {
    return "เคลียร์ครบเรียบร้อย 🟢";
  }

  if (instructions.length === 1) {
    const instruction = instructions[0];
    return `${instruction.payerNickname} โอนให้ ${instruction.receiverNickname} อีก ฿${instruction.amount.toLocaleString("th-TH")} ก็แยกย้ายได้`;
  }

  return `เหลืออีก ${instructions.length} จังหวะโอน ก็ปิดบิลได้แล้ว!`;
}
