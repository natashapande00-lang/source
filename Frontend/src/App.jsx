import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Final from './Code/Final'
import Login from './Code/Login'
import RootUser from './Code/RootUser'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Hide the shortener page from normal users by moving it to /god */}
        <Route path="/god" element={<Final />} />
        
        {/* Normal users hitting root get redirected to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        <Route path="/login" element={<Login />} />
        
        {/* Hidden root dashboard */}
        <Route path="/rootuser" element={<RootUser />} />
      </Routes>
    </Router>
  )
}

export default App