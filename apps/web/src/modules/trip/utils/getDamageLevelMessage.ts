import type { DamageLevel } from "@/modules/trip/types/dashboard.types";

export function getDamageLevelMessage(totalDamage: number): { level: DamageLevel; message: string } {
  if (totalDamage < 1000) {
    return {
      level: "warmup",
      message: "วอร์มเครื่องก่อน ยังแค่ขูดเบา ๆ",
    };
  }

  if (totalDamage < 3000) {
    return {
      level: "drifting",
      message: "เริ่มดริฟต์แล้ว กระเป๋ามีสะเทือน",
    };
  }

  if (totalDamage < 7000) {
    return {
      level: "turbo",
      message: "ล้อฟรีกระเป๋าฉีก 💸",
    };
  }

  return {
    level: "meltdown",
    message: "อีเวนต์เดือด! ตู้ ATM สั่นทั้งแผง",
  };
}
