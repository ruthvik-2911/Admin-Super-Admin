import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/admin/Register";
import RegistrationStatus from "./pages/admin/RegistrationStatus";
import Login from "./pages/admin/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/register" />} />
        <Route path="/admin/register" element={<Register />} />
        <Route path="/admin/status" element={<RegistrationStatus />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;