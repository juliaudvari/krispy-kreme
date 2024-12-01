"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CssBaseline,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/getCartItems");
        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items);
          calculateTotal(data.items);
        } else {
          console.error("Failed to fetch cart items.");
        }
      } catch (error) {
        console.error("An error occurred while fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setTotal(totalAmount);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cartItems,
          total,
        }),
      });

      if (response.ok) {
        setSuccess(
          "Order placed successfully! A confirmation email has been sent."
        );
        setCartItems([]);
        setTotal(0);
        setFormData({ name: "", email: "", address: "" });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to place order.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8", // Light grey background
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#333333", fontWeight: "bold" }} // Darker text color
          >
            Checkout
          </Typography>
          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#333333" } }} // Darker text for labels
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#333333" } }} // Darker text for labels
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="address"
              label="Shipping Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#333333" } }} // Darker text for labels
            />
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{ color: "#333333", fontWeight: "bold" }} // Darker text color
              >
                Order Summary
              </Typography>
              {cartItems.map((item) => (
                <Typography
                  key={item._id}
                  sx={{ color: "#333333" }} // Darker text color
                >
                  {item.pname} - {item.quantity} x €{item.price.toFixed(2)}
                </Typography>
              ))}
              <Typography
                variant="h6"
                sx={{ mt: 2, color: "#333333", fontWeight: "bold" }} // Darker text color
              >
                Total: €{total.toFixed(2)}
              </Typography>
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={24} /> : "Place Order"}
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
