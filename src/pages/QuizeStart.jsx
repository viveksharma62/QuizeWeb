// src/components/QuizeStart.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../db/firebase"; // Firebase config + auth
import { collection, getDocs, query, where } from "firebase/firestore";
import Loading from "./Loading"; // Loading component
import { jsPDF } from "jspdf";

const QuizeStart = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!auth.currentUser) return;
        const q = query(
          collection(db, "quizHistory"),
          where("uid", "==", auth.currentUser.uid)
        );
        const snap = await getDocs(q);
        const allAttempts = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            docId: docSnap.id,
            studentName: data.name || "Unknown",
            studentEnroll: data.enroll || "N/A",
            quiz: data.category || "N/A",
            score: data.score || 0,
            correct: data.correct || 0,
            wrong: data.wrong || 0,
            skipped: data.skipped || 0,
            date: data.createdAt ? data.createdAt.toDate().toLocaleString() : "N/A",
          };
        });
        setHistory(allAttempts.reverse());
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const downloadCertificate = (userName, userEnroll, score, total) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor = "#1976d2";
    const secondaryColor = "#444";

    doc.setDrawColor(primaryColor);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setFontSize(32);
    doc.setTextColor(primaryColor);
    doc.text("Certificate of Achievement", pageWidth / 2, 40, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(255, 140, 0);
    doc.text("Awarded By: QuizoPedia", pageWidth / 2, 60, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor("#000");
    doc.text("This certificate is proudly presented to", pageWidth / 2, 80, { align: "center" });

    doc.setFontSize(26);
    doc.setTextColor(primaryColor);
    doc.text(userName, pageWidth / 2, 100, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(secondaryColor);
    doc.text(`Enrollment: ${userEnroll}`, pageWidth / 2, 115, { align: "center" });

    const percentage = ((score / total) * 100).toFixed(2);
    doc.text(`Score: ${score} / ${total}`, pageWidth / 2, 130, { align: "center" });
    doc.text(`Percentage: ${percentage}%`, pageWidth / 2, 145, { align: "center" });

    const now = new Date();
    doc.setFontSize(14);
    doc.text(`Date: ${now.toLocaleDateString()}   Time: ${now.toLocaleTimeString()}`, pageWidth / 2, 165, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(secondaryColor);
    doc.text("© QuizoPedia", 20, pageHeight - 20, { align: "left" });
    doc.text("Signed by: Vivek Sharma", pageWidth - 20, pageHeight - 20, { align: "right" });

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

        {history.length > 0 ? (
          <div className="text-start">
            <h3 className="mb-3">Your Quiz History:</h3>

            {/* Responsive table wrapper */}
            <div className="table-responsive shadow-sm rounded">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-dark">
                  <tr>
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
                  {history.map((attempt, index) => {
                    const total = (attempt.correct || 0) + (attempt.wrong || 0) + (attempt.skipped || 0);
                    const percent = total > 0 ? ((attempt.correct / total) * 100).toFixed(2) : 0;
                    return (
                      <tr key={index}>
                        <td>{attempt.quiz}</td>
                        <td>{attempt.score}</td>
                        <td>{attempt.correct}</td>
                        <td>{attempt.wrong}</td>
                        <td>{attempt.skipped}</td>
                        <td>{attempt.date}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              downloadCertificate(
                                attempt.studentName,
                                attempt.studentEnroll,
                                attempt.score,
                                total
                              )
                            }
                          >
                            Download Certificate
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-muted">No quiz attempts yet.</p>
        )}
      </div>
    </main>
  );
};

export default QuizeStart;
