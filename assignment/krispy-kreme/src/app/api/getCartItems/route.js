import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function GET(req) {
  try {
    await client.connect();
    const db = client.db("app");
    const cartCollection = db.collection("shopping_cart");
    const productsCollection = db.collection("products");

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email") || "sample@test.com";

    // Fetch all cart items for the user
    const cartItems = await cartCollection
      .find({ username: userEmail })
      .toArray();

    // Group items by pname and sum their quantities
    const groupedItems = cartItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.pname === item.pname);
      if (existingItem) {
        existingItem.quantity += 1; // Increment quantity
      } else {
        acc.push({ pname: item.pname, quantity: 1 });
      }
      return acc;
    }, []);

    // Enrich grouped items with price from the products collection
    const enrichedItems = await Promise.all(
      groupedItems.map(async (item) => {
        const product = await productsCollection.findOne({ pname: item.pname });
        return {
          pname: item.pname,
          price: product ? parseFloat(product.price) : 0, // Default price to 0 if not found
          quantity: item.quantity,
        };
      })
    );

    return NextResponse.json({ items: enrichedItems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    return NextResponse.json(
      { message: "Failed to fetch cart items." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
