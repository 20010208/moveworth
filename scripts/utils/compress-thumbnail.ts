/**
 * Thumbnail compression utility — shared by all thumbnail registration scripts.
 *
 * Constants:
 *   MAX_WIDTH  = 1200px   (longer side; images exceeding this are resized)
 *   MAX_BYTES  = 500 KB   (file size threshold; images exceeding this are compressed)
 *
 * Behavior:
 *   - If the image is already ≤ MAX_BYTES AND width ≤ MAX_WIDTH → uploaded as-is (skip compression)
 *   - Otherwise → compress with sharp and re-upload
 *   - DB thumbnail reference is ALWAYS written AFTER compression/upload succeeds
 *
 * This prevents the "skip compression" pattern by making it impossible to write the
 * DB reference without first calling this function.
 */
import sharp from "sharp";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const THUMBNAIL_MAX_WIDTH = 1200;
export const THUMBNAIL_MAX_BYTES = 500 * 1024; // 500KB
const BUCKET = "blog-images";

export type ThumbnailResult = {
  url: string;
  compressed: boolean;
  sizeBefore: number;
  sizeAfter: number;
};

async function downloadFile(sb: SupabaseClient, storagePath: string): Promise<Buffer> {
  const { data, error } = await sb.storage.from(BUCKET).download(storagePath);
  if (error) throw new Error(`Storage download failed (${storagePath}): ${error.message}`);
  return Buffer.from(await data.arrayBuffer());
}

async function compress(buf: Buffer, ext: string): Promise<Buffer> {
  const img = sharp(buf).resize({ width: THUMBNAIL_MAX_WIDTH, withoutEnlargement: true });
  return ext === "png"
    ? img.png({ compressionLevel: 9, effort: 10 }).toBuffer()
    : img.webp({ quality: 82, effort: 5 }).toBuffer();
}

async function uploadFile(sb: SupabaseClient, storagePath: string, buf: Buffer, ext: string): Promise<void> {
  const contentType = ext === "png" ? "image/png" : "image/webp";
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, buf, { contentType, upsert: true });
  if (error) throw new Error(`Storage upload failed (${storagePath}): ${error.message}`);
}

/**
 * Core function: download → compress if needed → upload → return public URL.
 * Callers must use the returned URL when writing the DB thumbnail column.
 */
export async function prepareCompressedThumbnail(
  sb: SupabaseClient,
  storagePath: string,
  supabaseUrl: string,
): Promise<ThumbnailResult> {
  const ext = storagePath.split(".").pop()!.toLowerCase();
  const original = await downloadFile(sb, storagePath);
  const sizeBefore = original.length;
  const meta = await sharp(original).metadata();

  const needsCompress = sizeBefore > THUMBNAIL_MAX_BYTES || (meta.width ?? 0) > THUMBNAIL_MAX_WIDTH;

  let finalBuf = original;
  if (needsCompress) {
    finalBuf = await compress(original, ext);
    await uploadFile(sb, storagePath, finalBuf, ext);
  }

  const url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${storagePath}`;
  return {
    url,
    compressed: needsCompress,
    sizeBefore,
    sizeAfter: finalBuf.length,
  };
}

/** Convenience: create a Supabase client from env (call after loading .env.local) */
export function createSupabaseClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
