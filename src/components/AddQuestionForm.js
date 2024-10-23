import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 120,
  marginBottom: theme.spacing(2),
}));

const AddQuestionForm = ({ onQuestionAdded }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    difficulty: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement the API call to add a new question
    // Then call onQuestionAdded to refresh the questions list
    onQuestionAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <StyledFormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select name='categoryId' value={formData.categoryId} onChange={handleChange}>
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </StyledFormControl>
      <TextField
        fullWidth
        label='Question'
        name='question'
        value={formData.question}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      {formData.options.map((option, index) => (
        <TextField
          key={index}
          fullWidth
          label={`Option ${index + 1}`}
          value={option}
          onChange={(e) => handleOptionChange(index, e.target.value)}
          sx={{ mb: 2 }}
        />
      ))}
      <TextField
        fullWidth
        label='Correct Answer'
        name='answer'
        value={formData.answer}
        onChange={handleChange}
        sx={{ mb: 2 }}
      />
      <StyledFormControl fullWidth>
        <InputLabel>Difficulty</InputLabel>
        <Select name='difficulty' value={formData.difficulty} onChange={handleChange}>
          <MenuItem value='easy'>Easy</MenuItem>
          <MenuItem value='medium'>Medium</MenuItem>
          <MenuItem value='hard'>Hard</MenuItem>
        </Select>
      </StyledFormControl>
      <Box sx={{ mt: 2 }}>
        <Button type='submit' variant='contained'>
          Add Question
        </Button>
      </Box>
    </form>
  );
};

export default AddQuestionForm;
