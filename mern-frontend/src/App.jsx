import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import ExperienceCard from './components/ExperienceCard';
import AddExperience from './pages/AddExperience';
import ExperienceView from './pages/ExperienceView';
import Navbar from './components/Navbar';

function App() {

  return (
    <>
      <div>
        <Router>
          <Navbar />
          <Routes>
            <Route path='/h' element={<ExperienceCard />} />
            <Route path='/login' element={<StudentLogin />} />
            <Route path='/register' element={<StudentRegister />} />
            <Route path='/' element={<ExperienceView />} />
            <Route path='/add-experience' element={<AddExperience />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App;
