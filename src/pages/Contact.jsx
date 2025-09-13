import React, { useState, useEffect } from "react";
import { db } from "../db/firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || ""); // 👈 persist email

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        reply: "", 
        timestamp: serverTimestamp(),
      });

      setSuccess("✅ Message sent successfully!");
      // 👇 email ko save karo (refresh ke baad bhi rahe)
      setUserEmail(formData.email);
      localStorage.setItem("userEmail", formData.email);

      setFormData({ name: "", email: formData.email, message: "" }); // 👈 email clear mat karo
    } catch (error) {
      console.error("Error saving contact:", error);
      setSuccess("❌ Failed to send message. Try again!");
    }

    setLoading(false);
  };

  // Real-time listener for user messages
  useEffect(() => {
    if (!userEmail) return; // 👈 ab userEmail ke upar depend karega

    const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userData = data.filter((msg) => msg.email === userEmail);
      setUserMessages(userData);
    });

    return () => unsubscribe();
  }, [userEmail]);

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-body p-4 p-md-5">
              <h2 className="text-center text-primary mb-4 fw-bold">
                📩 Contact Us
              </h2>
              <p className="text-center text-muted mb-4">
                Have questions or feedback? Fill out the form below and we’ll get back to you soon.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg shadow"
                    disabled={loading}
                  >
                    {loading ? "⏳ Sending..." : "🚀 Send Message"}
                  </button>
                </div>
              </form>

              {/* Success / Error Message */}
              {success && (
                <p className="text-center mt-3 fw-bold text-success">
                  {success}
                </p>
              )}

              {/* User Messages with Reply */}
              {userMessages.length > 0 && (
                <div className="mt-5">
                  <h4 className="fw-bold text-secondary mb-3">
                    📜 Your Messages & Replies
                  </h4>
                  {userMessages.map((msg) => (
                    <div key={msg.id} className="card shadow-sm border-0 mb-3">
                      <div className="card-body">
                        <p className="mb-1">
                          <strong>📝 Message:</strong> {msg.message}
                        </p>
                        <p className="text-muted small">
                          {msg.timestamp?.toDate().toLocaleString()}
                        </p>
                        {msg.reply ? (
                          <div className="alert alert-success mt-2">
                            <strong>✅ Admin Reply:</strong> {msg.reply}
                          </div>
                        ) : (
                          <div className="alert alert-warning mt-2">
                            ⏳ Waiting for admin reply...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
