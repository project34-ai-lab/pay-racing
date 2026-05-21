import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type DeletedTripNoticeCardProps = {
  onBack: () => void;
};

export function DeletedTripNoticeCard({ onBack }: DeletedTripNoticeCardProps): ReactElement {
  const [secondsLeft, setSecondsLeft] = useState<number>(5);
  const hasRedirectedRef = useRef<boolean>(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((current) => current - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft > 0 || hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    onBack();
  }, [onBack, secondsLeft]);

  const handleBack = (): void => {
    if (hasRedirectedRef.current) {
      return;
    }

    hasRedirectedRef.current = true;
    onBack();
  };

  return (
    <Card className="space-y-3 border-danger/45 bg-danger/10">
      <h1 className="font-display text-xl font-bold text-danger">ไม่พบอีเวนต์นี้แล้ว</h1>
      <p className="text-sm text-muted">อีเวนต์นี้ถูกปิดแล้ว กดกลับไปสร้างอีเวนต์ใหม่ได้เลย</p>
      <p className="text-xs text-muted">จะพากลับหน้าเปิดอีเวนต์ใหม่อัตโนมัติใน {secondsLeft} วินาที</p>
      <Button fullWidth size="lg" variant="ghost" onClick={handleBack}>
        กลับไปเปิดอีเวนต์ใหม่
      </Button>
    </Card>
  );
}
