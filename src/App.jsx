import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Dashboard from './pages/Dashboard'
import Medications from './pages/Medications'
import Labs from './pages/Labs'
import LabReview from './pages/LabReview'
import Timeline from './pages/Timeline'
import Assistant from './pages/Assistant'
import Caregiver from './pages/Caregiver'
import DoctorReport from './pages/DoctorReport'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="medications" element={<Medications />} />
        <Route path="labs" element={<Labs />} />
        <Route path="labs/review" element={<LabReview />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="caregiver" element={<Caregiver />} />
        <Route path="doctor-report" element={<DoctorReport />} />
      </Route>
    </Routes>
  )
}

export default App
