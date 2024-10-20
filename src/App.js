import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import { styled, createTheme, ThemeProvider } from '@mui/system';
import './App.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const StyledTextField = styled(TextField)({
  // margin: '1px',
});

const StyledInputLabel = styled(InputLabel)({
  margin: '0px',
});

const App = () => {
  const { control, handleSubmit } = useForm();
  const [categories, setCategories] = useState([]);
  const [imageFields, setImageFields] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (key.startsWith('image')) {
          formData.append('images', data[key][0]);
        } else {
          formData.append(key, data[key]);
        }
      });

      await axios.post(`http://localhost:3001/questions/${data.category}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Failed to add question');
    }
  };

  const addImageField = () => {
    setImageFields([...imageFields, { id: imageFields.length + 1 }]);
  };

  const removeImageField = (id) => {
    setImageFields(imageFields.filter((field) => field.id !== id));
  };

  return (
    <Container maxWidth='md'>
      <Box sx={{ my: 2, textAlign: 'center' }}>
        <Typography variant='h6' component='h6' gutterBottom>
          Add New Question
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledInputLabel>Category</StyledInputLabel>
          <FormControl fullWidth>
            <Controller
              name='category'
              control={control}
              defaultValue=''
              rules={{ required: 'Category is required' }}
              render={({ field }) => (
                <Select {...field} size='small' sx={{ marginBottom: '8px' }}>
                  {categories.map((category) => (
                    <MenuItem key={category.category} value={category.category}>
                      {category.category}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <StyledInputLabel>Question</StyledInputLabel>
          <Controller
            name='question'
            control={control}
            defaultValue=''
            rules={{ required: 'Question is required' }}
            render={({ field }) => (
              <StyledTextField {...field} size='small' fullWidth sx={{ marginBottom: '8px' }} />
            )}
          />
          {['option1', 'option2', 'option3', 'option4'].map((optionName, index) => (
            <Controller
              key={optionName}
              name={optionName}
              control={control}
              defaultValue=''
              rules={{ required: `Option ${index + 1} is required` }}
              render={({ field }) => (
                <>
                  <StyledInputLabel>{`Option ${index + 1}`}</StyledInputLabel>
                  <StyledTextField {...field} size='small' fullWidth sx={{ marginBottom: '8px' }} />
                </>
              )}
            />
          ))}
          <StyledInputLabel>Correct Answer</StyledInputLabel>
          <Controller
            name='answer'
            control={control}
            defaultValue=''
            rules={{ required: 'Answer is required' }}
            render={({ field }) => (
              <StyledTextField {...field} size='small' fullWidth sx={{ marginBottom: '8px' }} />
            )}
          />
          <StyledInputLabel>Difficulty</StyledInputLabel>
          <Controller
            name='difficulty'
            control={control}
            defaultValue=''
            rules={{ required: 'Difficulty is required' }}
            render={({ field }) => (
              <FormControl fullWidth>
                <Select {...field} size='small' sx={{ marginBottom: '8px' }}>
                  <MenuItem value='easy'>Easy</MenuItem>
                  <MenuItem size='small' value='medium'>
                    Medium
                  </MenuItem>
                  <MenuItem size='small' value='hard'>
                    Hard
                  </MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {imageFields.map((field) => (
            <Box
              key={field.id}
              sx={{ display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <Controller
                key={field.id}
                name={`image${field.id}`}
                control={control}
                defaultValue=''
                render={({ field: { onChange, ...rest } }) => (
                  <StyledTextField
                    {...rest}
                    size='small'
                    type='file'
                    onChange={(e) => onChange(e.target.files)}
                    fullWidth
                    sx={{ marginBottom: '8px' }}
                    // InputLabelProps={{ shrink: true }}
                  />
                )}
              />
              <Tooltip title='Remove Image'>
                <IconButton
                  onClick={() => removeImageField(field.id)}
                  color='error'
                  sx={{ position: 'absolute', right: 0, mb: '8px' }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title='Add another Image'>
              <Button
                onClick={addImageField}
                color='success'
                variant='outlined'
                startIcon={<AddIcon />}
                disabled={imageFields.length >= 4}
              >
                Add Image
              </Button>
            </Tooltip>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Button type='submit' variant='contained' color='primary' sx={{ width: '100%' }}>
              submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default App;
