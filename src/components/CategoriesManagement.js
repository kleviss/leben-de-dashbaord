import * as React from 'react';
import {
  Box,
  Button,
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
  IconButton,
  DialogContentText,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { CATEGORIES_API } from '../api/routes/index.js';

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

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(CATEGORIES_API.GET_ALL);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
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

    const categoryData = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    try {
      let response;
      if (editingCategory) {
        // Update existing category
        response = await fetch(CATEGORIES_API.UPDATE(editingCategory._id), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
        });
      } else {
        // Create new category
        response = await fetch(CATEGORIES_API.CREATE, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(categoryData),
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

  return (
    <Box>
      <Button variant='contained' onClick={() => handleOpen()} sx={{ mb: 2 }}>
        Add New Category
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category._id}>
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
                    onClick={() => handleDeleteConfirmOpen(category)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
        <form onSubmit={handleSave}>
          <DialogContent>
            <TextField
              autoFocus
              margin='dense'
              name='name'
              label='Category Name'
              type='text'
              fullWidth
              variant='outlined'
              defaultValue={editingCategory?.name || ''}
            />
            <TextField
              margin='dense'
              name='description'
              label='Description'
              type='text'
              fullWidth
              variant='outlined'
              defaultValue={editingCategory?.description || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type='submit'>Save</Button>
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
          <Button onClick={handleDeleteConfirmClose}>Cancel</Button>
          <Button onClick={handleDelete} color='error' autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
