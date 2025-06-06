import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Chat from './components/Chat';
import PrivateRoute from './PrivateRoute';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>} />
          <Route path="/signup" element={<Register />} />
          <Route path="/signin" element={<Login />} />
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App