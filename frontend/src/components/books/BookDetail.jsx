import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books/${id}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
      <Card>
        <CardMedia
          component="img"
          height="400"
          image={book.coverImage}
          alt={book.title}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom>{book.title}</Typography>
          <Typography variant="h6">By {book.author}</Typography>
          <Typography variant="body1" paragraph>{book.description}</Typography>
          
          <Typography variant="subtitle1">
            Reading Level: {book.readingLevel}
          </Typography>
          <Typography variant="subtitle1">
            Age Range: {book.ageRange.min}-{book.ageRange.max} years
          </Typography>
          <Typography variant="subtitle1">
            Genres: {book.genre.join(', ')}
          </Typography>

          {book.interactiveElements.map((element, index) => (
            <Button
              key={index}
              variant="contained"
              color="primary"
              sx={{ margin: 1 }}
            >
              {element.type}
            </Button>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
};

export default BookDetail; 