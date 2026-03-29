import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthProvider from "./context/AuthContext";
import About from "./pages/About";
// User Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";

// Admin Components
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/Dashboard";
import AdminCourses from "./admin/Courses";
import AddCourse from "./admin/AddCourse";
import Lessons from "./admin/Lessons";
import Users from "./admin/Users";
import Enrollments from "./admin/Enrollments";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          {/* USER PROTECTED ROUTE */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN LOGIN */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* ADMIN PANEL */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="courses/add" element={<AddCourse />} />
            <Route path="courses/:id/lessons" element={<Lessons />} />
            <Route path="users" element={<Users />} />
            <Route path="enrollments" element={<Enrollments />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}