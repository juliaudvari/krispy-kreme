"use client";
import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
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
  },
});

// Define images for each product
const productImages = {
  "original glazed dozen": "/images/original.png",
  "the grinch dozen": "/images/the-grinch-dozen.png",
  "favourites dozen": "/images/favourites-dozen.png",
  "vegan selection dozen": "/images/vegan-selection-dozen.png",
  "assorted dozen": "/images/assorted-dozen.png",
};

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/getProducts");
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch products.");
        }
      } catch (error) {
        console.error("An error occurred while fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (pname) => {
    try {
      await fetch(`/api/putInCart?pname=${encodeURIComponent(pname)}`);
      alert(`${pname} added to cart!`);
    } catch (error) {
      console.error("An error occurred while adding to cart:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
          padding: 4,
        }}
      >
        <Container component="main" maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#333333", // Darker text
              fontWeight: "bold",
              marginBottom: 4,
            }}
          >
            Products
          </Typography>
          <Grid container spacing={4}>
            {products.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    backgroundColor: "#ffffff", // White card background
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  {/* Product Image */}
                  <Box
                    component="img"
                    src={productImages[product.pname] || "/images/default.png"} // Default image if not specified
                    alt={product.pname}
                    sx={{
                      width: "100%",
                      maxHeight: "200px",
                      objectFit: "cover",
                      borderRadius: 2,
                      marginBottom: 2,
                    }}
                  />
                  {/* Product Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#333333", // Darker text
                      fontWeight: "bold",
                    }}
                  >
                    {product.pname}
                  </Typography>
                  {/* Product Price */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#666666", // Subtle text color
                      margin: "8px 0",
                    }}
                  >
                    Price: €{product.price}
                  </Typography>
                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddToCart(product.pname)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
