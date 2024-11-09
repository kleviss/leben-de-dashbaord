import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ManageQuestionDialog from './ManageQuestionDialog';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  // backgroundColor: theme.palette.primary.main,
  // color: theme.palette.common.white,
}));

const QuestionsManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/questions/v2');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowAddForm(true);
  };

  const handleClose = () => {
    setShowAddForm(false);
    setEditingQuestion(null);
  };

  const handleDelete = async (questionId) => {
    return;
    // try {
    //   await fetch(`http://localhost:5005/api/questions/v2/${questionId}`, { method: 'DELETE' });
    //   fetchQuestions();
    // } catch (error) {
    //   console.error('Error deleting question:', error);
    // }
  };

  const handleSubmit = async (formData, editingQuestion) => {
    try {
      const url = editingQuestion
        ? `http://localhost:5005/api/questions/v2/${editingQuestion._id}`
        : 'http://localhost:5005/api/questions/v2';

      const method = editingQuestion ? 'PATCH' : 'POST';
      const formDataObj = new FormData();

      // Add all the regular fields except images and hasImages
      Object.keys(formData).forEach((key) => {
        if (key !== 'images' && key !== 'hasImages') {
          if (Array.isArray(formData[key])) {
            formDataObj.append(key, JSON.stringify(formData[key]));
          } else {
            formDataObj.append(key, formData[key]);
          }
        }
      });

      // Handle images
      if (formData.hasImages) {
        // Filter out empty objects from images array
        const existingImages = formData.images.filter(
          (img) => typeof img === 'string' && img.startsWith('http')
        );

        formDataObj.append('images', JSON.stringify(existingImages));

        // Add new image files
        formData.images.forEach((image, index) => {
          if (image instanceof File) {
            formDataObj.append(`image${index + 1}`, image);
          }
        });
      } else {
        formDataObj.append('images', JSON.stringify([]));
      }

      formDataObj.append('hasImages', formData.hasImages);

      const response = await fetch(url, {
        method: method,
        body: formDataObj,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save question');
      }

      await fetchQuestions();
      handleClose();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  return (
    <Box>
      <Button variant='contained' onClick={() => setShowAddForm(!showAddForm)} sx={{ mb: 2 }}>
        {'Add New Question'}
      </Button>
      {showAddForm && (
        <ManageQuestionDialog
          onSubmit={handleSubmit}
          onClose={handleClose}
          editingQuestion={editingQuestion}
        />
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell>Difficulty</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question._id}>
                <TableCell>{question.categoryId}</TableCell>
                <TableCell>{question.question}</TableCell>
                <TableCell>{question.difficulty}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(question)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='outlined'
                    size='small'
                    color='error'
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(question._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuestionsManagement;
