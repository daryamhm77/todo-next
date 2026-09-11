import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const globalMongoose = globalThis;

if (!globalMongoose._mongoose) {
  globalMongoose._mongoose = { conn: null, promise: null };
}

function getMongoUri() {
  const user = encodeURIComponent(process.env.MONGO_USER || "");
  const pass = encodeURIComponent(process.env.MONGO_PASS || "");
  const raw = process.env.MONGO_URI || "";
  return raw
    .replace("${MONGO_USER}", user)
    .replace("${MONGO_PASS}", pass)
    .replace("$MONGO_USER", user)
    .replace("$MONGO_PASS", pass);
}

async function connectDB() {
  const cached = globalMongoose._mongoose;
  if (cached.conn) return cached.conn;

  const uri = getMongoUri();
  if (!uri) {
    throw new Error("Missing MongoDB connection string");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("MongoDB connection failed:", error.message);
    throw new Error("Could not connect to MongoDB. Check MONGO_URI.");
  }
}

export default connectDB;
