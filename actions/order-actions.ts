"use server";

export async function applyCouponAction(code: string) {
  if (code.trim().toUpperCase() === "FAMILY20") {
    return { success: true, discount: 120 };
  }

  return { success: false, discount: 0 };
}
