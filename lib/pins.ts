
import { getDatabase } from "@/lib/mongodb";
import type { PinDocument } from "@/types/pin";

let indexesPromise: Promise<void> | undefined;

export async function getPinsCollection() {
  const db = await getDatabase();
  const collection = db.collection<PinDocument>("pins");

  if (!indexesPromise) {
    indexesPromise = Promise.all([
      collection.createIndex(
        { expiresAt: 1 },
        {
          expireAfterSeconds: 0,
          name: "pins_expiration_ttl",
        }
      ),
      collection.createIndex(
        { workspaceToken: 1 },
        {
          unique: true,
          name: "pins_workspace_token_unique",
        }
      ),
    ])
      .then(() => undefined)
      .catch((error) => {
        indexesPromise = undefined;
        throw error;
      });
  }

  await indexesPromise;

  return collection;
}

/**
 * Reads an active pin without consuming a view.
 */
export async function findActivePin(token: string) {
  const collection = await getPinsCollection();

  return collection.findOne({
    workspaceToken: token,
    expiresAt: { $gt: new Date() },
  });
}

/**
 * Atomically consumes one view of a pin.
 * Returns null if the pin expired, does not exist,
 * or reached its view limit.
 */
export async function consumePinView(token: string) {
  const collection = await getPinsCollection();

  return collection.findOneAndUpdate(
    {
      workspaceToken: token,
      expiresAt: { $gt: new Date() },
      $expr: {
        $lt: [
          { $ifNull: ["$viewsUsed", 0] },
          { $ifNull: ["$maxViews", 1] },
        ],
      },
    },
    {
      $inc: { viewsUsed: 1 },
    },
    {
      returnDocument: "after",
      includeResultMetadata: false,
    }
  );
}
