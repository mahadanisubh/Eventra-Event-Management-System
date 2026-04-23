import React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Profile from "./pages/Profile.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import CreateEvent from "./pages/admin/CreateEvent.jsx";
import MyEvents from "./pages/admin/MyEvents.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import EditEvent from "./pages/admin/EditEvent.jsx";
import VerifyOtp from "./pages/VerifyOtp.jsx";
import Analytics from "./pages/Analytics.jsx";

function App() {
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/editevent/:eventId" element={<AdminRoute> <EditEvent /> </AdminRoute>}/>
      <Route path="/admin" element={<AdminRoute> <AdminDashboard /> </AdminRoute>}/>
      <Route path="/myevents" element={<AdminRoute> <MyEvents /> </AdminRoute>}/>
      <Route path="/createevent" element={<AdminRoute> <CreateEvent /> </AdminRoute>}/>
      <Route path="/event/:eventId" element={<EventDetails />} />
      <Route path="/" element={<Home />} />
      <Route path="/user" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>}/>
      <Route path="/createuser" element={<Register />}/>
      <Route path="/loginuser" element={<Login />}/>
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/analytics" element= {<Analytics />} />
    </Routes>
    </>
  )
}

export default App;