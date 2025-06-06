import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import Chat from './components/Chat';
import PrivateRoute from './PrivateRoute';

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