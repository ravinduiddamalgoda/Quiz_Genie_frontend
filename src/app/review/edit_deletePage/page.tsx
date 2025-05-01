"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  Box,
  Container,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Chip,
  Grow,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Home,
  Edit,
  Delete,
  Close,
  StarBorder,
  DateRange,
  AssignmentTurnedIn,
} from "@mui/icons-material";
import Link from "next/link";
import axios from "axios";

// Define types for our review data
interface Review {
  _id: string;
  title: string;
  rating: number;
  description: string;
  createdAt: string;
  wouldRecommend: boolean;
  email: string;
  published: boolean;
}

interface EditedReview {
  title: string;
  rating: number;
  content: string;
}

const ReviewViewPage = () => {
  // Sample review data with proper typing
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State for edit dialog
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [editedReview, setEditedReview] = useState<EditedReview>({
    title: "",
    rating: 0,
    content: "",
  });

  // State for delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  // State for success message
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Handle opening edit dialog
  const handleEditClick = (review: Review) => {
    setCurrentReview(review);
    setEditedReview({
      title: review.title,
      rating: review.rating,
      content: review.description,
    });
    setOpenEditDialog(true);
  };

  // Handle edit dialog close
  const handleEditClose = () => {
    setOpenEditDialog(false);
  };

  // Handle save edit
  const handleSaveEdit = () => {
    if (currentReview) {
      const updatedReviews = reviews.map((review) =>
        review._id === currentReview._id ? { ...review, ...editedReview } : review
      );
      setReviews(updatedReviews);
      setOpenEditDialog(false);
      setSuccessMessage("Review updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  // Handle opening delete dialog
  const handleDeleteClick = (review: Review) => {
    setReviewToDelete(review);
    setOpenDeleteDialog(true);
  };

  // Handle delete dialog close
  const handleDeleteClose = () => {
    setOpenDeleteDialog(false);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (reviewToDelete) {
      try {
        console.log("Deleting review:", reviewToDelete); // Debugging line
        const response = await axios.delete(
          `http://localhost:3600/api/reviews/${reviewToDelete._id}`,
        );
  
        if (response.data.message === "Deleted successfully") {
          const filteredReviews = reviews.filter(
            (review) => review._id !== reviewToDelete._id
          );
          setReviews(filteredReviews);
          setSuccessMessage("Review deleted successfully!");
        } else {
          console.error("Unexpected response:", response.data);
        }
      } catch (error) {
        console.error("Error deleting review:", error);
      } finally {
        setOpenDeleteDialog(false);
  
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      }
    }
  };
  

  // Function to get color based on rating
  const getRatingColor = (rating: number): string => {
    if (rating >= 4) return "#2e7d32"; // Green for high ratings
    if (rating >= 3) return "#ff9800"; // Orange for medium ratings
    return "#e57373"; // Red for low ratings
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:3600/api/reviews");
        const data = await res.json();
        console.log("Fetched reviews:", data); // Debugging line
        setReviews(data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    console.log(" reviews:", reviews); // Debugging line
  }, [setReviews, reviews]);

  // Function to format date nicely
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 5,
        background: "linear-gradient(to bottom, #f5f9ff, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* Success Message */}
      {successMessage && (
        <Grow in={!!successMessage}>
          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: "rgba(46, 125, 50, 0.1)",
              borderRadius: 2,
              textAlign: "center",
              border: "1px solid #c8e6c9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <AssignmentTurnedIn sx={{ mr: 1, color: "#2e7d32" }} />
            <Typography sx={{ color: "#2e7d32", fontWeight: 500 }}>
              {successMessage}
            </Typography>
          </Box>
        </Grow>
      )}

      <Paper
        elevation={4}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 3,
          backgroundColor: "#FFFFFF",
          border: "1px solid #e0e9ff",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(149, 157, 165, 0.2)",
        }}
      >
        {/* Decorative element */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "10px",
            background: "linear-gradient(90deg, #1976D2, #64B5F6)",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 1,
            mt: 2,
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "#1976D2",
              width: 50,
              height: 50,
              mr: 2,
              boxShadow: "0 4px 8px rgba(25, 118, 210, 0.2)",
            }}
          >
            <StarBorder fontSize="large" />
          </Avatar>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "#1976D2",
            }}
          >
            Your Reviews
          </Typography>
        </Box>

        <Divider
          sx={{
            width: "80px",
            borderColor: "#90CAF9",
            borderWidth: 3,
            my: 2,
            borderRadius: 1,
          }}
        />

        <Typography
          variant="body1"
          paragraph
          sx={{
            mb: 4,
            textAlign: "center",
            fontSize: "1.1rem",
            color: "#424242",
            maxWidth: "80%",
          }}
        >
          Here you can view, edit, or delete your submitted reviews. Your
          feedback helps improve our services.
        </Typography>

        {reviews.length > 0 ? (
          <Box sx={{ width: "100%", mb: 4 }}>
            {reviews.map((review, index) => (
              <Fade in={true} timeout={500 + index * 200} key={review._id}>
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    border: "1px solid #e0e9ff",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, color: "#1976D2" }}
                      >
                        {review.title}
                      </Typography>
                      <Box>
                        <Tooltip title="Edit review">
                          <IconButton
                            onClick={() => handleEditClick(review)}
                            sx={{
                              color: "#1976D2",
                              backgroundColor: "rgba(25, 118, 210, 0.1)",
                              mr: 1,
                              "&:hover": {
                                backgroundColor: "rgba(25, 118, 210, 0.2)",
                              },
                            }}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete review">
                          <IconButton
                            onClick={() => handleDeleteClick(review)}
                            sx={{
                              color: "#f44336",
                              backgroundColor: "rgba(244, 67, 54, 0.1)",
                              "&:hover": {
                                backgroundColor: "rgba(244, 67, 54, 0.2)",
                              },
                            }}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box
                      sx={{ display: "flex", alignItems: "center", my: 1.5 }}
                    >
                      <Rating
                        value={review.rating}
                        precision={0.5}
                        readOnly
                        size="medium"
                        sx={{
                          "& .MuiRating-iconFilled": {
                            color: getRatingColor(review.rating),
                          },
                        }}
                      />
                      {/* <Chip 
                          label={review.rating.toFixed(1)} 
                          size="small" 
                          sx={{ 
                            ml: 1.5, 
                            fontWeight: "bold",
                            backgroundColor: getRatingColor(review.rating),
                            color: "white"
                          }} 
                        /> */}
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        mt: 2,
                        mb: 2.5,
                        lineHeight: 1.6,
                        color: "#333333",
                        backgroundColor: "#f9f9f9",
                        p: 2,
                        borderRadius: 2,
                        borderLeft: `4px solid ${getRatingColor(
                          review.rating
                        )}`,
                      }}
                    >
                      {review.description}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#757575",
                        mt: 1,
                      }}
                    >
                      {/* <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          {formatDate(review.date)}
                        </Typography> */}
                      {/* <Typography variant="caption" sx={{ ml: 2, color: "#9e9e9e" }}>
                          ID: {review.id}
                        </Typography> */}
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 3,
              backgroundColor: "#f5f9ff",
              width: "100%",
              textAlign: "center",
              border: "1px dashed #90caf9",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color: "#546e7a", fontWeight: 500 }}
            >
              You haven't submitted any reviews yet.
            </Typography>
          </Box>
        )}

        <Link href="/" passHref>
          <Button
            variant="contained"
            startIcon={<Home />}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: "#1976D2",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
              fontWeight: 600,
              transition: "all 0.2s",
              "&:hover": {
                backgroundColor: "#1565c0",
                boxShadow: "0 6px 15px rgba(25, 118, 210, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Return Home
          </Button>
        </Link>
      </Paper>

      {/* Edit Review Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #1976D2, #64B5F6)",
            color: "white",
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <Edit sx={{ mr: 1.5 }} />
          Edit Your Review
          <IconButton
            onClick={handleEditClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <TextField
            label="Review Title"
            fullWidth
            value={editedReview.title}
            onChange={(e) =>
              setEditedReview({ ...editedReview, title: e.target.value })
            }
            margin="normal"
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />

          <Box sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Your Rating
            </Typography>
            <Rating
              value={editedReview.rating}
              onChange={(_, newValue) => {
                // Handle the null case explicitly
                setEditedReview({
                  ...editedReview,
                  rating: newValue !== null ? newValue : 0,
                });
              }}
              precision={0.5}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": {
                  color: getRatingColor(editedReview.rating),
                },
              }}
            />
          </Box>

          <TextField
            label="Review Content"
            multiline
            rows={5}
            fullWidth
            value={editedReview.content}
            onChange={(e) =>
              setEditedReview({ ...editedReview, content: e.target.value })
            }
            margin="normal"
            variant="outlined"
            InputProps={{
              sx: { borderRadius: 2 },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#f5f9ff" }}>
          <Button
            onClick={handleEditClose}
            sx={{
              color: "#546e7a",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            sx={{
              backgroundColor: "#1976D2",
              px: 3,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #f44336, #ef5350)",
            color: "white",
            display: "flex",
            alignItems: "center",
            p: 2,
          }}
        >
          <Delete sx={{ mr: 1.5 }} />
          Delete Review
          <IconButton
            onClick={handleDeleteClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1" sx={{ color: "#333" }}>
            Are you sure you want to delete this review? This action cannot be
            undone.
          </Typography>
          {reviewToDelete && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "#ffebee",
                borderRadius: 2,
                borderLeft: "4px solid #f44336",
              }}
            >
              {/* <Typography variant="subtitle2" sx={{ color: "#d32f2f", fontWeight: 600 }}>
                  Review to delete: "{reviewToDelete.title}"
                </Typography> */}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, backgroundColor: "#fafafa" }}>
          <Button
            onClick={handleDeleteClose}
            sx={{
              color: "#546e7a",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              px: 3,
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#d32f2f",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewViewPage;
