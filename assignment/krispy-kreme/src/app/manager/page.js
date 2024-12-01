"use client";
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
    },
    background: {
      default: "#f4f6f8", // Light grey background
    },
    text: {
      primary: "#333333", // Darker text color
    },
  },
});

export default function ManagerPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/getOrders");
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders);
        } else {
          console.error("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("An error occurred while fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            backgroundColor: "#f4f6f8",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: "#f4f6f8",
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Container component="main" maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: "center",
              marginBottom: 4,
              color: "#333333", // Set to a darker color
            }}
          >
            Manager Dashboard
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              borderRadius: 2,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Order Summary</TableCell>
                  <TableCell>Total (€)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.email}</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>
                      {order.cartItems.map((item, index) => (
                        <div key={index}>
                          {item.pname} - {item.quantity} x €
                          {item.price.toFixed(2)}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>€{order.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
