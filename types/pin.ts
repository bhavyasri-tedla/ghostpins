import type { ObjectId } from "mongodb";

export type ContentType = "code" | "env" | "link" | "text";
export type PinDuration = 15 | 60 | 1440;
export type PinViewLimit = 1 | 3 | 5;

export interface PinDocument {
  _id?: ObjectId;
  workspaceToken: string;
  title: string;
  payload: string;
  contentType: ContentType;
  createdAt: Date;
  expiresAt: Date;
  maxViews: PinViewLimit;
  viewsUsed: number;
}

export interface CreatePinInput {
  title: string;
  payload: string;
  contentType: ContentType;
  durationMinutes: PinDuration;
  maxViews: PinViewLimit;
}