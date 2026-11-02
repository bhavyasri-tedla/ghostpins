import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

import { getPinsCollection } from "@/lib/pins";
import { validateCreatePin } from "@/lib/validations";
import type { PinDocument } from "@/types/pin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const input = validateCreatePin(body);

    if (!input) {
      return NextResponse.json(
        { error: "Invalid title, payload, type, duration, or view limit." },
        { status: 400 }
      );
    }

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() + input.durationMinutes * 60 * 1000
    );

    const workspaceToken = randomBytes(16).toString("hex");

    const pin: PinDocument = {
      workspaceToken,
      title: input.title,
      payload: input.payload,
      contentType: input.contentType,
      createdAt: now,
      expiresAt,
      maxViews: input.maxViews,
      viewsUsed: 0,
    };

    const collection = await getPinsCollection();
    await collection.insertOne(pin);

    return NextResponse.json(
      {
        workspaceToken,
        workspaceUrl: `/workspace/${workspaceToken}`,
        expiresAt: expiresAt.toISOString(),
        maxViews: input.maxViews,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("GhostPins create error:", error);

    return NextResponse.json(
      { error: "Unable to create pin." },
      { status: 500 }
    );
  }
}