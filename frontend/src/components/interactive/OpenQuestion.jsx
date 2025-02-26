import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const OpenQuestion = ({ content, onComplete }) => {
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    if (onComplete) {
      onComplete(true);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">
          {content.question}
        </Typography>
        {submitted && <CheckCircle color="success" />}
      </Stack>

      {content.hint && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Hint: {content.hint}
        </Typography>
      )}

      <TextField
        fullWidth
        multiline
        rows={4}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer here..."
        disabled={submitted}
        sx={{ mb: 2 }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!answer.trim() || submitted}
        >
          Submit Answer
        </Button>
      </Stack>

      {submitted && (
        <Typography sx={{ mt: 2 }} color="success.main">
          Thank you for your response!
        </Typography>
      )}
    </Box>
  );
};

export default OpenQuestion;