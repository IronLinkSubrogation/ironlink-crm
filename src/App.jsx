import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TaskBoard from './pages/employee/TaskBoard';
import KPIDashboard from './pages/admin/KPIDashboard';
import ClaimViewer from './pages/client/ClaimViewer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employee/dashboard" element={<TaskBoard />} />
        <Route path="/admin/kpi" element={<KPIDashboard />} />
        <Route path="/client/view-claims" element={<ClaimViewer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
