import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("app");
    const loginCollection = db.collection("login");

    const user = await loginCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Hash the input password to compare with the stored hash
    const hashedInputPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    if (hashedInputPassword !== user.password) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if acc_type is present
    if (!user.acc_type) {
      return NextResponse.json(
        { message: "Unknown account type." },
        { status: 400 }
      );
    }

    // Return account type for redirection
    return NextResponse.json(
      { message: "Login successful.", acc_type: user.acc_type },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred during login." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
