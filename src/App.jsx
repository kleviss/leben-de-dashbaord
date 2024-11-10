import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import CategoriesManagement from './components/CategoriesManagement';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import QuestionsManagement from './components/QuestionsManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Dashboard />}>
          <Route path='overview' element={<Overview />} />
          <Route path='categories' element={<CategoriesManagement />} />
          <Route path='questions' element={<QuestionsManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
