import { NextRequest, NextResponse } from "next/server";
import { artifactManager } from "@/services/artifact-manager";
import fs from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string; filename: string }> }
) {
  const { runId, filename } = await params;
  const filePath = artifactManager.getArtifactPath(runId, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Artifact not found" }, { status: 404 });
  }

  const file = fs.readFileSync(filePath);
  
  // Set appropriate content type based on extension
  let contentType = "application/octet-stream";
  if (filename.endsWith(".png")) contentType = "image/png";
  if (filename.endsWith(".json")) contentType = "application/json";
  if (filename.endsWith(".txt")) contentType = "text/plain";
  if (filename.endsWith(".diff")) contentType = "text/plain";

  return new NextResponse(file, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
