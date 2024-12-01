"use client";
import * as React from "react";
import { Button, Typography, Container, Box, CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import { useState, useEffect } from "react";

// Function to add items to the shopping cart
function putInCart(pname) {
  console.log("putting in cart: " + pname);
  fetch("/api/putInCart?pname=" + pname);
}

export default function CustomerPage() {
  const [data, setData] = useState(null);

  // Fetch products from the database
  useEffect(() => {
    fetch("/api/getProducts")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  const theme = createTheme({
    palette: {
      primary: {
        main: green[500],
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container component="main" maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Product Catalog
        </Typography>
        {data.map((item) => (
          <Box
            sx={{
              padding: 2,
              border: "1px solid #ddd",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6">{item.pname}</Typography>
            <Typography variant="body1" color="text.secondary">
              Price: ${item.price}
            </Typography>
            <Button
              onClick={() => putInCart(item.pname)}
              variant="outlined"
              color="primary"
              sx={{ marginTop: 2 }}
            >
              Add to Cart
            </Button>
          </Box>
        ))}
      </Container>
    </ThemeProvider>
  );
}
