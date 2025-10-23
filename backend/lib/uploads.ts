import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

const uploadDir = join(process.cwd(), "public", "uploads");

export async function ensureUploadDir() {
  await mkdir(uploadDir, { recursive: true });
}

export async function saveFileFromBuffer(buffer: Buffer, extension: string) {
  await ensureUploadDir();
  const fileName = `${randomBytes(8).toString("hex")}.${extension}`;
  const filePath = join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function saveReadableStream(
  stream: ReadableStream<Uint8Array>,
  extension: string
) {
  await ensureUploadDir();
  const fileName = `${randomBytes(8).toString("hex")}.${extension}`;
  const filePath = join(uploadDir, fileName);

  const writer = createWriteStream(filePath);
  const reader = stream.getReader();

  async function pump(): Promise<void> {
    const { done, value } = await reader.read();
    if (done) {
      writer.end();
      return;
    }
    writer.write(Buffer.from(value));
    await pump();
  }

  await pump();

  return `/uploads/${fileName}`;
}
