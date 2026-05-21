import type { ReactElement } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppWordmark } from "@/components/AppWordmark";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MobileShellLayout } from "@/layouts/MobileShellLayout";
import { useLocalIdentity } from "@/modules/member/hooks/useLocalIdentity";
import { isValidPromptPay } from "@/modules/payment/utils/validatePromptPay";
import { clearDeletedTripMark } from "@/modules/trip/services/deletedTrip.storage";
import { createTrip } from "@/modules/trip/services/trip.service";

export function LandingPage(): ReactElement {
  const navigate = useNavigate();
  const [tripName, setTripName] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [creatorPromptPay, setCreatorPromptPay] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const { saveIdentity, setTripCreator } = useLocalIdentity();

  const handleCreateTrip = (): void => {
    const trimmedCreatorName = creatorName.trim();
    const trimmedPromptPay = creatorPromptPay.trim();
    if (trimmedCreatorName.length < 2) {
      setFormError("ชื่อผู้สร้างอีเวนต์ต้องมีอย่างน้อย 2 ตัวอักษร");
      return;
    }
    if (trimmedPromptPay.length === 0) {
      setFormError("ใส่ PromptPay ก่อนเปิดอีเวนต์");
      return;
    }
    if (!isValidPromptPay(trimmedPromptPay)) {
      setFormError("PromptPay ต้องเป็นตัวเลข 10 หรือ 13 หลักเท่านั้น");
      return;
    }

    setFormError(null);
    const result = createTrip(window.location.origin, tripName);
    clearDeletedTripMark(result.trip.id);
    const identity = saveIdentity({
      tripId: result.trip.id,
      nickname: trimmedCreatorName,
      promptPay: trimmedPromptPay,
    });
    setTripCreator(result.trip.id, identity.member.token);
    const nameQuery = encodeURIComponent(result.trip.name);
    navigate(`${result.tripRoomPath}?name=${nameQuery}`);
  };

  return (
    <MobileShellLayout>
      <main className="flex flex-1 flex-col gap-5 pt-1">
        <Card tone="highlight" className="space-y-5">
          <AppWordmark />
          <p className="text-sm text-muted">เปิดอีเวนต์ใหม่ แล้วโยนลิงก์ให้แก๊งเข้ามาเคลียร์ค่ากิจกรรมพร้อมกันได้เลย 🏁</p>
          <Input
            id="trip-name"
            label="ชื่ออีเวนต์"
            placeholder="เช่น ทริปกาญฯ / ปาร์ตี้คืนศุกร์ / มื้อเย็นทีม"
            value={tripName}
            onChange={(event) => setTripName(event.target.value)}
          />
          <Input
            id="creator-name"
            label="ผู้สร้างอีเวนต์"
            placeholder="เช่น Mai"
            value={creatorName}
            onChange={(event) => setCreatorName(event.target.value)}
          />
          <Input
            id="creator-promptpay"
            label="PromptPay"
            placeholder="0812345678"
            helperText="ต้องใส่ก่อนเปิดอีเวนต์"
            value={creatorPromptPay}
            onChange={(event) => {
              setCreatorPromptPay(event.target.value.replace(/\D/g, ""));
              if (formError) {
                setFormError(null);
              }
            }}
          />
          {formError ? <p className="text-xs text-danger">{formError}</p> : null}

          <Button
            fullWidth
            size="lg"
            onClick={handleCreateTrip}
            disabled={creatorName.trim().length < 2 || creatorPromptPay.trim().length === 0}
          >
            เปิดอีเวนต์ใหม่ 🏁
          </Button>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">อีเวนต์นี้ไม่มีล็อกอิน</h2>
            <Badge tone="live">ไม่มี OTP</Badge>
          </div>
          <p className="text-sm text-muted">
            ตั้งชื่อผู้สร้างอีเวนต์แล้วเข้าได้เลย ไม่ต้องสมัคร ไม่ต้องยืนยันอีเมล ไม่ต้องตั้งรหัสผ่าน
          </p>
        </Card>
      </main>
    </MobileShellLayout>
  );
}
