import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Landing from './views/Landing';
import UploadResume from './views/UploadResume';
import JobDescription from './views/JobDescription';
import Results from './views/Results';
import PitchDeck from './views/PitchDeck';
import Profile from './views/Profile';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/upload" element={<UploadResume />} />
          <Route path="/job-description" element={<JobDescription />} />
          <Route path="/results" element={<Results />} />
          <Route path="/pitch" element={<PitchDeck />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        <Analytics />
      </Router>
    </AuthProvider>
  );
}
