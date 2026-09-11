import mongoose from "mongoose";

mongoose.set("strictQuery", false);

const globalMongoose = globalThis;

if (!globalMongoose._mongoose) {
  globalMongoose._mongoose = { conn: null, promise: null };
}

function interpolate(uri) {
  const user = encodeURIComponent(process.env.MONGO_USER || "");
  const pass = encodeURIComponent(process.env.MONGO_PASS || "");
  return uri
    .replace("${MONGO_USER}", user)
    .replace("${MONGO_PASS}", pass)
    .replace("$MONGO_USER", user)
    .replace("$MONGO_PASS", pass);
}

function withDatabaseName(uri) {
  const dbName = process.env.MONGODB_DB || process.env.MONGO_DB || "todolist";
  try {
    const parsed = new URL(uri);
    if (!parsed.pathname || parsed.pathname === "/") {
      parsed.pathname = `/${dbName}`;
    }
    return parsed.toString();
  } catch {
    return uri;
  }
}

function getMongoUri() {
  const raw = process.env.MONGODB_URI || process.env.MONGO_URI || "";
  if (!raw) return "";
  return withDatabaseName(interpolate(raw));
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
    throw new Error("Could not connect to MongoDB. Check MONGODB_URI.");
  }
}

export default connectDB;
