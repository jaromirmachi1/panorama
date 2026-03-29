export type InquiryRequestBody = {
  flat_id: string;
  building: string;
  building_label: string;
  floor: number;
  size_m2: number;
  price_kc: number;
  first_name: string;
  last_name: string;
  user_email: string;
  user_phone: string;
};

function inquiryUrl(): string {
  const base = import.meta.env.VITE_INQUIRY_API_BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/api/inquiry`;
}

export async function submitApartmentInquiry(
  body: InquiryRequestBody,
): Promise<{ ok: true } | { ok: false; reason: "not_configured" | "failed" }> {
  const res = await fetch(inquiryUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.status === 503) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (data.error === "not_configured") {
      return { ok: false, reason: "not_configured" };
    }
    return { ok: false, reason: "failed" };
  }

  if (!res.ok) {
    return { ok: false, reason: "failed" };
  }

  return { ok: true };
}
