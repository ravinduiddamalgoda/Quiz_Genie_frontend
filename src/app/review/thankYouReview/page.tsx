"use client";

import React, { useState, useEffect } from "react";
import { 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Container, 
  Divider, 
  Avatar,
  Tooltip,
  Zoom,
  Grow,
  Fade
} from "@mui/material";
import { 
  CheckCircle, 
  Home, 
  Download, 
  Favorite,
  Celebration,
  Timeline
} from "@mui/icons-material";
import Link from "next/link";
import { jsPDF } from "jspdf";
import { Eye } from "lucide-react";

const ThankYouReview = () => {
  // Animation state for elements
  const [showElements, setShowElements] = useState(false);
  
  // Generate a review ID once when component mounts
  const [reviewId] = useState(() => Math.random().toString(36).substr(2, 9).toUpperCase());
  
  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowElements(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // PDF generation function
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
    doc.text("Review ID: " + reviewId, 105, 70, { align: "center" });
    doc.text("Date: " + new Date().toLocaleDateString(), 105, 80, { align: "center" });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray
    doc.text("© 2025 Company Name. All rights reserved.", 105, 280, { align: "center" });
    
    // Save the PDF
    doc.save("review-confirmation.pdf");
  };

  return (
    <Container maxWidth="md" sx={{ 
      py: 5,
      background: "linear-gradient(135deg, #f5f9ff 0%, #ffffff 100%)",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <Grow in={true} timeout={800}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 4,
            backgroundColor: "#FFFFFF",
            boxShadow: "0 12px 30px rgba(25, 118, 210, 0.15)",
            position: "relative",
            overflow: "hidden",
            border: "1px solid #e0e9ff",
            width: "100%"
          }}
        >
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "10px",
              background: "linear-gradient(90deg, #1976D2, #64B5F6)"
            }}
          />
          
          {/* Decorative circles in background */}
          <Box sx={{ 
            position: "absolute", 
            top: 20, 
            left: 20, 
            width: 100, 
            height: 100, 
            borderRadius: "50%", 
            backgroundColor: "rgba(144, 202, 249, 0.15)",
            zIndex: 0
          }}/>
          
          <Box sx={{ 
            position: "absolute", 
            bottom: 20, 
            right: 20, 
            width: 120, 
            height: 120, 
            borderRadius: "50%", 
            backgroundColor: "rgba(144, 202, 249, 0.1)",
            zIndex: 0
          }}/>
          
          <Zoom in={showElements} timeout={1000}>
            <Box 
              sx={{
                backgroundColor: "#E3F2FD",
                width: 130,
                height: 130,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mb: 3,
                boxShadow: "0 6px 16px rgba(25, 118, 210, 0.25)",
                position: "relative",
                zIndex: 1
              }}
            >
              <Box
                sx={{
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      opacity: 1,
                    },
                    "50%": {
                      transform: "scale(1.05)",
                      opacity: 0.8,
                    },
                    "100%": {
                      transform: "scale(1)",
                      opacity: 1,
                    },
                  },
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 80,
                    color: "#1976D2",
                  }}
                />
              </Box>
            </Box>
          </Zoom>
          
          <Fade in={showElements} timeout={1500}>
            <Box sx={{ textAlign: "center", zIndex: 1 }}>
              <Typography
                variant="h3"
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
                  width: "80px", 
                  borderColor: "#90CAF9", 
                  borderWidth: 3,
                  my: 2,
                  mx: "auto",
                  borderRadius: 1
                }} 
              />
              
              <Typography
                variant="body1"
                paragraph
                sx={{
                  mb: 4,
                  textAlign: "center",
                  maxWidth: "90%",
                  fontSize: "1.2rem",
                  lineHeight: 1.6,
                  color: "#424242",
                  mx: "auto"
                }}
              >
                Your review has been submitted successfully. We appreciate your valuable feedback and the time you've taken to share your thoughts with us.
              </Typography>
            </Box>
          </Fade>
          
          <Zoom in={showElements} timeout={2000}>
            <Box
              sx={{
                backgroundColor: "rgba(245, 249, 255, 0.8)",
                p: 3,
                mb: 4,
                borderRadius: 3,
                border: "1px dashed #90CAF9",
                width: "85%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 2,
                backdropFilter: "blur(8px)",
                boxShadow: "inset 0 2px 8px rgba(25, 118, 210, 0.08)"
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Timeline sx={{ color: "#1976D2" }} />
                <Typography sx={{ color: "#546E7A", fontWeight: 600 }}>
                  Review Status:
                </Typography>
                <Typography sx={{ color: "#1976D2", fontWeight: 600 }}>
                  Pending Moderation
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: "#546E7A",
                  textAlign: "center"
                }}
              >
                Your review will be published shortly after our team reviews it. You'll receive a notification once it's live.
              </Typography>
              
              <Box sx={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                mt: 1,
                gap: 1
              }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#263238" }}>
                  Review ID:
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "monospace", color: "#1976D2" }}>
                  {reviewId}
                </Typography>
              </Box>
            </Box>
          </Zoom>
          
          <Grow in={showElements} timeout={2500}>
            <Box
              sx={{
                display: "flex",
                gap: 3,
                flexDirection: { xs: "column", sm: "row" },
                width: { xs: "100%", sm: "auto" },
                justifyContent: "center",
                mb: 2
              }}
            >
              <Tooltip title="Save a copy of your review confirmation" arrow placement="top">
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={generatePDF}
                  sx={{
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    backgroundColor: "#1976D2",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#0D47A1",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(25, 118, 210, 0.4)"
                    }
                  }}
                >
                  Download Confirmation
                </Button>
              </Tooltip>
              
              <Link href="/reviews" passHref>
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
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      borderColor: "#1976D2",
                      backgroundColor: "rgba(25, 118, 210, 0.08)",
                      transform: "translateY(-2px)"
                    }
                  }}
                >
                  View All Reviews
                </Button>
              </Link>
            </Box>
          </Grow>
          
          <Fade in={showElements} timeout={3000}>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Link href="/" passHref>
                <Button
                  variant="text"
                  startIcon={<Home />}
                  sx={{
                    color: "#757575",
                    fontWeight: 500,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#1976D2",
                      backgroundColor: "transparent",
                      transform: "translateY(-1px)"
                    }
                  }}
                >
                  Return to Homepage
                </Button>
              </Link>
            </Box>
          </Fade>
          
          <Fade in={showElements} timeout={3500}>
            <Box sx={{ 
              mt: 4, 
              display: "flex", 
              alignItems: "center", 
              gap: 1 
            }}>
              <Favorite sx={{ fontSize: 16, color: "#f06292" }} />
              <Typography variant="caption" sx={{ color: "#757575" }}>
                Thank you for helping us improve!
              </Typography>
            </Box>
          </Fade>
        </Paper>
      </Grow>
    </Container>
  );
};

export default ThankYouReview;