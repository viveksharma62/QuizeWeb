import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../db/firebase";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";

const QuizeStart = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const snap = await getDocs(collection(db, "quizHistory"));
        const allAttempts = [];

        for (let docSnap of snap.docs) {
          const data = docSnap.data();
          const userRef = doc(db, "users", data.uid);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.exists() ? userSnap.data() : {};
          allAttempts.push({
            docId: docSnap.id,          // For delete
            studentName: userData.name || "Unknown",
            studentEnroll: userData.enroll || "N/A",
            quiz: data.category || "N/A",
            score: data.score || 0,
            correct: data.correct || 0,
            wrong: data.wrong || 0,
            skipped: data.skipped || 0,
            date: data.createdAt ? data.createdAt.toDate().toLocaleString() : "N/A"
          });
        }

        setHistory(allAttempts.reverse()); // latest first
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleDelete = async (docId) => {
    try {
      const password = prompt("Enter admin password to delete this attempt:");
      if (password !== "admin123") {
        alert("❌ Wrong password! Cannot delete.");
        return;
      }

      await deleteDoc(doc(db, "quizHistory", docId));
      setHistory(prev => prev.filter(h => h.docId !== docId));
      alert("✅ Attempt deleted successfully!");
    } catch (err) {
      console.error("Error deleting attempt:", err);
      alert("❌ Error deleting attempt.");
    }
  };

  return (
    <main className="flex-grow-1 d-flex flex-column align-items-center bg-light min-vh-100 py-5">
      <div className="container text-center">
        <h1 className="display-4 fw-bold text-dark mb-3">
          Welcome to <span className="text-primary">QuizWeb</span>
        </h1>
        <p className="lead text-muted mb-4">
          Test your knowledge with fun and interactive quizzes!
        </p>
        <Link to="/QuizeQuest" className="btn btn-primary btn-lg shadow mb-5">
          🚀 Get Started
        </Link>

        {/* Quiz History */}
        {history.length > 0 ? (
          <div className="text-start">
            <h3 className="mb-3">Quiz History of All Students:</h3>
            <table className="table table-striped shadow-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Quiz</th>
                  <th>Score</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                  <th>Skipped</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((attempt, index) => (
                  <tr key={index}>
                    <td>{attempt.studentName}</td>
                    <td>{attempt.studentEnroll}</td>
                    <td>{attempt.quiz}</td>
                    <td>{attempt.score}</td>
                    <td>{attempt.correct}</td>
                    <td>{attempt.wrong}</td>
                    <td>{attempt.skipped}</td>
                    <td>{attempt.date}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(attempt.docId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted">No quiz attempts yet.</p>
        )}
      </div>
    </main>
  );
};

export default QuizeStart;
