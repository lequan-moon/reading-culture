import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Grid,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Stack,
  Chip
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Bookmark,
  VolumeUp,
  CheckCircle
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DragDropQuestion from '../interactive/DragDropQuestion';
import YesNoQuestion from '../interactive/YesNoQuestion';
import OpenQuestion from '../interactive/OpenQuestion';

const MOODS = ['Sad', 'Frustrated', 'Calm', 'Fascinated', 'Delighted'];

const BookReader = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showInteractive, setShowInteractive] = useState(false);
  const [currentInteractive, setCurrentInteractive] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(new Set());
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const { user } = useAuth();
  const [allActivitiesCompleted, setAllActivitiesCompleted] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  useEffect(() => {
    console.log('Completed Activities:', Array.from(completedActivities));
    if (book?.pages[currentPage]?.interactiveElements) {
      console.log('Current Page Activities:', book.pages[currentPage].interactiveElements.map(el => el._id));
    }
  }, [completedActivities, book, currentPage]);

  useEffect(() => {
    if (book) {
      const allInteractives = book.pages.flatMap(page => 
        page.interactiveElements || []
      );
      
      const allCompleted = allInteractives.length > 0 && 
        allInteractives.every(element => 
          completedActivities.has(element._id)
        );

      console.log('All activities completion check:', {
        total: allInteractives.length,
        completed: completedActivities.size,
        allCompleted
      });

      setAllActivitiesCompleted(allCompleted);
      if (allCompleted) {
        setShowMoodDialog(true);
      }
    }
  }, [completedActivities, book]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/${id}/read`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < book.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // Implement audio playback logic here
  };

  const handleInteractive = (element) => {
    setCurrentInteractive(element);
    setShowInteractive(true);
  };

  const handleActivityComplete = (elementId) => {
    console.log('Completing activity:', elementId);
    setCompletedActivities(prev => {
      const newSet = new Set(prev);
      newSet.add(elementId);
      return newSet;
    });
  };

  const handleMoodSelection = async (mood) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/books/${id}/mood`, {
        pageNumber: currentPage,
        mood: mood
      });
      setShowMoodDialog(false);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 3, maxWidth: '1200px', margin: '0 auto' }}>
      <Paper elevation={3} sx={{ p: 4, minHeight: '70vh' }}>
        {/* Reading Controls */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <IconButton onClick={handlePrevPage} disabled={currentPage === 0}>
              <ChevronLeft />
            </IconButton>
            <IconButton onClick={handleNextPage} disabled={currentPage === book.pages.length - 1}>
              <ChevronRight />
            </IconButton>
            <IconButton onClick={() => setFontSize(prev => prev + 2)}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={() => setFontSize(prev => Math.max(12, prev - 2))}>
              <ZoomOut />
            </IconButton>
            <IconButton onClick={toggleAudio}>
              <VolumeUp color={isAudioPlaying ? 'primary' : 'inherit'} />
            </IconButton>
            <IconButton>
              <Bookmark />
            </IconButton>
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
            <Typography>
              Page {currentPage + 1} of {book.pages.length}
            </Typography>
          </Grid>
        </Grid>

        {/* Book Content */}
        <Typography 
          sx={{ 
            fontSize: `${fontSize}px`,
            lineHeight: 1.6,
            mb: 3
          }}
        >
          {book.pages[currentPage].content}
        </Typography>

        {/* Interactive Elements */}
        {book.pages[currentPage].interactiveElements?.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Interactive Activities
            </Typography>
            {book.pages[currentPage].interactiveElements.map((element) => (
              <Button
                key={element._id}
                variant="contained"
                color="primary"
                sx={{ 
                  mr: 2,
                  position: 'relative'
                }}
                onClick={() => handleInteractive(element)}
                endIcon={completedActivities.has(element._id) && <CheckCircle color="success" />}
              >
                {element.type}
              </Button>
            ))}
          </Box>
        )}
      </Paper>

      {/* Interactive Element Dialog */}
      <Dialog
        open={showInteractive}
        onClose={() => setShowInteractive(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {currentInteractive && (
            <InteractiveContent
              bookId={id}
              element={currentInteractive}
              onComplete={() => {
                handleActivityComplete(currentInteractive._id);
                setShowInteractive(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Mood Review Dialog */}
      <Dialog
        open={showMoodDialog}
        onClose={() => setShowMoodDialog(false)}
      >
        <DialogTitle>How do you feel after reading this page?</DialogTitle>
        <DialogContent>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {MOODS.map((mood) => (
              <Chip
                key={mood}
                label={mood}
                onClick={() => handleMoodSelection(mood)}
                clickable
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMoodDialog(false)}>Skip</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// Interactive Content Component
const InteractiveContent = ({ bookId, element, onComplete }) => {
  const handleQuizComplete = async (success) => {
    onComplete();
  };

  if (element.type === 'Quiz') {
    switch (element.content.type) {
      case 'dragDrop':
        return <DragDropQuestion content={element.content} onComplete={handleQuizComplete} />;
      case 'yesNo':
        return <YesNoQuestion content={element.content} onComplete={handleQuizComplete} />;
      case 'openQuestion':
        return <OpenQuestion content={element.content} onComplete={handleQuizComplete} />;
      default:
        return null;
    }
  }

  if (element.type === 'Video') {
    return (
      <Box>
        <video width="100%" controls src={element.content.url} />
      </Box>
    );
  }

  return null;
};

export default BookReader; 