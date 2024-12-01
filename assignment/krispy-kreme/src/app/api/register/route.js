import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import crypto from "crypto";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("app");
    const loginCollection = db.collection("login");

    // Check if the user already exists
    const existingUser = await loginCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    // Create a new user with a default account type
    const newUser = {
      name,
      email,
      password: hashedPassword,
      acc_type: "customer", // Default account type
      createdAt: new Date(),
    };

    await loginCollection.insertOne(newUser);

    return NextResponse.json(
      { message: "User registered successfully." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred during registration." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
