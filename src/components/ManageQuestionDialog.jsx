import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import UploadIcon from '@mui/icons-material/Upload';

const ManageQuestionDialog = ({ onSubmit, onClose, editingQuestion = null }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: '',
    question: '',
    options: ['', '', '', ''],
    answer: '',
    difficulty: '',
    hasImages: false,
    images: [null, null, null, null],
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add useEffect to handle editing
  useEffect(() => {
    if (editingQuestion) {
      setFormData({
        categoryId: editingQuestion.categoryId,
        question: editingQuestion.question,
        options: editingQuestion.options,
        answer: editingQuestion.answer,
        difficulty: editingQuestion.difficulty,
        hasImages: editingQuestion.images.length > 0,
        images: editingQuestion.images || [null, null, null, null],
      });
    }
  }, [editingQuestion]);

  const handleImageUpload = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/categories');
      const data = await response.json();
      // changeGesamtfragenkatalog to allgemein and sort by name
      const categories = data.map((category) => ({
        ...category,
        name: category.name === 'Gesamtfragenkatalog' ? 'Allgemein' : category.name,
      }));
      categories.sort((a, b) => a.name.localeCompare(b.name));
      setCategories(categories);
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
    //if formdata.categoryId is empty, set it to 'allgemein'
    if (formData.categoryId === 'gesamtfragenkatalog') {
      formData.categoryId = 'allgemein';
    }
    await onSubmit(formData, editingQuestion);
  };

  return (
    <Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ mb: -2 }}>
        {editingQuestion ? 'Edit Question' : 'Add New Question'}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 2,
              mt: 0,
              width: '100%',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ width: '68%' }}>
              <InputLabel sx={{ mb: 1 }}>Category</InputLabel>
              <Select
                fullWidth
                name='categoryId'
                value={formData.categoryId}
                onChange={handleChange}
                margin='dense'
                variant='outlined'
                sx={{ backgroundColor: 'white' }}
              >
                {categories.map((category) => {
                  return (
                    <MenuItem
                      key={category._id}
                      value={category._id === 'gesamtfragenkatalog' ? 'allgemein' : category._id}
                    >
                      {category.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ width: '30%' }}>
              <InputLabel sx={{ mt: 0, mb: 1 }}>Difficulty</InputLabel>
              <Select
                fullWidth
                name='difficulty'
                value={formData.difficulty}
                onChange={handleChange}
                margin='dense'
                variant='outlined'
                sx={{ backgroundColor: 'white' }}
              >
                <MenuItem value='easy'>Easy</MenuItem>
                <MenuItem value='medium'>Medium</MenuItem>
                <MenuItem value='hard'>Hard</MenuItem>
              </Select>
            </div>
          </Box>

          <InputLabel sx={{ mt: 2, mb: 0 }}>Question</InputLabel>
          <TextField
            fullWidth
            name='question'
            value={formData.question}
            onChange={handleChange}
            margin='dense'
            variant='outlined'
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.hasImages}
                onChange={(e) => {
                  const hasImages = e.target.checked;
                  setFormData({
                    ...formData,
                    hasImages: hasImages,
                    images: hasImages ? formData.images : [], // Clear images if unchecked
                  });
                }}
              />
            }
            label='Does the question have images?'
            sx={{ mt: 0 }}
            labelPlacement='end'
          />

          {formData.hasImages && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              {[0, 1, 2, 3].map((index) => (
                <Grid item xs={3} key={index}>
                  <Box
                    sx={{
                      width: '100%',
                      height: '100px',
                      border: '1px dashed grey',
                      borderRadius: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer !important',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        cursor: 'pointer !important',
                      },
                    }}
                  >
                    <input
                      accept='image/*'
                      type='file'
                      style={{ display: 'none' }}
                      id={`image-upload-${index}`}
                      onChange={(e) => handleImageUpload(index, e.target.files[0])}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      style={{ width: '100%', height: '100%' }}
                    >
                      {formData.images[index] ? (
                        <img
                          src={
                            formData.images[index] instanceof File
                              ? URL.createObjectURL(formData.images[index])
                              : formData.images[index]
                          }
                          alt={`Option ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '30px',
                          }}
                        >
                          <UploadIcon />
                          <Typography variant='caption'>Upload</Typography>
                        </Box>
                      )}
                    </label>
                  </Box>
                  <Typography variant='caption' align='center' display='block' sx={{ mt: 1 }}>
                    Option {index + 1} Image
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}

          {formData.options.map((option, index) => (
            <React.Fragment key={index}>
              <InputLabel sx={{ mt: index === 0 ? 2 : 1, mb: 0 }}>Option {index + 1}</InputLabel>
              <TextField
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                margin='dense'
                variant='outlined'
              />
            </React.Fragment>
          ))}

          <InputLabel sx={{ mt: 1, mb: 0 }}>Correct Answer</InputLabel>
          <TextField
            fullWidth
            name='answer'
            value={formData.answer}
            onChange={handleChange}
            margin='dense'
            variant='outlined'
          />
        </DialogContent>

        <DialogActions sx={{ m: 1, mt: -1, mr: 2 }}>
          <Button onClick={onClose} variant='outlined' color='primary'>
            Cancel
          </Button>
          <Button type='submit' variant='contained' color='primary' onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ManageQuestionDialog;
