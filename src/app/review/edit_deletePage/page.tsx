"use client";

import React, { useState } from "react";
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
  IconButton
} from "@mui/material";
import { Home, Edit, Delete, Close } from "@mui/icons-material";
import Link from "next/link";

// Define types for our review data
interface Review {
  id: string;
  title: string;
  rating: number;
  content: string;
  date: string;
}

// Define type for edited review (doesn't need id and date)
interface EditedReview {
  title: string;
  rating: number;
  content: string;
}

const ReviewViewPage = () => {
  // Sample review data with proper typing
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "REV123456",
      title: "Great Experience",
      rating: 4.5,
      content: "I had a wonderful experience using this product. The quality exceeded my expectations.",
      date: "2025-02-15"
    },
    {
      id: "REV789012",
      title: "Room for Improvement",
      rating: 3,
      content: "The product works as expected but I think there are some features that could be improved.",
      date: "2025-03-01"
    }
  ]);

  // State for edit dialog
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentReview, setCurrentReview] = useState<Review | null>(null);
  const [editedReview, setEditedReview] = useState<EditedReview>({
    title: "",
    rating: 0,
    content: ""
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
      content: review.content
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
      const updatedReviews = reviews.map(review => 
        review.id === currentReview.id ? 
        { ...review, ...editedReview } : 
        review
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
  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      const filteredReviews = reviews.filter(review => review.id !== reviewToDelete.id);
      setReviews(filteredReviews);
      setOpenDeleteDialog(false);
      setSuccessMessage("Review deleted successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      {/* Success Message */}
      {successMessage && (
        <Box sx={{ 
          p: 2, 
          mb: 3, 
          backgroundColor: "#e8f5e9", 
          borderRadius: 2,
          textAlign: "center",
          border: "1px solid #c8e6c9"
        }}>
          <Typography sx={{ color: "#2e7d32" }}>{successMessage}</Typography>
        </Box>
      )}
      
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: 2,
          backgroundColor: "#FFFFFF",
          border: "1px solid #e0e9ff",
          position: "relative" // Added for the blue bar positioning
        }}
      >
        {/* Decorative element */}
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
        
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            textAlign: "center",
            color: "#1976D2",
            mb: 1,
            mt: 2
          }}
        >
          Your Reviews
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
            fontSize: "1.1rem",
            color: "#424242"
          }}
        >
          Here you can view, edit, or delete your submitted reviews.
        </Typography>
        
        {reviews.length > 0 ? (
          <Box sx={{ width: "100%", mb: 4 }}>
            {reviews.map((review) => (
              <Card 
                key={review.id}
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  border: "1px solid #e0e9ff"
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start",
                    mb: 1
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976D2" }}>
                      {review.title}
                    </Typography>
                    <Box>
                      <IconButton 
                        onClick={() => handleEditClick(review)}
                        sx={{ color: "#1976D2" }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteClick(review)}
                        sx={{ color: "#f44336" }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                    <Rating 
                      value={review.rating} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                    <Typography variant="body2" sx={{ ml: 1, color: "#757575" }}>
                      {review.rating.toFixed(1)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" sx={{ mt: 1, mb: 2 }}>
                    {review.content}
                  </Typography>
                  
                  <Typography variant="caption" sx={{ color: "#757575" }}>
                    Review date: {new Date(review.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              backgroundColor: "#f5f5f5",
              width: "100%",
              textAlign: "center"
            }}
          >
            <Typography variant="body1">
              You haven't submitted any reviews yet.
            </Typography>
          </Box>
        )}
        
        <Link href="/" passHref>
          <Button
            variant="contained"
            startIcon={<Home />}
            sx={{
              px: 3,
              py: 1.5,
              backgroundColor: "#1976D2",
              borderRadius: "8px"
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
      >
        <DialogTitle sx={{ bgcolor: "#1976D2", color: "white" }}>
          Edit Your Review
          <IconButton
            onClick={handleEditClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
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
            onChange={(e) => setEditedReview({...editedReview, title: e.target.value})}
            margin="normal"
          />
          
          <Box sx={{ my: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your Rating
            </Typography>
            <Rating
              value={editedReview.rating}
              onChange={(_, newValue) => {
                // Handle the null case explicitly
                setEditedReview({
                  ...editedReview, 
                  rating: newValue !== null ? newValue : 0
                });
              }}
              precision={0.5}
            />
          </Box>
          
          <TextField
            label="Review Content"
            multiline
            rows={4}
            fullWidth
            value={editedReview.content}
            onChange={(e) => setEditedReview({...editedReview, content: e.target.value})}
            margin="normal"
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleEditClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            sx={{ backgroundColor: "#1976D2" }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteClose}
      >
        <DialogTitle sx={{ bgcolor: "#f44336", color: "white" }}>
          Delete Review
          <IconButton
            onClick={handleDeleteClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white'
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete this review? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{ backgroundColor: "#f44336" }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ReviewViewPage;