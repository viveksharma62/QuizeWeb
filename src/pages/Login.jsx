import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../db/firebase.js";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import 'animate.css';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [stream, setStream] = useState("");
  const [enroll, setEnroll] = useState("");
  const [college, setCollege] = useState(""); // ✅ College Name
  const [cgpa, setCgpa] = useState("");       // ✅ Current CGPA
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Logged in successfully!");
        navigate("/features");
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // ✅ Store extra info in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name,
          address,
          stream,
          enroll,
          college,  // Save College Name
          cgpa,     // Save Current CGPA
          email,
        });

        setMessage("🎉 Account created successfully! You can now login.");
        setIsLogin(true);
        setName(""); setAddress(""); setStream(""); setEnroll(""); setCollege(""); setCgpa(""); setEmail(""); setPassword("");
      }
    } catch (err) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 animate__animated animate__fadeInUp login-card" style={{ borderRadius: "15px", maxWidth: "450px", width: "100%" }}>
        <h3 className="text-center mb-4 fw-bold">{isLogin ? "Login" : "Register"}</h3>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="mb-3">
                <label>Name</label>
                <input type="text" className="form-control form-control-lg" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Address</label>
                <input type="text" className="form-control form-control-lg" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Stream</label>
                <input type="text" className="form-control form-control-lg" value={stream} onChange={(e) => setStream(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Enrollment No.</label>
                <input type="text" className="form-control form-control-lg" value={enroll} onChange={(e) => setEnroll(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>College Name</label> {/* ✅ College Name */}
                <input type="text" className="form-control form-control-lg" value={college} onChange={(e) => setCollege(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label>Current CGPA</label> {/* ✅ CGPA */}
                <input type="text" className="form-control form-control-lg" value={cgpa} onChange={(e) => setCgpa(e.target.value)} required />
              </div>
            </>
          )}

          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100 shadow-sm">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {message && <div className="alert alert-info mt-3 animate__animated animate__fadeIn">{message}</div>}

        <div className="text-center mt-3">
          <button className="btn btn-link text-decoration-none" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
