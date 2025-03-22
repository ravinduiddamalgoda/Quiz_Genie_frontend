"use client";

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  LinearProgress,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { useRouter } from 'next/router';


// Constants
const BLUE_COLOR = '#1976d2';
const DARK_BLUE = '#1e293b';
const GREEN_COLOR = '#00c853';
const RED_COLOR = '#e53935';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface UploadedPdf {
  name: string;
  size: number;
}

export default function BattleAdminPage() {
  const [battleName, setBattleName] = useState<string>("Physics Battle #42");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [uploadedPdfs, setUploadedPdfs] = useState<UploadedPdf[]>([]);
  const [openEndDialog, setOpenEndDialog] = useState<boolean>(false);
  
  // Handle battle name edit
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBattleName(e.target.value);
  };
  
  const toggleEditName = () => {
    setIsEditingName(!isEditingName);
  };
  
  const saveBattleName = () => {
    setIsEditingName(false);
  };
  
  // Handle PDF upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Only allow PDF files
      if (file.type !== 'application/pdf') {
        alert('Please upload only PDF files');
        return;
      }
      
      // Add the file to our state
      setUploadedPdfs([...uploadedPdfs, {
        name: file.name,
        size: file.size
      }]);
      
      // Reset the input field
      e.target.value = '';
    }
  };
  
  // Handle PDF removal
  const removePdf = (indexToRemove: number) => {
    setUploadedPdfs(uploadedPdfs.filter((_, index) => index !== indexToRemove));
  };
  
  // Handle end battle dialog
  const handleEndBattle = () => {
    setOpenEndDialog(false);
    // router.push('/battle/leaderboard');
    alert('Battle ended successfully');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 5, mb: 5, flex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            backgroundColor: '#fff',
            border: '1px solid #eaeaea',
            borderRadius: 2,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <Typography variant="h5" component="h1" sx={{ mb: 3, fontWeight: 'bold' }}>
            Battle Admin
          </Typography>
          
          {/* Battle Name Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Battle Name
            </Typography>
            
            {isEditingName ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
                  value={battleName}
                  onChange={handleNameChange}
                />
                <Button 
                  variant="contained" 
                  onClick={saveBattleName}
                  sx={{ bgcolor: BLUE_COLOR }}
                >
                  Save
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {battleName}
                </Typography>
                <IconButton onClick={toggleEditName} color="primary" size="small">
                  <EditIcon />
                </IconButton>
              </Box>
            )}
          </Box>
          
          {/* PDF Upload Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Subject PDFs
            </Typography>
            
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 3, bgcolor: BLUE_COLOR }}
            >
              Upload Subject PDF
              <VisuallyHiddenInput type="file" onChange={handleFileUpload} accept=".pdf" />
            </Button>
            
            {/* Display uploaded PDFs */}
            {uploadedPdfs.length > 0 ? (
              <Grid container spacing={2}>
                {uploadedPdfs.map((pdf, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        display: 'flex', 
                        alignItems: 'center',
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #eaeaea',
                        borderRadius: 1
                      }}
                    >
                      <PictureAsPdfIcon color="primary" sx={{ mr: 2 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1">
                          {pdf.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(pdf.size / 1024 / 1024).toFixed(2)} MB
                        </Typography>
                      </Box>
                      <IconButton onClick={() => removePdf(index)} size="small">
                        <CloseIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No PDFs uploaded yet. Add subject materials for this battle.
              </Typography>
            )}
          </Box>
          
          {/* End Battle Section */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, pt: 3, borderTop: '1px solid #eaeaea' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined"
                color="inherit"
                sx={{ px: 3 }}
              >
                Previous
              </Button>
              <Button 
                variant="contained"
                color="error" 
                onClick={() => setOpenEndDialog(true)}
                sx={{ bgcolor: RED_COLOR, px: 3 }}
              >
                End Battle
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      {/* User Avatar - Fixed Position */}
      <Box 
        sx={{ 
          position: 'fixed', 
          bottom: 20, 
          left: 20, 
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#000',
          color: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        <Avatar sx={{ bgcolor: '#333', height: 40, width: 40 }}>N</Avatar>
      </Box>
      
      {/* End Battle Confirmation Dialog */}
      <Dialog
        open={openEndDialog}
        onClose={() => setOpenEndDialog(false)}
      >
        <DialogTitle>End this battle?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to end "{battleName} Battle"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEndDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleEndBattle} sx={{ bgcolor: RED_COLOR }} variant="contained">
            End Battle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}