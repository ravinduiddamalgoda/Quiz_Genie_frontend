"use client";

import React from "react";
import { Button, Typography, Paper, Box, Container, Divider } from "@mui/material";
import { CheckCircle, Home, Download, WavingHand } from "@mui/icons-material";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { Edit, Eye } from "lucide-react";

const ThankYouReview = () => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add content to PDF
    doc.setFontSize(22);
    doc.setTextColor(25, 118, 210); // Blue color
    doc.text("Review Confirmation", 105, 20, { align: "center" });
    
    doc.setTextColor(0, 0, 0); // Reset to black
    doc.setFontSize(12);
    doc.text("Thank you for submitting your review!", 105, 40, { align: "center" });
    doc.text("Your feedback is valuable to us and helps improve our services.", 105, 50, { align: "center" });
    doc.text("Review ID: " + Math.random().toString(36).substr(2, 9).toUpperCase(), 105, 70, { align: "center" });
    doc.text("Date: " + new Date().toLocaleDateString(), 105, 80, { align: "center" });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text("© 2025 Company Name. All rights reserved.", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save("review-confirmation.pdf");
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper
        elevation={5}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          backgroundImage: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          position: "relative",
          overflow: "hidden",
          border: "1px solid #e0e9ff"
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            backgroundColor: "#1976D2"
          }}
        />
        
        <Box 
          sx={{
            backgroundColor: "#E3F2FD",
            width: 110,
            height: 110,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.15)"
          }}
        >
          <CheckCircle
            sx={{
              fontSize: 70,
              color: "#1976D2",
            }}
          />
        </Box>
        
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#1976D2",
            mb: 1,
            letterSpacing: "0.5px"
          }}
        >
          Thank You!
        </Typography>
        
        <Divider 
          sx={{ 
            width: "60px", 
            borderColor: "#90CAF9", 
            borderWidth: 2,
            my: 2
          }} 
        />
        
        <Typography
          variant="body1"
          paragraph
          sx={{
            mb: 3,
            textAlign: "center",
            maxWidth: "85%",
            fontSize: "1.1rem",
            lineHeight: 1.6,
            color: "#424242"
          }}
        >
          Your review has been submitted successfully. We appreciate your valuable feedback and the time you've taken to share your thoughts with us.
        </Typography>
        
        <Box
          sx={{
            backgroundColor: "#F5F9FF",
            p: 2,
            mb: 4,
            borderRadius: 2,
            border: "1px dashed #90CAF9",
            width: "80%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#546E7A",
              textAlign: "center",
              fontStyle: "italic"
            }}
          >
            Your review will be published after moderation. You'll receive a notification once it's live.
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" }
          }}
        >
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={generatePDF}
            sx={{
              px: 3,
              py: 1.5,
              fontWeight: 600,
              backgroundColor: "#1976D2",
              borderRadius: "50px",
              boxShadow: "0 4px 8px rgba(25, 118, 210, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#0D47A1",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 10px rgba(25, 118, 210, 0.4)"
              }
            }}
          >
            Download Confirmation
          </Button>
          
          <Link href="/" passHref>
            <Button
              variant="outlined"
              startIcon={<Home />}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderColor: "#1976D2",
                borderWidth: 2,
                color: "#1976D2",
                borderRadius: "50px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#1976D2",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              Return Home
            </Button>
          </Link>
          <Link href="edit_deletePage" passHref>
            <Button
              variant="outlined"
              startIcon={<Eye />}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                borderColor: "#1976D2",
                borderWidth: 2,
                color: "#1976D2",
                borderRadius: "50px",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "#1976D2",
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                  transform: "translateY(-2px)"
                }
              }}
            >
              View Reviews
            </Button>
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ThankYouReview;