import React, { useState, useEffect } from "react";
import { auth, db } from "../db/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { FaEnvelope, FaUser, FaMapMarkerAlt, FaBook, FaUserShield, FaSchool, FaClipboard } from "react-icons/fa";

const Account = () => {
  const [userData, setUserData] = useState({});
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No user data found!");
        }
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUserData({});
    navigate("/");
  };

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogin = () => {
    if (adminId === "admin" && adminPass === "admin123") {
      navigate("/admin");
    } else {
      alert("Invalid Admin Credentials!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ borderRadius: "15px" }}>
        <h2 className="text-center mb-4" style={{ fontWeight: "600" }}>
          Account Details
        </h2>

        <div className="list-group list-group-flush">
          {userData.email && (
            <div className="list-group-item d-flex align-items-center">
              <FaEnvelope className="me-3 text-primary" size={20} />
              <div>
                <div className="fw-bold">Email</div>
                <div>{userData.email}</div>
              </div>
            </div>
          )}

          {userData.name && (
            <div className="list-group-item d-flex align-items-center">
              <FaUser className="me-3 text-success" size={20} />
              <div>
                <div className="fw-bold">Name</div>
                <div>{userData.name}</div>
              </div>
            </div>
          )}

          {userData.enroll && (
            <div className="list-group-item d-flex align-items-center">
              <FaClipboard className="me-3 text-warning" size={20} />
              <div>
                <div className="fw-bold">Enrollment No.</div>
                <div>{userData.enroll}</div>
              </div>
            </div>
          )}

          {userData.address && (
            <div className="list-group-item d-flex align-items-center">
              <FaMapMarkerAlt className="me-3 text-danger" size={20} />
              <div>
                <div className="fw-bold">Address</div>
                <div>{userData.address}</div>
              </div>
            </div>
          )}

          {userData.stream && (
            <div className="list-group-item d-flex align-items-center">
              <FaBook className="me-3 text-warning" size={20} />
              <div>
                <div className="fw-bold">Stream</div>
                <div>{userData.stream}</div>
              </div>
            </div>
          )}

          {userData.college && (
            <div className="list-group-item d-flex align-items-center">
              <FaSchool className="me-3 text-info" size={20} />
              <div>
                <div className="fw-bold">College Name</div>
                <div>{userData.college}</div>
              </div>
            </div>
          )}

          {userData.cgpa && (
            <div className="list-group-item d-flex align-items-center">
              <FaClipboard className="me-3 text-secondary" size={20} />
              <div>
                <div className="fw-bold">Current CGPA</div>
                <div>{userData.cgpa}</div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          className="btn btn-danger w-100 mt-4"
          onClick={handleLogout}
          style={{ borderRadius: "10px", fontWeight: "500" }}
        >
          Logout
        </button>

        {/* Admin Button */}
        <button
          className="btn btn-primary w-100 mt-2"
          onClick={handleAdminClick}
          style={{ borderRadius: "10px", fontWeight: "500" }}
        >
          <FaUserShield className="me-2" /> Admin Panel
        </button>

        {/* Admin Login Form */}
        {showAdminLogin && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Admin ID"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              className="form-control mb-2"
            />
            <button
              className="btn btn-success w-100"
              onClick={handleAdminLogin}
            >
              Login as Admin
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
