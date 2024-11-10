import {
  Box,
  Button,
  Chip,
  Collapse,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { CATEGORIES_API } from '../api/routes/index.js';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ManageQuestionDialog from './ManageQuestionDialog';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  // backgroundColor: theme.palette.primary.main,
  // color: theme.palette.common.white,
}));

const QuestionsManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRequestFailed, setHasRequestFailed] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState([]);
  const [selectedDifficultyFilters, setSelectedDifficultyFilters] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
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

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(CATEGORIES_API.GET_ALL);
      const data = await response.json();
      setCategories(data);
      setIsLoading(false);
      setHasRequestFailed(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsLoading(false);
      setHasRequestFailed(true);
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

  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterChange = (type, filter) => {
    const currentFilters =
      type === 'category' ? selectedCategoryFilters : selectedDifficultyFilters;
    const currentIndex = currentFilters.indexOf(filter);
    const newFilters = [...currentFilters];

    if (currentIndex === -1) {
      newFilters.push(filter);
    } else {
      newFilters.splice(currentIndex, 1);
    }

    if (type === 'category') {
      setSelectedCategoryFilters(newFilters);
    } else {
      setSelectedDifficultyFilters(newFilters);
    }
  };

  const filteredQuestions = questions
    .filter(
      (question) =>
        question.categoryId.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedCategoryFilters.length === 0 ||
          selectedCategoryFilters.includes(question.categoryId)) &&
        (selectedDifficultyFilters.length === 0 ||
          selectedDifficultyFilters.includes(question.difficulty))
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.categoryId.localeCompare(b.categoryId);
      } else {
        return b.categoryId.localeCompare(a.categoryId);
      }
    });

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0, mt: 8 }}>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start' }}>
          <Button variant='contained' onClick={() => setShowAddForm(!showAddForm)} sx={{ mb: 2 }}>
            {'Add New Question'}{' '}
          </Button>{' '}
          <Button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? <ExpandLess /> : <ExpandMore />} More Filters
          </Button>
        </Box>
        <TextField
          placeholder='Search by Category'
          size='small'
          variant='outlined'
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Collapse in={showFilters}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <InputLabel>Filter by Difficulty:</InputLabel>
            {['easy', 'medium', 'hard'].map((difficulty) => (
              <Chip
                key={difficulty}
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                onClick={() => handleFilterChange('difficulty', difficulty)}
                color={selectedDifficultyFilters.includes(difficulty) ? 'primary' : 'default'}
                variant='outlined'
              />
            ))}
            <InputLabel>Filter by Category:</InputLabel>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => handleFilterChange('category', category.id)}
                color={selectedCategoryFilters.includes(category.id) ? 'primary' : 'default'}
                variant='outlined'
              />
            ))}
          </Box>
        </Collapse>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell
                onClick={handleSort}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                Category {sortDirection === 'asc' ? <ExpandLess /> : <ExpandMore />}
              </StyledTableCell>
              <StyledTableCell>Question</StyledTableCell>
              <StyledTableCell>Difficulty</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredQuestions.map((question) => (
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
      {showAddForm && (
        <ManageQuestionDialog
          onSubmit={handleSubmit}
          onClose={handleClose}
          editingQuestion={editingQuestion}
        />
      )}
    </>
  );
};

export default QuestionsManagement;
