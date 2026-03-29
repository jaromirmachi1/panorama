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
  /** Optional message from the visitor */
  note: string;
};

function inquiryUrl(): string {
  const base = import.meta.env.VITE_INQUIRY_API_BASE_URL?.replace(/\/$/, "") ?? "";
  return `${base}/api/inquiry`;
}

export type InquirySubmitResult =
  | { ok: true }
  | {
      ok: false;
      reason: "not_configured" | "failed";
      detail?: string;
    };

export async function submitApartmentInquiry(
  body: InquiryRequestBody,
): Promise<InquirySubmitResult> {
  let res: Response;
  try {
    res = await fetch(inquiryUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    const detail =
      e instanceof Error ? e.message : "Network error (offline or blocked request).";
    return { ok: false, reason: "failed", detail };
  }

  const data = (await res.json().catch(() => ({}))) as {
    error?: string;
    detail?: string;
  };

  if (res.status === 503 && data.error === "not_configured") {
    return { ok: false, reason: "not_configured" };
  }

  if (!res.ok) {
    const hint =
      res.status === 404
        ? "POST /api/inquiry returned 404 — serverless API may be missing on this deploy (check Vercel Functions tab)."
        : data.detail;
    return {
      ok: false,
      reason: "failed",
      detail: hint ?? data.error ?? `HTTP ${res.status}`,
    };
  }

  return { ok: true };
}
