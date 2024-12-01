import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    await client.connect();
    const db = client.db("app");
    const ordersCollection = db.collection("orders");

    const orders = await ordersCollection.find({}).toArray();

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
