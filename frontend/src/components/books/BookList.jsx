import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CardActions,
  Button 
} from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import axios from 'axios';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    ageRange: '',
    genre: '',
    readingLevel: ''
  });

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      const queryParams = new URLSearchParams(filters);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/books?${queryParams}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const handleReadBook = (bookId) => {
    navigate(`/book/${bookId}/read`);
  };

  const handleViewDetails = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
        Available Books
      </Typography>

      <div className="filters" sx={{ p: 2, mb: 3 }}>
        <TextField
          name="search"
          label="Search Books"
          value={filters.search}
          onChange={handleFilterChange}
          sx={{ mr: 2 }}
        />
        <FormControl sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Age Range</InputLabel>
          <Select
            name="ageRange"
            value={filters.ageRange}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Ages</MenuItem>
            <MenuItem value="5-8">5-8 years</MenuItem>
            <MenuItem value="9-12">9-12 years</MenuItem>
            <MenuItem value="13-18">13-18 years</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Reading Level</InputLabel>
          <Select
            name="readingLevel"
            value={filters.readingLevel}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Levels</MenuItem>
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3} sx={{ p: 2 }}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={book.coverImage}
                alt={book.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {book.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  By {book.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.description.substring(0, 150)}...
                </Typography>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  Reading Level: {book.readingLevel}
                </Typography>
                <Typography variant="caption" display="block">
                  Age: {book.ageRange.min}-{book.ageRange.max} years
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => handleViewDetails(book._id)}
                >
                  Details
                </Button>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<MenuBook />}
                  onClick={() => handleReadBook(book._id)}
                  variant="contained"
                >
                  Read Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default BookList; 