import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
//import nodemailer from "nodemailer";

const uri = process.env.DB_ADDRESS;
const client = new MongoClient(uri);

export async function POST(req) {
  try {
    const { name, email, address, cartItems, total } = await req.json();

    if (!name || !email || !address || !cartItems || total <= 0) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("app");
    const ordersCollection = db.collection("orders");

    const newOrder = {
      name,
      email,
      address,
      cartItems,
      total,
      placedAt: new Date(),
    };

    await ordersCollection.insertOne(newOrder);

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      text: `Thank you for your order, ${name}! Your total is €${total.toFixed(
        2
      )}. Your order will be shipped to: ${address}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Order placed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { message: "Failed to place order." },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
