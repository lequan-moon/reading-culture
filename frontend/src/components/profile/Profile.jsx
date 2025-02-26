import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookMoods, setBookMoods] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
    fetchMoods();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/profile`);
      setProfile(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email
      });
    } catch (error) {
      setError('Error fetching profile');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoods = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/moods`);
      setBookMoods(response.data);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/profile`, formData);
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      setError('Error updating profile');
      console.error('Error updating profile:', error);
    }
  };

  // Sort and flatten moods for timeline
  const getAllMoodsSorted = () => {
    return bookMoods.flatMap(bookMood => 
      bookMood.moods.map(mood => ({
        ...mood,
        bookTitle: bookMood.bookId.title,
        bookAuthor: bookMood.bookId.author
      }))
    ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <Typography>No profile data available</Typography>;

  return (
    <Container maxWidth="xl">
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* Left side - Profile info */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                >
                  {profile.username[0].toUpperCase()}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {profile.username}
                </Typography>
                <Typography color="textSecondary">
                  {profile.role}
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                {isEditing ? (
                  <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}>
                    <TextField
                      fullWidth
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={(e) => setFormData({
                        ...formData,
                        username: e.target.value
                      })}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({
                        ...formData,
                        email: e.target.value
                      })}
                      margin="normal"
                    />
                    <Box sx={{ mt: 2 }}>
                      <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                        Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Profile Information
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {profile.email}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(true)}
                      sx={{ mt: 2 }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" gutterBottom>
              Reading Moods History
            </Typography>
            <List>
              {bookMoods.map((bookMood, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={bookMood.bookId.title}
                    secondary={`By ${bookMood.bookId.author}`}
                  />
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {bookMood.moods.map((mood, moodIndex) => (
                      <Chip
                        key={moodIndex}
                        label={mood.mood}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Right side - Mood Timeline */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Mood Timeline
            </Typography>
            <Timeline>
              {getAllMoodsSorted().map((mood, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent color="text.secondary" sx={{ flex: 0.2 }}>
                    {formatDate(mood.timestamp)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary" />
                    {index < getAllMoodsSorted().length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant="body2" component="span">
                      {mood.mood}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {mood.bookTitle}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 