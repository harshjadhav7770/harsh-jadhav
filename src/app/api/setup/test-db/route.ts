import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function POST() {
  const uri = process.env.SKILLHUB_MONGODB_URI;

  if (!uri) {
    return NextResponse.json(
      {
        success: false,
        error:
          "SKILLHUB_MONGODB_URI is not set. Please add it to your .env.local file or server environment.",
      },
      { status: 400 }
    );
  }

  try {
    // Attempt standalone test connection with short timeout
    const testConn = await mongoose.createConnection(uri, {
      serverSelectionTimeoutMS: 6000,
      bufferCommands: false,
    }).asPromise();

    await testConn.close();

    return NextResponse.json({
      success: true,
      message: "Successfully connected to MongoDB cluster!",
    });
  } catch (err: any) {
    let cleanMessage = "Failed to connect to MongoDB cluster.";
    if (err.name === "MongoServerSelectionError") {
      cleanMessage =
        "Could not reach MongoDB server. Please check your network, cluster status, and IP whitelist in MongoDB Atlas.";
    } else if (err.codeName === "AtlasError" || err.message?.includes("authentication")) {
      cleanMessage = "Database authentication failed. Please verify your MongoDB username and password.";
    } else if (err.message) {
      cleanMessage = err.message;
    }

    return NextResponse.json(
      { success: false, error: cleanMessage },
      { status: 500 }
    );
  }
}
