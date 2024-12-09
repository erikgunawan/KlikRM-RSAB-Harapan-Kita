import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DoctorPortal from './pages/DoctorPortal';
import PatientPortal from './pages/PatientPortal';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/doctor" element={<DoctorPortal />} />
          <Route path="/patient" element={<PatientPortal />} />
          <Route path="/" element={<PatientPortal />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;