// Phone photos are 3–8 MB. Shrink them in the browser before upload so the site stays
// fast and uploads work on mobile data. The server still enforces the 10 MB limit.

const MAX_SIDE = 1800;
const QUALITY = 0.82;

export type PreparedImage = { file: File; width: number; height: number; previewUrl: string };

export async function prepareImage(original: File): Promise<PreparedImage> {
  if (!original.type.startsWith("image/")) throw new Error("Please choose a photo.");

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(original, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Couldn't read that photo. Please try a JPG or PNG.");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (type: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
  // Browsers that cannot encode WebP hand back a PNG instead; use JPEG for those.
  let blob = await encode("image/webp");
  if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg");
  if (!blob) throw new Error("Couldn't prepare that photo. Please try another one.");

  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  const file = new File([blob], `photo.${extension}`, { type: blob.type });
  return { file, width, height, previewUrl: URL.createObjectURL(blob) };
}

/** FormData for an image upload, plus any extra fields. */
export function imageForm(image: PreparedImage, fields: Record<string, string | string[]> = {}) {
  const form = new FormData();
  form.append("file", image.file);
  form.append("width", String(image.width));
  form.append("height", String(image.height));
  for (const [key, value] of Object.entries(fields)) {
    for (const v of Array.isArray(value) ? value : [value]) form.append(key, v);
  }
  return form;
}

/** Server errors arrive as Error objects; show their message, or a friendly default. */
export function errorText(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHORIZED") return "Your session has ended. Please sign in again.";
  if (message === "FORBIDDEN") return "That request was blocked. Please reload the page.";
  return message || "Something went wrong. Please try again.";
}
