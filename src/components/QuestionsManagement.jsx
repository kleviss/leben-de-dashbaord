import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddQuestionForm from './AddQuestionForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  // backgroundColor: theme.palette.primary.main,
  // color: theme.palette.common.white,
}));

const QuestionsManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <Box>
      <Button variant='contained' onClick={() => setShowAddForm(!showAddForm)} sx={{ mb: 2 }}>
        {showAddForm ? 'Hide Form' : 'Add New Question'}
      </Button>
      {showAddForm && <AddQuestionForm onQuestionAdded={fetchQuestions} />}
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
                  <Button variant='outlined' size='small' startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button variant='outlined' size='small' color='error' startIcon={<DeleteIcon />}>
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
