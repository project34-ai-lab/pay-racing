import type { ReactElement } from "react";
import { useState } from "react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import type { Member } from "@/modules/member/types/member.types";
import { isValidPromptPay } from "@/modules/payment/utils/validatePromptPay";

type PromptPayDirectoryCardProps = {
  members: Member[];
  currentMemberToken: string;
  onUpdatePromptPay: (nextPromptPay: string) => Promise<{ ok: true } | { ok: false; message: string }>;
};

function normalizePromptPay(value: string): string {
  return value.trim();
}

export function PromptPayDirectoryCard({ members, currentMemberToken, onUpdatePromptPay }: PromptPayDirectoryCardProps): ReactElement {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [draftPromptPay, setDraftPromptPay] = useState<string>("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const entries = members
    .filter((member) => typeof member.promptPay === "string" && member.promptPay.trim().length > 0)
    .map((member) => ({
      token: member.token,
      nickname: member.nickname,
      promptPay: normalizePromptPay(member.promptPay ?? ""),
    }));

  const handleCopy = async (token: string, value: string): Promise<void> => {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      setCopiedToken(token);
      window.setTimeout(() => setCopiedToken(null), 1200);
      return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setCopiedToken(token);
    window.setTimeout(() => setCopiedToken(null), 1200);
  };

  const handleStartEdit = (token: string, value: string): void => {
    setEditingToken(token);
    setDraftPromptPay(value);
    setEditError(null);
  };

  const handleCancelEdit = (): void => {
    setEditingToken(null);
    setDraftPromptPay("");
    setEditError(null);
  };

  const handleSaveEdit = async (): Promise<void> => {
    const normalized = normalizePromptPay(draftPromptPay);
    if (!isValidPromptPay(normalized)) {
      setEditError("PromptPay ต้องเป็นตัวเลข 10 หรือ 13 หลักเท่านั้น");
      return;
    }

    setIsSaving(true);
    const result = await onUpdatePromptPay(normalized);
    setIsSaving(false);
    if (!result.ok) {
      setEditError(result.message);
      return;
    }

    handleCancelEdit();
  };

  return (
    <Card className="space-y-3">
      <h3 className="font-display text-lg font-semibold">รายชื่อ PromptPay ในอีเวนต์</h3>
      <p className="text-xs text-muted">ตั้งให้ครบตั้งแต่หน้าแรก จะได้กดคัดลอกโอนได้ไวตอนสรุปยอด</p>

      {entries.length === 0 ? (
        <div className="rounded-control border border-dashed border-borderSoft bg-track/50 px-3 py-4 text-xs text-muted">
          ยังไม่มี PromptPay ในอีเวนต์นี้
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <motion.article
              key={entry.token}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-control border border-borderSoft bg-track/55 px-3 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-text">{entry.nickname}</p>
                  <p className="text-sm text-muted">{entry.promptPay}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="md"
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={() => void handleCopy(entry.token, entry.promptPay)}
                  >
                    {copiedToken === entry.token ? "คัดลอกแล้ว ✓" : "คัดลอก"}
                  </Button>
                  {entry.token === currentMemberToken ? (
                    <Button
                      size="md"
                      variant="ghost"
                      className="h-8 px-2 text-xs"
                      onClick={() => handleStartEdit(entry.token, entry.promptPay)}
                    >
                      แก้ไข
                    </Button>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Modal open={editingToken !== null} title="แก้ไข PromptPay" onClose={handleCancelEdit}>
        <div className="space-y-4">
          <Input
            id="promptpay-edit"
            label="PromptPay"
            placeholder="0812345678 หรือเลขบัตร 13 หลัก"
            value={draftPromptPay}
            inputMode="numeric"
            onChange={(event) => {
              setDraftPromptPay(event.target.value.replace(/\D/g, ""));
              if (editError) {
                setEditError(null);
              }
            }}
          />
          {editError ? <p className="text-xs text-danger">{editError}</p> : null}
          <div className="space-y-2">
            <Button fullWidth size="md" onClick={() => void handleSaveEdit()} disabled={isSaving}>
              {isSaving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
            <Button fullWidth size="md" variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
              ยกเลิก
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
