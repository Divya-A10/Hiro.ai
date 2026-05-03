import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Landing from './pages/Landing';
import UploadResume from './pages/UploadResume';
import JobDescription from './pages/JobDescription';
import Results from './pages/Results';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/job-description" element={<JobDescription />} />
        <Route path="/results" element={<Results />} />
      </Routes>
      <Analytics />
    </Router>
  );
}
