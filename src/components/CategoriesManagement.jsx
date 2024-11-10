import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
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

import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { CATEGORIES_API } from '../api/routes/index.js';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import UploadIcon from '@mui/icons-material/Upload';

export default function CategoriesManagement() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasRequestFailed, setHasRequestFailed] = useState(false);
  const [aiPhotos, setAiPhotos] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [selectedAiPhoto, setSelectedAiPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetchCategories();
    }, 1000);
  }, []);

  // Function to fetch photos from Pexels
  const fetchPexelsPhotos = async (query) => {
    setIsLoadingPhotos(true);
    try {
      const randomPage = Math.floor(Math.random() * 10) + 1;
      const randomSeed = Math.random().toString(36).substring(7);

      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}-germany&per_page=3&orientation=square&page=${randomPage}&seed=${randomSeed}`,
        {
          headers: {
            Authorization: 'SAmj8B87y4eVFupR0AmJ8vagQHvBfILEzv7tVzvPjHSYo3CsucOe43Ch',
          },
        }
      );
      const data = await response.json();
      setAiPhotos(data.photos);
    } catch (error) {
      console.error('Error fetching Pexels photos:', error);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  // Function to handle AI button click
  const handleAiClick = () => {
    const categoryName = editingCategory?.name;
    if (categoryName) {
      fetchPexelsPhotos(categoryName);
    } else {
      // Show some error message that category name is required
      alert('Please enter a category name first');
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

  const handleOpen = (category = null) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    setImageFile(null);
    setSelectedAiPhoto(null);
    setAiPhotos([]);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    const formData = new FormData(event.currentTarget);

    try {
      // If there's a selected Pexels photo, fetch it and convert to File
      if (selectedAiPhoto) {
        const response = await fetch(selectedAiPhoto);
        const blob = await response.blob();
        const file = new File([blob], 'pexels-image.jpg', { type: 'image/jpeg' });
        formData.append('image', file);
      } else if (imageFile) {
        formData.append('image', imageFile);
      }

      let response;
      if (editingCategory) {
        response = await fetch(CATEGORIES_API.UPDATE(editingCategory._id), {
          method: 'PATCH',
          body: formData,
        });
      } else {
        response = await fetch(CATEGORIES_API.CREATE, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setTimeout(() => {
        handleClose();
        fetchCategories();
      }, 1000);
      setSaveSuccess(true);
    } catch (error) {
      console.error(
        editingCategory ? 'Error updating category:' : 'Error creating category:',
        error
      );
      setSaveError(error.message || 'An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteConfirmOpen = (category) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmClose = () => {
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await fetch(CATEGORIES_API.DELETE(categoryToDelete._id), { method: 'DELETE' });
      fetchCategories();
      handleDeleteConfirmClose();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const [hoveredCategory, setHoveredCategory] = React.useState(null);
  const handleImageUpload = (category) => {
    setEditingCategory(category);
    setOpen(true);
  };

  const [searchText, setSearchText] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const filteredCategories = categories
    .filter((category) => category.name.toLowerCase().includes(searchText.toLowerCase()))
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant='contained' onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add New Category
        </Button>
        <TextField
          // label='Search Categories'
          placeholder='Search Categories'
          variant='outlined'
          value={searchText}
          onChange={handleSearchChange}
          sx={{ width: '300px' }}
          size='small'
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ borderBottom: '1px solid white' }}>
              <TableCell onClick={handleSort} style={{ cursor: 'pointer', display: 'flex' }}>
                Name {sortDirection === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </TableCell>
              <TableCell sx={{ borderBottom: '1px solid white' }}>Description</TableCell>
              <TableCell sx={{ borderBottom: '1px solid white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <Box
                    onMouseEnter={() => setHoveredCategory(category._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    onClick={() => handleImageUpload(category)}
                    sx={{
                      position: 'relative',
                      width: '120px',
                      height: '67.5px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}
                  >
                    {category.imageUrl ? (
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          backgroundColor: '#f0f0f0',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '10px',
                        }}
                      >
                        No Image
                      </Box>
                    )}
                    {hoveredCategory === category._id && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'white',
                        }}
                      >
                        <UploadIcon />
                      </Box>
                    )}
                  </Box>
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<EditIcon />}
                    onClick={() => handleOpen(category)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant='outlined'
                    size='small'
                    color='error'
                    startIcon={<DeleteIcon />}
                    onClick={() => {
                      setDeleteConfirmOpen(true);
                      setCategoryToDelete(category);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='xs'
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            position: 'relative',
          },
        }}
      >
        {isSaving && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <CircularProgress sx={{ color: 'white' }} />
            <Typography sx={{ color: 'white', mt: 2 }}>
              {saveSuccess ? 'Save successful!' : 'Saving...'}
            </Typography>
          </Box>
        )}
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <DialogContentText sx={{ ml: 3, mt: -1, mb: 2 }}>
          {editingCategory ? 'Edit the category details below' : 'Enter the category details below'}
        </DialogContentText>
        <form onSubmit={handleSave}>
          <DialogContent dividers>
            <InputLabel sx={{ mb: 0 }}>Category Name</InputLabel>
            <TextField
              autoFocus
              margin='dense'
              name='name'
              type='text'
              fullWidth
              variant='outlined'
              defaultValue={editingCategory?.name || ''}
            />
            <InputLabel sx={{ mb: 0 }}>Description</InputLabel>
            <TextField
              margin='dense'
              name='description'
              type='text'
              fullWidth
              variant='outlined'
              defaultValue={editingCategory?.description || ''}
            />
            <input
              accept='image/*'
              style={{ display: 'none' }}
              id='raised-button-file'
              type='file'
              onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
              }}
            />{' '}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <label htmlFor='raised-button-file'>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'baseline', gap: 1 }}
                >
                  <Button
                    variant='contained'
                    component='span'
                    sx={{ mt: 1 }}
                    startIcon={<UploadIcon />}
                  >
                    Upload Image
                  </Button>
                  {imageFile && <Typography>Selected file: {imageFile.name}</Typography>}
                </Box>
              </label>
              <Button
                variant='contained'
                component='span'
                sx={{
                  mt: 1,
                  background: 'linear-gradient(to right, #6200ff, #ff00ea)',
                  '&:hover': {
                    background: 'linear-gradient(to right, #fff, #6200ff)',
                    transition: 'background 1s ease',
                  },
                }}
                startIcon={<AutoFixHighIcon />}
                onClick={handleAiClick}
              >
                Use AI
              </Button>
            </Box>{' '}
            {isLoadingPhotos && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {aiPhotos.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant='subtitle1' sx={{ mb: 1 }}>
                  Select an AI-generated photo:
                </Typography>
                <Grid container spacing={2}>
                  {aiPhotos.map((photo) => (
                    <Grid item xs={4} key={photo.id}>
                      <Box
                        onClick={() => {
                          setSelectedAiPhoto(photo.src.original);
                          setImageFile(null); // Clear file upload when selecting AI photo
                        }}
                        sx={{
                          position: 'relative',
                          cursor: 'pointer',
                          borderRadius: 1,
                          overflow: 'hidden',
                          border:
                            selectedAiPhoto === photo.src.original
                              ? '3px solid #6200ff'
                              : '3px solid transparent',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <img
                          src={photo.src.medium}
                          alt={photo.photographer}
                          style={{
                            width: '100%',
                            height: '150px',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </DialogContent>
          {saveError && (
            <Box sx={{ p: 2, bgcolor: '#ffebee' }}>
              <Typography color='error' variant='body2'>
                Error: {saveError}
              </Typography>
            </Box>
          )}
          <DialogActions>
            <Button onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteConfirmClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Category Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>?
          </DialogContentText>
          {/*  This action cannot be undone. */}
          <DialogContentText sx={{ mt: 2, fontWeight: 'bold', fontSize: '14px' }} color='error'>
            This action cannot be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
