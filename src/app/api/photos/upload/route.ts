import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { captureServerException } from "@/lib/posthog-server";
import { checkUploadRateLimit } from "@/lib/rate-limit";

// Issues short-lived client tokens so guests' browsers upload directly to Vercel
// Blob, bypassing the 4.5MB serverless body limit (needed for full-res photos +
// videos). The BLOB_READ_WRITE_TOKEN never leaves the server.
export async function POST(request: NextRequest): Promise<NextResponse> {
  const { allowed } = await checkUploadRateLimit(request);
  if (!allowed) {
    return NextResponse.json(
      { error: "Whoa, that's a lot of uploads in one go! Take a short break and try again in a bit." },
      { status: 429 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/*", "video/*"],
        addRandomSuffix: true,
        maximumSizeInBytes: 500 * 1024 * 1024,
      }),
      // Fires server-to-server after upload. Won't run on localhost; the client
      // also records metadata via POST /api/photos, so this is a no-op safety net.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    await captureServerException(error, { route: "POST /api/photos/upload" });
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
