import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/notes/new"
  element={
    <ProtectedRoute>
      <CreateNote />
    </ProtectedRoute>
  }
/>

<Route
  path="/notes/:id/edit"
  element={
    <ProtectedRoute>
      <EditNote />
    </ProtectedRoute>
  }
/>
      </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;