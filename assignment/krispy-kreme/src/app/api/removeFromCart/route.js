import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("id");

    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required." },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("app");
    const cartCollection = db.collection("shopping_cart");

    const result = await cartCollection.deleteOne({
      _id: new ObjectId(itemId),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json(
        { message: "Item removed from cart." },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Item not found in cart." },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { message: "Failed to remove item from cart." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
