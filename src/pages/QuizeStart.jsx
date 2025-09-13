import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../db/firebase";
import { collection, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import Loading from "./Loading"; // 👈 loading component
import { jsPDF } from "jspdf";

const QuizeStart = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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
            docId: docSnap.id,
            studentName: userData.name || "Unknown",
            studentEnroll: userData.enroll || "N/A",
            quiz: data.category || "N/A",
            score: data.score || 0,
            correct: data.correct || 0,
            wrong: data.wrong || 0,
            skipped: data.skipped || 0,
            date: data.createdAt
              ? data.createdAt.toDate().toLocaleString()
              : "N/A",
          });
        }

        setHistory(allAttempts.reverse());
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
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
      setHistory((prev) => prev.filter((h) => h.docId !== docId));
      alert("✅ Attempt deleted successfully!");
    } catch (err) {
      console.error("Error deleting attempt:", err);
      alert("❌ Error deleting attempt.");
    }
  };

  const downloadCertificate = (userName, userEnroll, score, total) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const primaryColor = "#1976d2";
    const secondaryColor = "#444";

    // Border
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Title
    doc.setFontSize(32);
    doc.setTextColor(primaryColor);
    doc.text("Certificate of Achievement", pageWidth / 2, 40, { align: "center" });

    // Awarded By
    doc.setFontSize(18);
    doc.setTextColor(255, 140, 0); // orange
    doc.text("Awarded By: QuizoPedia", pageWidth / 2, 60, { align: "center" });

    // Main text
    doc.setFontSize(20);
    doc.setTextColor("#000");
    doc.text("This certificate is proudly presented to", pageWidth / 2, 80, { align: "center" });

    // User Name
    doc.setFontSize(26);
    doc.setTextColor(primaryColor);
    doc.text(userName, pageWidth / 2, 100, { align: "center" });

    // Enrollment
    doc.setFontSize(16);
    doc.setTextColor(secondaryColor);
    doc.text(`Enrollment: ${userEnroll}`, pageWidth / 2, 115, { align: "center" });

    // Score and Percentage
    const percentage = ((score / total) * 100).toFixed(2);
    doc.text(`Score: ${score} / ${total}`, pageWidth / 2, 130, { align: "center" });
    doc.text(`Percentage: ${percentage}%`, pageWidth / 2, 145, { align: "center" });

    // Date & Time
    const now = new Date();
    doc.setFontSize(14);
    doc.text(`Date: ${now.toLocaleDateString()}   Time: ${now.toLocaleTimeString()}`, pageWidth / 2, 165, { align: "center" });

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text("© QuizoPedia", 20, pageHeight - 20, { align: "left" });
    doc.text("Signed by: Vivek Sharma", pageWidth - 20, pageHeight - 20, { align: "right" });

    // Save
    doc.save(`Certificate_${userName}.pdf`);
  };

  if (loading) return <Loading />;

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
                        className="btn btn-danger btn-sm me-1"
                        onClick={() => handleDelete(attempt.docId)}
                      >
                        Delete
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          downloadCertificate(
                            attempt.studentName,
                            attempt.studentEnroll,
                            attempt.score,
                            attempt.correct + attempt.wrong + attempt.skipped
                          )
                        }
                      >
                        Download Certificate
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
