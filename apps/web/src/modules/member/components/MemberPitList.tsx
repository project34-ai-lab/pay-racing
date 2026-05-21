import type { ReactElement } from "react";

import { Card } from "@/components/ui/Card";
import type { Member } from "@/modules/member/types/member.types";

type MemberPitListProps = {
  members: Member[];
  creatorToken: string | null;
};

export function MemberPitList({ members, creatorToken }: MemberPitListProps): ReactElement {
  if (members.length === 0) {
    return (
      <Card className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-text">สมาชิกในอีเวนต์</h2>
        <p className="text-sm text-muted">ยังไม่มีสมาชิกในอีเวนต์ แชร์ลิงก์ชวนเพื่อนเข้ามาได้เลย</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-2">
      <h2 className="font-display text-lg font-semibold text-text">สมาชิกในอีเวนต์</h2>
      <div className="flex flex-wrap gap-2">
        {members.map((member: Member) => (
          <span
            key={member.token}
            className="rounded-chip border border-borderSoft bg-surfaceAlt/65 px-3 py-1.5 text-xs font-semibold text-text"
          >
            {member.nickname}
            {creatorToken && member.token === creatorToken ? " • ผู้สร้างอีเวนต์" : " • สมาชิก"}
          </span>
        ))}
      </div>
    </Card>
  );
}
