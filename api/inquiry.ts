import { Resend } from "resend";

type InquiryPayload = {
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

type VercelApiResponse = {
  status: (code: number) => { json: (body: unknown) => void };
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parsePayload(body: unknown): InquiryPayload | null {
  if (!isRecord(body)) return null;
  const flat_id = String(body.flat_id ?? "").trim();
  const building = String(body.building ?? "").trim();
  const building_label = String(body.building_label ?? "").trim();
  const first_name = String(body.first_name ?? "").trim();
  const last_name = String(body.last_name ?? "").trim();
  const user_email = String(body.user_email ?? "").trim();
  const user_phone = String(body.user_phone ?? "").trim();
  const floor = Number(body.floor);
  const size_m2 = Number(body.size_m2);
  const price_kc = Number(body.price_kc);

  if (!flat_id || !building || !first_name || !last_name || !user_email || !user_phone) {
    return null;
  }
  if (!Number.isFinite(floor) || !Number.isFinite(size_m2) || !Number.isFinite(price_kc)) {
    return null;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user_email)) return null;

  return {
    flat_id,
    building,
    building_label,
    floor,
    size_m2,
    price_kc,
    first_name,
    last_name,
    user_email,
    user_phone,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseRequestJson(req: { body?: unknown }):
  | { ok: true; parsed: unknown }
  | { ok: false; error: string; detail: string } {
  const raw = req.body;
  if (raw === undefined || raw === null) {
    return {
      ok: false,
      error: "empty_body",
      detail:
        "Request body was empty. On Vercel, ensure POST /api/inquiry is handled by the serverless function (see docs/RESEND.md).",
    };
  }
  if (typeof raw === "string") {
    try {
      return { ok: true, parsed: JSON.parse(raw) };
    } catch {
      return { ok: false, error: "invalid_json", detail: "Body is not valid JSON." };
    }
  }
  if (typeof raw === "object") {
    return { ok: true, parsed: raw };
  }
  return { ok: false, error: "invalid_body", detail: "Unexpected body type." };
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: VercelApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    return res.status(503).json({ error: "not_configured" });
  }

  const json = parseRequestJson(req);
  if (!json.ok) {
    return res.status(400).json({ error: json.error, detail: json.detail });
  }

  const payload = parsePayload(json.parsed);
  if (!payload) {
    return res.status(400).json({
      error: "invalid_payload",
      detail: "Missing or invalid fields (or invalid email format).",
    });
  }

  const resend = new Resend(apiKey);
  const subject = `Poptávka bytu ${payload.flat_id} — ${payload.building_label}`;

  const html = `
  <h1 style="font-family:system-ui,sans-serif;font-size:18px;">Nová poptávka bytu</h1>
  <table style="font-family:system-ui,sans-serif;font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Byt</strong></td><td>${escapeHtml(payload.flat_id)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Budova</strong></td><td>${escapeHtml(payload.building_label)} (${escapeHtml(payload.building)})</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Podlaží</strong></td><td>${payload.floor}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Plocha</strong></td><td>${payload.size_m2} m²</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Cena</strong></td><td>${payload.price_kc} Kč</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Jméno</strong></td><td>${escapeHtml(`${payload.first_name} ${payload.last_name}`)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>E-mail</strong></td><td>${escapeHtml(payload.user_email)}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;vertical-align:top;"><strong>Telefon</strong></td><td>${escapeHtml(payload.user_phone)}</td></tr>
  </table>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.user_email,
      subject,
      html,
    });
    if (error) {
      const detail = `${error.name}: ${error.message}`;
      console.error("[api/inquiry] Resend", error);
      return res.status(502).json({
        error: "send_failed",
        detail,
        code: error.name,
      });
    }
    return res.status(200).json({ ok: true, id: data?.id });
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    console.error("[api/inquiry]", e);
    return res.status(502).json({ error: "send_failed", detail });
  }
}
