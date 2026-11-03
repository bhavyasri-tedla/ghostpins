
import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ghostpins";

if (!uri) {
  throw new Error("Missing MONGODB_URI in .env.local");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 60000,
  connectTimeoutMS: 10000,
};

declare global {
  // eslint-disable-next-line no-var
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

const clientPromise =
  global.mongoClientPromise ?? client.connect();

if (process.env.NODE_ENV !== "production") {
  global.mongoClientPromise = clientPromise;
}

export async function getMongoClient() {
  return clientPromise;
}

export async function getDatabase() {
  const mongoClient = await getMongoClient();

  // Always use the database name configured in .env.local.
  return mongoClient.db(dbName);
}
