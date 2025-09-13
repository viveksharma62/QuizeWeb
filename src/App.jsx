import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./db/firebase.js";


import Home from "./pages/Home";
import Features from "./pages/Features";
import Nav from "./pages/Nav";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import QuizeQuest from "./pages/QuizeQuest";
import Login from "./pages/Login";
import QuizeStart from "./pages/QuizeStart";
import Account from "./pages/Account";
import Admin from "./pages/Admin.jsx";
import Leaning from "./components/Learning.jsx";
import AddQuest from "./components/AddQuest.jsx";
import AddContent from "./components/AddContent.jsx";
import ContactShow from "./components/ContactShow.jsx";
import StudentDetails from "./components/StudentDetails.jsx";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // true if user logged in, false otherwise
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Nav isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main className="flex-grow-1">
          <Routes>
            {/* Home always accessible */}
            <Route path="/" element={<Home />} />

            {/* Login route only if not logged in */}
            {!isLoggedIn && <Route path="/login" element={<Login />} />}

            {/* Protected routes */}
            {isLoggedIn && (
              <>
                <Route path="/features" element={<Features />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/quizestart" element={<QuizeStart />} />
                <Route path="/quizeQuest" element={<QuizeQuest />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/learning/:category" element={<Leaning />} />    
                <Route path="/addquest" element={<AddQuest />} />
                <Route path="/addcontent" element={<AddContent />} />
                <Route path="/contactshow" element={<ContactShow />} />
                <Route path="/studentdetails" element={<StudentDetails />} />
              </>
            )}

            {/* Redirect non-logged in users */}
            {!isLoggedIn && (
              <>
                <Route path="/features" element={<Navigate to="/" />} />
                <Route path="/contact" element={<Navigate to="/" />} />
                <Route path="/quizestart" element={<Navigate to="/" />} />
                <Route path="/quizeQuest" element={<Navigate to="/" />} />
                <Route path="/account" element={<Navigate to="/" />} />
                <Route path="/admin" element={<Navigate to="/" />} />
                <Route path="/learning/:category"  element={<Navigate to="/" />} /> 
                <Route path="/addquest" element={<Navigate to="/" />} />
                <Route path="/addcontent" element={<Navigate to="/" />} />
                <Route path="/contactshow" element={<Navigate to="/" />} />
                <Route path="/studentdetails" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
