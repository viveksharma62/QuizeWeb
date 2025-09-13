import React, { useState, useEffect } from "react";
import { db } from "../db/firebase"; 
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [userMessages, setUserMessages] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      setUserEmail(formData.email);
      localStorage.setItem("userEmail", formData.email);
      setFormData({ name: "", email: formData.email, message: "" });
    } catch (error) {
      console.error("Error saving contact:", error);
      setSuccess("❌ Failed to send message. Try again!");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!userEmail) return;
    const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserMessages(data.filter((msg) => msg.email === userEmail));
    });
    return () => unsubscribe();
  }, [userEmail]);

  // Inline CSS for professional styling
  const styles = {
    container: { marginTop: "50px", marginBottom: "50px" },
    card: { borderRadius: "12px", padding: "30px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" },
    formLabel: { fontWeight: "500" },
    button: { fontWeight: "600", letterSpacing: "1px" },
    sectionTitle: { marginBottom: "25px", color: "#2c3e50" },
    messageCard: { borderRadius: "10px", padding: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }
  };

  return (
    <div className="container" style={styles.container}>
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card p-4" style={styles.card}>
            <h2 className="text-center mb-3" style={{ color: "#007bff" }}>📩 Contact Us</h2>
            <p className="text-center text-muted mb-4">
              Have questions or feedback? Fill out the form below and we’ll get back to you soon.
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={styles.formLabel}>Full Name</label>
                <input type="text" name="name" className="form-control" placeholder="Enter your name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={styles.formLabel}>Email Address</label>
                <input type="email" name="email" className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label" style={styles.formLabel}>Message</label>
                <textarea name="message" className="form-control" rows="4" placeholder="Write your message..." value={formData.message} onChange={handleChange} required></textarea>
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary btn-lg" style={styles.button} disabled={loading}>
                  {loading ? "⏳ Sending..." : "🚀 Send Message"}
                </button>
              </div>
            </form>

            {success && <p className="text-center mt-3 fw-bold" style={{ color: success.includes("✅") ? "green" : "red" }}>{success}</p>}

            {/* User Messages */}
            {userMessages.length > 0 && (
              <div className="mt-5">
                <h4 className="fw-bold" style={styles.sectionTitle}>📜 Your Messages & Replies</h4>
                {userMessages.map((msg) => (
                  <div key={msg.id} className="mb-3 p-3" style={styles.messageCard}>
                    <p className="mb-1"><strong>📝 Message:</strong> {msg.message}</p>
                    <p className="text-muted small">{msg.timestamp?.toDate().toLocaleString()}</p>
                    {msg.reply ? (
                      <div className="alert alert-success mt-2"><strong>✅ Admin Reply:</strong> {msg.reply}</div>
                    ) : (
                      <div className="alert alert-warning mt-2">⏳ Waiting for admin reply...</div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
