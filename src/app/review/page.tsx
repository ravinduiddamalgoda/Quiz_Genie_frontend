"use client";

import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  StarBorder,
  Star,
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  ArrowBack,
  Send,
} from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

// Define types
type FormDataType = {
  title: string;
  description: string;
  email?: string;
  wouldRecommend: boolean | null;
};

type ErrorsType = {
  title: string;
  description: string;
  rating: string;
  email: string;
};

// Review sentiment icons mapping
const sentimentIcons = [
  null,
  <SentimentVeryDissatisfied key="1" fontSize="large" className="text-red-500" />,
  <SentimentDissatisfied key="2" fontSize="large" className="text-orange-500" />,
  <SentimentNeutral key="3" fontSize="large" className="text-yellow-400" />,
  <SentimentSatisfied key="4" fontSize="large" className="text-green-500" />,
  <SentimentVerySatisfied key="5" fontSize="large" className="text-blue-500" />,
];

const ReviewPage = () => {
  const router = useRouter();
  
  // States
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [formTouched, setFormTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form data and errors
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    description: "",
    email: "",
    wouldRecommend: null,
  });
  
  const [errors, setErrors] = useState<ErrorsType>({
    title: "",
    description: "",
    rating: "",
    email: "",
  });

  // Update character count and validate form when data changes
  useEffect(() => {
    if (submitted || formTouched) {
      validateStep(activeStep);
    }
    
    if (activeStep === 1) {
      setCharCount(formData.description.length);
    }
  }, [formData, rating, submitted, activeStep, formTouched]);

  // Form input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched(true);
  };

  const handleCheckboxChange = (name: string, value: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormTouched(true);
  };

  // Validate current step
  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };

    if (step === 0) {
      if (!rating) {
        newErrors.rating = "Please select a rating";
        isValid = false;
      } else {
        newErrors.rating = "";
      }
    } else if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Title is required";
        isValid = false;
      } else {
        newErrors.title = "";
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required";
        isValid = false;
      } else if (formData.description.length < 20) {
        newErrors.description = "Please provide at least 20 characters";
        isValid = false;
      } else {
        newErrors.description = "";
      }
    } else if (step === 2 && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        isValid = false;
      } else {
        newErrors.email = "";
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Navigation handlers
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setIsAnimating(true);
      setTimeout(() => {
        setActiveStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveStep((prev) => prev - 1);
      setIsAnimating(false);
    }, 300);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (validateStep(activeStep)) {
      setIsSubmitting(true);
      const toastId = toast.loading("Submitting your review...");

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // Redirect to thank you page
        router.push('review/thankYouReview');
        
      } catch (error) {
        toast.update(toastId, {
          render: "There was a problem submitting your review. Please try again.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setIsSubmitting(false);
      }
    } else {
      toast.error("Please correct the errors before submitting.", {
        position: "bottom-center",
      });
    }
  };

  // Utility functions
  const getStarColor = (index: number): string => {
    const level = hover !== null ? hover : rating !== null ? rating : 0;

    if (index <= level) {
      return [
        "text-red-500", // 1 star
        "text-orange-500", // 2 stars
        "text-yellow-400", // 3 stars
        "text-green-500", // 4 stars
        "text-blue-500", // 5 stars
      ][level - 1];
    }
    return "text-gray-300";
  };

  const getRatingLabel = (): string => {
    const level = hover !== null ? hover : rating !== null ? rating : 0;
    return ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][level];
  };

  // Render steps
  const renderStep = () => {
    switch (activeStep) {
      case 0: // Rating step
        return (
          <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="flex flex-col items-center mb-6">
              <Typography variant="h6" color="primary" gutterBottom>
                How would you rate your experience?
              </Typography>

              <div className="mt-6 mb-2">{sentimentIcons[rating || 0]}</div>

              <div className="flex gap-4 mt-4 justify-center" onMouseLeave={() => setHover(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Tooltip
                    key={star}
                    title={["Poor", "Fair", "Good", "Very Good", "Excellent"][star - 1]}
                    arrow
                    placement="top"
                  >
                    <div
                      className="cursor-pointer transition-all duration-300 transform hover:scale-125"
                      onClick={() => {
                        setRating(star);
                        setFormTouched(true);
                      }}
                      onMouseEnter={() => setHover(star)}
                    >
                      {star <= (hover ?? rating ?? 0) ? (
                        <Star className={`transition-all duration-300 ${getStarColor(star)}`} fontSize="large" />
                      ) : (
                        <StarBorder className="text-gray-300 transition-all duration-300" fontSize="large" />
                      )}
                    </div>
                  </Tooltip>
                ))}
              </div>

              <Typography variant="subtitle1" className="mt-3 font-medium" color={rating || hover ? "primary" : "textSecondary"}>
                {getRatingLabel()}
              </Typography>

              {errors.rating && submitted && (
                <Typography variant="caption" color="error" className="mt-2">
                  {errors.rating}
                </Typography>
              )}
            </div>
          </div>
        );
        
      case 1: // Title and description step
        return (
          <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="space-y-6">
              <div>
                <Typography variant="h6" color="primary" gutterBottom>
                  Title your review
                </Typography>
                <TextField
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="Summarize your experience in a few words"
                  error={submitted && !!errors.title}
                  helperText={submitted && errors.title}
                  className="bg-gray-50"
                  InputProps={{
                    className: "rounded-lg",
                  }}
                />
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <Typography variant="h6" color="primary" gutterBottom>
                    Share your experience
                  </Typography>
                  <Typography variant="caption" color={charCount >= 20 ? "success" : "textSecondary"}>
                    {charCount}/200 characters {charCount < 20 ? `(${20 - charCount} more required)` : ""}
                  </Typography>
                </div>
                <TextField
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="What did you like or dislike? What was memorable about your experience?"
                  error={submitted && !!errors.description}
                  helperText={submitted && errors.description}
                  className="bg-gray-50"
                  InputProps={{
                    className: "rounded-lg",
                  }}
                />
              </div>
            </div>
          </div>
        );
        
      case 2: // Final step and summary
        return (
          <div className={`transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
            <div className="space-y-6">
              <div>
                <Typography variant="h6" color="primary" gutterBottom>
                  Would you recommend this to others?
                </Typography>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant={formData.wouldRecommend === true ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => handleCheckboxChange("wouldRecommend", true)}
                    className="flex-1"
                  >
                    Yes
                  </Button>
                  <Button
                    variant={formData.wouldRecommend === false ? "contained" : "outlined"}
                    color="error"
                    onClick={() => handleCheckboxChange("wouldRecommend", false)}
                    className="flex-1"
                  >
                    No
                  </Button>
                </div>
              </div>

              <div>
                <Typography variant="h6" color="primary" gutterBottom>
                  Email (optional)
                </Typography>
                <Typography variant="caption" color="textSecondary" className="block mb-2">
                  We'll notify you when your review is published
                </Typography>
                <TextField
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                  placeholder="your.email@example.com"
                  error={submitted && !!errors.email}
                  helperText={submitted && errors.email}
                  className="bg-gray-50"
                  InputProps={{
                    className: "rounded-lg",
                  }}
                />
              </div>

              <Divider className="my-4" />

              <div>
                <Typography variant="h6" color="primary" gutterBottom>
                  Review Summary
                </Typography>
                <Paper elevation={0} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Typography variant="body1" className="font-semibold">
                      Rating:
                    </Typography>
                    <div className="flex">
                      {[...Array(rating || 0)].map((_, i) => (
                        <Star key={i} className={getStarColor(i + 1)} fontSize="small" />
                      ))}
                    </div>
                    <Typography variant="body2">({getRatingLabel()})</Typography>
                  </div>
                  <Typography variant="body1" className="font-semibold mb-1">
                    {formData.title || "(No title provided)"}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-2">
                    {formData.description || "(No description provided)"}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Would recommend:{" "}
                    {formData.wouldRecommend === null
                      ? "Not specified"
                      : formData.wouldRecommend
                      ? "Yes"
                      : "No"}
                  </Typography>
                </Paper>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="flex justify-center mb-6">
        {[0, 1, 2].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`rounded-full h-3 w-3 transition-all ${
                step === activeStep
                  ? "bg-blue-600 scale-125"
                  : step < activeStep
                  ? "bg-blue-400"
                  : "bg-gray-300"
              }`}
            />
            {step < 2 && (
              <div className={`h-0.5 w-8 my-auto transition-all ${step < activeStep ? "bg-blue-400" : "bg-gray-300"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg border border-gray-200">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Share Your Experience
          </h2>
          <p className="text-center text-gray-500 mt-1">
            Your feedback helps others make better decisions
          </p>

          {/* Progress indicator */}
          {renderProgress()}
        </div>

        {/* Form content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}

            {/* Navigation buttons */}
            <div className="flex justify-between pt-4 mt-6">
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
                startIcon={<ArrowBack />}
                className={activeStep === 0 ? "invisible" : ""}
              >
                Back
              </Button>

              {activeStep === 2 ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  className="px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="px-6 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Continue
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ReviewPage;