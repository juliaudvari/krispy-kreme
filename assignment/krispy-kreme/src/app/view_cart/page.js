"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";

export default function ViewCart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch("/api/getCartItems?email=sample@test.com");
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

  const handleRemoveItem = async (pname) => {
    try {
      const response = await fetch(`/api/removeFromCart?pname=${pname}`, {
        method: "DELETE",
      });
      if (response.ok) {
        const updatedItems = cartItems.filter((item) => item.pname !== pname);
        setCartItems(updatedItems);
        calculateTotal(updatedItems);
      } else {
        console.error("Failed to remove item from cart.");
      }
    } catch (error) {
      console.error("An error occurred while removing item from cart:", error);
    }
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f4f6f8", // Light grey background
        minHeight: "100vh",
        padding: 4,
      }}
    >
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: "#333333", fontWeight: "bold" }} // Darker text color
          >
            Shopping Cart
          </Typography>
          <List>
            {cartItems.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={item.pname}
                    secondary={`Quantity: ${
                      item.quantity
                    } | Price: €${item.price.toFixed(2)}`}
                    sx={{ color: "#333333" }} // Darker text for items
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleRemoveItem(item.pname)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              sx={{ color: "#333333", fontWeight: "bold" }} // Darker text color
            >
              Total: €{total.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
