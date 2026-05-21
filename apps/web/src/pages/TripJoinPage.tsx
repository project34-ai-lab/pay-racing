import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { AppWordmark } from "@/components/AppWordmark";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { MobileShellLayout } from "@/layouts/MobileShellLayout";
import { useLocalIdentity } from "@/modules/member/hooks/useLocalIdentity";
import type { JoinTripInput } from "@/modules/member/types/member.types";
import { DeletedTripNoticeCard } from "@/modules/trip/components/DeletedTripNoticeCard";
import { isDeletedTrip, markDeletedTrip } from "@/modules/trip/services/deletedTrip.storage";
import type { TripId } from "@/modules/trip/types/trip.types";
import { subscribeTripDeleted } from "@/modules/trip/services/tripRealtime.service";
import { useEffect } from "react";

type JoinTripFormValues = {
  nickname: string;
  promptPay: string;
};

function normalizeTripId(value: string | undefined): TripId | null {
  if (!value?.trim()) {
    return null;
  }

  return value.trim().toUpperCase();
}

export function TripJoinPage(): ReactElement {
  const navigate = useNavigate();
  const params = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const { saveIdentity } = useLocalIdentity();

  const tripId = normalizeTripId(params.tripId);
  const tripNameFromQuery = searchParams.get("name")?.trim();
  const tripName = tripNameFromQuery || "อีเวนต์หารค่าใช้จ่าย";

  const form = useForm<JoinTripFormValues>({
    defaultValues: {
      nickname: "",
      promptPay: "",
    },
  });
  useEffect(() => {
    if (!tripId) {
      return;
    }

    const subscription = subscribeTripDeleted(tripId, () => {
      markDeletedTrip(tripId);
      navigate(`/trip/${tripId}/join`, { replace: true });
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate, tripId]);

  const handleJoin = form.handleSubmit((values: JoinTripFormValues) => {
    if (!tripId) {
      return;
    }

    const nickname = values.nickname.trim();

    if (nickname.length < 2) {
      form.setError("nickname", {
        message: "ชื่อสมาชิกต้องมีอย่างน้อย 2 ตัวอักษร",
      });
      return;
    }
    const trimmedPromptPay = values.promptPay.trim();
    if (trimmedPromptPay.length === 0) {
      form.setError("promptPay", {
        message: "ใส่ PromptPay ก่อนเข้าร่วมอีเวนต์",
      });
      return;
    }

    const joinInput: JoinTripInput = {
      tripId,
      nickname,
      promptPay: trimmedPromptPay,
    };

    saveIdentity(joinInput);
    const roomUrl = new URL(`/trip/${tripId}`, window.location.origin);
    roomUrl.searchParams.set("name", tripName);
    navigate(`${roomUrl.pathname}${roomUrl.search}`);
  });

  if (!tripId) {
    return (
      <MobileShellLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Card className="space-y-3">
          <h1 className="font-display text-xl font-bold">ลิงก์อีเวนต์ไม่ถูกต้อง</h1>
          <p className="text-sm text-muted">ลิงก์อาจไม่ครบ ลองเช็ก URL แล้วเข้าใหม่อีกที</p>
          <Button fullWidth onClick={() => navigate("/")}>กลับหน้าแรก</Button>
          </Card>
        </motion.div>
      </MobileShellLayout>
    );
  }

  if (isDeletedTrip(tripId)) {
    return (
      <MobileShellLayout>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <DeletedTripNoticeCard onBack={() => navigate("/", { replace: true })} />
        </motion.div>
      </MobileShellLayout>
    );
  }

  return (
    <MobileShellLayout>
      <main className="flex flex-1 flex-col gap-4">
        <Card tone="highlight" className="space-y-4">
          <AppWordmark />
          <div className="inline-flex min-w-0 flex-col rounded-chip border border-podium/45 bg-podium/20 px-3 py-1.5">
            <span className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-podium">{tripName}</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-nitro">รหัสอีเวนต์: {tripId}</span>
          </div>
          <h1 className="font-display text-2xl font-bold">เข้าร่วมอีเวนต์นี้</h1>
          <p className="text-sm text-muted">ใส่ชื่อกับ PromptPay ให้ครบ แล้วเข้าไปสนุกกับเพื่อนได้เลย</p>

          <form onSubmit={handleJoin} className="space-y-3" noValidate>
            <Input id="nickname" label="สมาชิก" placeholder="เช่น Mint" {...form.register("nickname")} />
            {form.formState.errors.nickname?.message ? (
              <p className="text-xs text-danger">{form.formState.errors.nickname.message}</p>
            ) : null}

            <Input
              id="promptpay"
              label="PromptPay"
              placeholder="0812345678"
              helperText="ต้องใส่ก่อนเข้าร่วมอีเวนต์"
              {...form.register("promptPay")}
            />
            {form.formState.errors.promptPay?.message ? (
              <p className="text-xs text-danger">{form.formState.errors.promptPay.message}</p>
            ) : null}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={form.watch("nickname").trim().length < 2 || form.watch("promptPay").trim().length === 0}
            >
              {form.formState.isSubmitting ? "กำลังพาเข้าอีเวนต์..." : "เข้าร่วมอีเวนต์เลย 🚗✨"}
            </Button>
          </form>
        </Card>

        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">อีเวนต์นี้ไม่มีล็อกอิน</h2>
            <Badge tone="live">ไม่มี OTP</Badge>
          </div>
          <p className="text-sm text-muted">เข้าร่วมแบบสมาชิกแล้วลุยได้ทันที ไม่ต้องสมัครบัญชี</p>
        </Card>
      </main>
    </MobileShellLayout>
  );
}
