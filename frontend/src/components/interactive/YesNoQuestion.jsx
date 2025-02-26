import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const YesNoQuestion = ({ content, onComplete }) => {
  const [answer, setAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (selectedAnswer) => {
    setAnswer(selectedAnswer);
    const correct = selectedAnswer === content.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setCompleted(true);
      if (onComplete) {
        onComplete(true);
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h6">
          {content.question}
        </Typography>
        {completed && <CheckCircle color="success" />}
      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant={answer === 'yes' ? 'contained' : 'outlined'}
          onClick={() => handleAnswer('yes')}
          disabled={completed}
        >
          Yes
        </Button>
        <Button
          variant={answer === 'no' ? 'contained' : 'outlined'}
          onClick={() => handleAnswer('no')}
          disabled={completed}
        >
          No
        </Button>
      </Stack>

      {isCorrect !== null && (
        <Typography
          sx={{ mt: 2 }}
          color={isCorrect ? 'success.main' : 'error.main'}
        >
          {isCorrect ? 'Correct!' : 'Try again!'}
        </Typography>
      )}
    </Box>
  );
};

export default YesNoQuestion; 