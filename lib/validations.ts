import type {
  ContentType,
  CreatePinInput,
  PinDuration,
  PinViewLimit,
} from "@/types/pin";

const ALLOWED_TYPES: ContentType[] = [
  "code",
  "env",
  "link",
  "text",
];

const ALLOWED_DURATIONS: PinDuration[] = [
  15,
  60,
  1440,
];

const ALLOWED_VIEW_LIMITS: PinViewLimit[] = [
  1,
  3,
  5,
];

export function validateCreatePin(
  body: unknown
): CreatePinInput | null {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return null;
  }

  const input = body as Record<string, unknown>;

  const title =
    typeof input.title === "string"
      ? input.title.trim()
      : "";

  const payload =
    typeof input.payload === "string"
      ? input.payload
      : "";

  const contentType = input.contentType;
  const durationMinutes = input.durationMinutes;
  const maxViews = input.maxViews;

  if (
    !title ||
    title.length > 100 ||
    !payload ||
    Buffer.byteLength(payload, "utf8") > 100_000 ||
    typeof contentType !== "string" ||
    !ALLOWED_TYPES.includes(contentType as ContentType) ||
    typeof durationMinutes !== "number" ||
    !ALLOWED_DURATIONS.includes(
      durationMinutes as PinDuration
    ) ||
    typeof maxViews !== "number" ||
    !ALLOWED_VIEW_LIMITS.includes(maxViews as PinViewLimit)
  ) {
    return null;
  }

  return {
    title,
    payload,
    contentType: contentType as ContentType,
    durationMinutes: durationMinutes as PinDuration,
    maxViews: maxViews as PinViewLimit,
  };
}