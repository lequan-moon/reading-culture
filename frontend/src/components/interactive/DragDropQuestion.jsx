import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Chip,
  IconButton
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const DragDropQuestion = ({ content, onComplete }) => {
  const [answers, setAnswers] = useState(Array(content.blanks).fill(''));
  const [availableOptions, setAvailableOptions] = useState(
    content.options.map((option, index) => ({
      id: `draggable-${index}`,
      content: option
    }))
  );
  const [isCorrect, setIsCorrect] = useState(null);
  const [completed, setCompleted] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (source.droppableId === 'options' && destination.droppableId.startsWith('blank-')) {
      const blankIndex = parseInt(destination.droppableId.split('-')[1]);
      const newAnswers = [...answers];
      const newOptions = [...availableOptions];
      
      const [movedOption] = newOptions.splice(source.index, 1);
      newAnswers[blankIndex] = movedOption.content;
      
      setAnswers(newAnswers);
      setAvailableOptions(newOptions);
    }
  };

  const handleCheck = () => {
    const correct = answers.every((answer, index) => 
      answer === content.correctAnswers[index]
    );
    setIsCorrect(correct);
    if (correct) {
      setCompleted(true);
      if (onComplete) {
        onComplete(true);
      }
    }
  };

  const handleReset = () => {
    setAnswers(Array(content.blanks).fill(''));
    setAvailableOptions(
      content.options.map((option, index) => ({
        id: `draggable-${index}`,
        content: option
      }))
    );
    setIsCorrect(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h6">
            Complete the sentence:
          </Typography>
          {completed && <CheckCircle color="success" />}
        </Stack>
        
        <Box sx={{ mb: 3 }}>
          {content.text.split('____').map((part, index) => (
            <Box key={index} sx={{ display: 'inline' }}>
              {part}
              {index < content.blanks && (
                <Droppable droppableId={`blank-${index}`}>
                  {(provided) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      sx={{
                        display: 'inline-block',
                        mx: 1,
                        px: 2,
                        py: 0.5,
                        minWidth: 80,
                        backgroundColor: answers[index] ? 'grey.100' : 'grey.50'
                      }}
                    >
                      {answers[index] ? (
                        <Typography display="inline">{answers[index]}</Typography>
                      ) : (
                        <Typography display="inline" color="text.disabled">____</Typography>
                      )}
                      {provided.placeholder}
                    </Paper>
                  )}
                </Droppable>
              )}
            </Box>
          ))}
        </Box>

        <Droppable droppableId="options" direction="horizontal">
          {(provided) => (
            <Stack
              direction="row"
              spacing={1}
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ mb: 3 }}
            >
              {availableOptions.map((option, index) => (
                <Draggable 
                  key={option.id}
                  draggableId={option.id}
                  index={index}
                >
                  {(provided) => (
                    <Chip
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      label={option.content}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleCheck}>
            Check Answer
          </Button>
          <Button variant="outlined" onClick={handleReset}>
            Reset
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
    </DragDropContext>
  );
};

export default DragDropQuestion;