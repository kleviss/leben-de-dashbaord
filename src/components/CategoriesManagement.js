import * as React from 'react';
import {
  Box,
  Button as MuiButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  DialogContentText,
  CircularProgress,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { CATEGORIES_API } from '../api/routes/index.js';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import UploadIcon from '@mui/icons-material/Upload';
import { InputText } from 'primereact/inputtext';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useState } from 'react';
import Grid from '@mui/material/Grid';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  // backgroundColor: theme.palette.primary.main,
  // color: theme.palette.common.white,
}));

export default function CategoriesManagement() {
  const [categories, setCategories] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState(null);
  const [imageFile, setImageFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasRequestFailed, setHasRequestFailed] = React.useState(false);
  // ai photo picker states
  const [aiPhotos, setAiPhotos] = useState([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [selectedAiPhoto, setSelectedAiPhoto] = useState(null);

  React.useEffect(() => {
    // fetchCategories();
    setTimeout(() => {
      fetchCategories();
    }, 1000);
  }, []);

  // Add this new function to fetch photos from Pexels
  const fetchPexelsPhotos = async (query) => {
    setIsLoadingPhotos(true);
    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${query}&per_page=3&orientation=square`,
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

  // Add this function to handle AI button click
  const handleAiClick = () => {
    const categoryName = document.querySelector('input[name="name"]').value;
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
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (imageFile) {
      formData.append('image', imageFile);
    }
    // const categoryData = {
    //   name: formData.get('name'),
    //   description: formData.get('description'),
    // };

    try {
      let response;
      if (editingCategory) {
        // Update existing category
        response = await fetch(CATEGORIES_API.UPDATE(editingCategory._id), {
          method: 'PATCH',
          body: formData,
        });
      } else {
        // Create new category
        response = await fetch(CATEGORIES_API.CREATE, {
          method: 'POST',
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(editingCategory ? 'Updated category:' : 'Created category:', data);
      handleClose();
      fetchCategories();
    } catch (error) {
      console.error(
        editingCategory ? 'Error updating category:' : 'Error creating category:',
        error
      );
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

  const imageBodyTemplate = (category) => {
    return (
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
    );
  };

  const actionsBodyTemplate = (category) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          icon='pi pi-pencil'
          outlined
          className='mr-2'
          onClick={() => handleOpen(category)}
          severity='info'
          label='Edit'
          size='small'
        />
        <Button
          icon='pi pi-trash'
          outlined
          severity='danger'
          onClick={() => handleDeleteConfirmOpen(category)}
          label='Delete'
          size='small'
        />
      </Box>
    );
  };

  const [globalFilterValue, setGlobalFilterValue] = React.useState('');
  const [filteredCategories, setFilteredCategories] = React.useState([]);

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);

    if (value) {
      const filtered = categories.filter((category) => {
        return Object.keys(category).some((field) => {
          return String(category[field]).toLowerCase().includes(value.toLowerCase());
        });
      });
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([...categories]);
    }
  };

  const renderHeader = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mr: 14 }}>
        <MuiButton variant='contained' onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add New Category
        </MuiButton>
        <Box>
          <span className='p-input-icon-left'>
            <i className='pi pi-search' style={{ marginRight: '15px', marginLeft: '15px' }} />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder='Keyword Search'
              style={{ padding: '10px', paddingLeft: '40px' }}
            />
          </span>
        </Box>
      </Box>
    );
  };

  const header = renderHeader();

  return (
    <Box>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between' }}> */}
      {/* <MuiButton variant='contained' onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add New Category
        </MuiButton> */}
      {/*  search componet input label with backgorund color gray */}
      {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <TextField
            label='Search'
            variant='outlined'
            InputProps={{
              sx: { backgroundColor: '#f0f0f0', padding: '0 5px', minWidth: '300px' },
            }}
            InputLabelProps={{
              sx: { backgroundColor: '#f0f0f0', padding: '-5px 5px', lineHeight: '1.1' },
            }}
            onChange={(e) => {
              console.log(e.target.value);
            }}
          />
        </Box> */}
      {/* </Box> */}

      {isLoading && !hasRequestFailed && (
        <Box
          sx={{
            display: 'flex',
            height: '70vh',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <CircularProgress color='primary' />
        </Box>
      )}

      {!isLoading && hasRequestFailed && (
        <Typography color='error'>Failed to fetch categories</Typography>
      )}

      {!isLoading && !hasRequestFailed && (
        <DataTable
          value={filteredCategories.length > 0 ? filteredCategories : categories}
          header={header}
          tableStyle={{ minWidth: '50rem' }}
          globalFilterFields={['name', 'description']}
        >
          <Column header='Image' body={imageBodyTemplate}></Column>
          <Column field='name' header='Name'></Column>
          <Column field='description' header='Description'></Column>
          <Column header='Actions' body={actionsBodyTemplate}></Column>
        </DataTable>
      )}
      <Dialog open={open} onClose={handleClose} maxWidth='xs' fullWidth>
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
                  <MuiButton
                    variant='contained'
                    component='span'
                    sx={{ mt: 1 }}
                    startIcon={<UploadIcon />}
                  >
                    Upload Image
                  </MuiButton>
                  {imageFile && <Typography>Selected file: {imageFile.name}</Typography>}
                </Box>
              </label>
              <MuiButton
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
              >
                Use AI
              </MuiButton>
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
          <DialogActions>
            <MuiButton onClick={handleClose}>Cancel</MuiButton>
            <MuiButton type='submit'>Save</MuiButton>
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
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={handleDeleteConfirmClose}>Cancel</MuiButton>
          <MuiButton onClick={handleDelete} color='error' autoFocus>
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
