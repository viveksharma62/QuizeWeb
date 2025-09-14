import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../db/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { jsPDF } from "jspdf";

const Quize = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEnroll, setUserEnroll] = useState("");
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState("practice");
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [pool, setPool] = useState([]);
  const [order, setOrder] = useState([]);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);

  // shuffle helper
  const shuffle = (arr) => {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // fetch user info
  const fetchUserInfo = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserName(data.name || "Unknown");
        setUserEnroll(data.enroll || "N/A");
      }
    }
  };

  // fetch all questions
  const fetchQuestions = async () => {
    const snap = await getDocs(collection(db, "questions"));
    const docs = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: data.id ?? d.id,
        cat: data.cat ?? "General",
        q: data.q ?? "",
        options: Array.isArray(data.options) ? data.options : [],
        a:
          typeof data.a === "number"
            ? data.a
            : parseInt(data.a || "0", 10),
      };
    });
    setAllQuestions(docs);
  };

  useEffect(() => {
    fetchUserInfo();
    fetchQuestions();
  }, []);

  const getCategories = () => [
    "all",
    ...Array.from(new Set(allQuestions.map((q) => q.cat || "General"))),
  ];

  useEffect(() => {
    if (!quizStarted) return;
    const filtered = allQuestions.filter((q) =>
      category === "all" ? true : q.cat === category
    );
    const ord = shuffle(filtered.map((_, i) => i));
    setPool(filtered);
    setOrder(ord);
    setIdx(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setSkipped(0);
    setSelected(null);
    setUserAnswers([]);
    setQuizEnded(false);
    setTimeLeft(60);
    if (mode === "timed") startTimer();
    else stopTimer();
  }, [category, mode, quizStarted, allQuestions]);

  useEffect(() => {
    if (!quizStarted || mode !== "timed" || quizEnded) return;
    if (timeLeft <= 0) {
      handleNext(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, quizStarted, mode, quizEnded]);

  const startTimer = () => setTimeLeft(60);
  const stopTimer = () => clearTimeout(timerRef.current);

  const handleSelect = (i) => setSelected(i);

  const handleNext = (skip = false, goTo = null) => {
    stopTimer();
    const q = pool[order[idx]];
    const ua = { id: q?.id, chosen: skip ? null : selected, correct: q?.a };
    const newUserAnswers = [...userAnswers];
    newUserAnswers[idx] = ua;

    let newScore = score,
      newCorrect = correct,
      newWrong = wrong,
      newSkipped = skipped;
    if (skip || selected === null) newSkipped++;
    else if (selected === q.a) (newScore++, newCorrect++);
    else newWrong++;

    setUserAnswers(newUserAnswers);
    setScore(newScore);
    setCorrect(newCorrect);
    setWrong(newWrong);
    setSkipped(newSkipped);
    setSelected(null);

    if (goTo !== null) setIdx(goTo);
    else if (idx + 1 >= pool.length) handleEnd();
    else setIdx(idx + 1);
    setTimeLeft(60);
    if (mode === "timed") startTimer();
  };

  // Save history in Firebase
  const saveHistory = async () => {
    if (!auth.currentUser) return;
    try {
      await addDoc(collection(db, "quizHistory"), {
        uid: auth.currentUser.uid,
        name: userName,
        enroll: userEnroll,
        category,
        mode,
        score,
        correct,
        wrong,
        skipped,
        totalQuestions: pool.length,
        answers: userAnswers,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error saving history:", err);
    }
  };

  const handleEnd = async () => {
    stopTimer();
    setQuizEnded(true);
    setQuizStarted(false);
    await saveHistory();
  };

  const handleRetry = () => {
    setQuizStarted(true);
    setQuizEnded(false);
    setIdx(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setSkipped(0);
    setSelected(null);
    setUserAnswers([]);
    setTimeLeft(60);
    if (mode === "timed") startTimer();
  };

  const downloadCertificate = async () => {
    if (!auth.currentUser) {
      alert("Please login to download certificate.");
      return;
    }

    try {
      const uid = auth.currentUser.uid;

      // latest attempt
      const q = query(
        collection(db, "quizHistory"),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);

      if (snap.empty) {
        alert("No quiz attempts found for your account.");
        return;
      }

      const attemptDoc = snap.docs[0];
      const attempt = attemptDoc.data();

      // user profile
      const userSnap = await getDoc(doc(db, "users", uid));
      const user = userSnap.exists() ? userSnap.data() : {};

      const name = user.name || "Unknown Student";
      const enroll = user.enroll || user.enrollment || "N/A";

      const sc = Number(attempt.score ?? attempt.correct ?? 0);
      const totalQ =
        Number(
          attempt.totalQuestions ??
            attempt.total ??
            (attempt.pool ? attempt.pool.length : undefined) ??
            (attempt.questions ? attempt.questions.length : undefined)
        ) || 0;

      const percentage =
        totalQ > 0 ? ((sc / totalQ) * 100).toFixed(2) : "0.00";

      let createdAt = new Date();
      if (attempt.createdAt?.toDate) {
        createdAt = attempt.createdAt.toDate();
      } else if (attempt.createdAt) {
        createdAt = new Date(attempt.createdAt);
      }

      const dateStr = createdAt.toLocaleDateString();
      const timeStr = createdAt.toLocaleTimeString();

      // jsPDF
      const docPDF = new jsPDF({ orientation: "landscape" });
      const W = docPDF.internal.pageSize.getWidth();
      const H = docPDF.internal.pageSize.getHeight();

      docPDF.setFillColor(245, 248, 255);
      docPDF.rect(0, 0, W, H, "F");

      docPDF.setDrawColor(0, 102, 204);
      docPDF.setLineWidth(2);
      docPDF.rect(12, 12, W - 24, H - 24);

      docPDF.setFillColor(0, 102, 204);
      docPDF.rect(12, 18, W - 24, 28, "F");

      docPDF.setFont("helvetica", "bold");
      docPDF.setTextColor(255, 255, 255);
      docPDF.setFontSize(20);
      docPDF.text("Certificate of Achievement", W / 2, 36, {
        align: "center",
      });

      docPDF.setFontSize(12);
      docPDF.setFont("helvetica", "normal");
      docPDF.setTextColor(50, 50, 50);
      docPDF.text("This certificate is proudly awarded by", W / 2, 60, {
        align: "center",
      });

      docPDF.setFont("helvetica", "bold");
      docPDF.setFontSize(22);
      docPDF.setTextColor(255, 102, 0);
      docPDF.text("QuizoPedia", W / 2, 76, { align: "center" });

      docPDF.setFontSize(18);
      docPDF.setTextColor(0, 0, 0);
      docPDF.text(`Awarded to: ${name}`, W / 2, 100, { align: "center" });

      docPDF.setFontSize(14);
      docPDF.text(`Enrollment: ${enroll}`, W / 2, 118, { align: "center" });
      docPDF.text(`Score: ${sc} / ${totalQ}`, W / 2, 134, {
        align: "center",
      });
      docPDF.text(`Percentage: ${percentage}%`, W / 2, 150, {
        align: "center",
      });

      docPDF.setFontSize(12);
      docPDF.setTextColor(80, 80, 80);
      docPDF.text(`Date: ${dateStr}   |   Time: ${timeStr}`, W / 2, 168, {
        align: "center",
      });

      docPDF.setFontSize(12);
      docPDF.setTextColor(100, 100, 100);
      docPDF.text("Signed by:", W - 80, H - 40, { align: "left" });
      docPDF.setFont("helvetica", "bold");
      docPDF.text("Vivek Sharma", W - 80, H - 25, { align: "left" });

      docPDF.setFont("helvetica", "normal");
      docPDF.setFontSize(10);
      docPDF.text("© QuizoPedia", 18, H - 18, { align: "left" });

      const safeName = name.replace(/\s+/g, "_");
      docPDF.save(`Certificate_${safeName}.pdf`);
    } catch (err) {
      console.error("Certificate error:", err);
      alert("Error creating certificate. Check console for details.");
    }
  };

  const getCircleColor = (i) => {
    const ans = userAnswers[i];
    if (!ans) return "bg-secondary";
    if (ans.chosen === null) return "bg-primary";
    if (ans.chosen === ans.correct) return "bg-success";
    return "bg-danger";
  };

  const q = pool[order[idx]];

  return (
    <div className="container my-5">
      {!quizStarted && !quizEnded && (
        <div className="card shadow-lg p-5">
          <h2 className="mb-3 text-center">Start Your Quiz</h2>
          <div className="mb-3">
            <label className="form-label">Select Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {getCategories().map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Select Mode</label>
            <select
              className="form-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="practice">Practice</option>
              <option value="timed">Timed</option>
            </select>
          </div>
          <div className="text-center">
            <button
              className="btn btn-success btn-lg mt-3"
              onClick={() => setQuizStarted(true)}
            >
              Start Quiz
            </button>
          </div>
        </div>
      )}

      {quizStarted && q && (
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 mb-3">
              <h5 className="fw-bold">
                Question {idx + 1} / {pool.length}
              </h5>
              <p className="fs-5">{q.q}</p>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className={`btn mb-2 w-100 text-start ${
                    selected === i ? "btn-primary" : "btn-outline-primary"
                  } text-truncate`}
                  onClick={() => handleSelect(i)}
                >
                  {opt}
                </button>
              ))}
              <div className="d-flex justify-content-between mt-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleNext(true)}
                >
                  Skip
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleNext(false)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center mb-3">Timer: {timeLeft}s</h5>
              <div className="d-flex flex-wrap justify-content-center">
                {pool.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-circle text-white d-flex justify-content-center align-items-center me-2 mb-2 ${getCircleColor(
                      i
                    )}`}
                    style={{
                      width: "40px",
                      height: "40px",
                      cursor: "pointer",
                    }}
                    onClick={() => setIdx(i)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <button
                className="btn btn-success w-100 mt-3"
                onClick={handleEnd}
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {quizEnded && (
        <div className="card shadow-lg p-5 text-center">
          <h2 className="mb-3 text-success">Quiz Completed!</h2>
          <p className="fs-5">
            Student: <strong>{userName}</strong> | Enrollment:{" "}
            <strong>{userEnroll}</strong>
          </p>
          <p className="fs-5">
            Score: <strong>{score} / {pool.length}</strong>
          </p>
          <p className="fs-6">
            Correct: <strong>{correct}</strong> | Wrong:{" "}
            <strong>{wrong}</strong> | Skipped: <strong>{skipped}</strong>
          </p>
          <div className="mt-4">
            <button
              className="btn btn-success btn-lg m-2"
              onClick={handleRetry}
            >
              Retry Quiz
            </button>
            <button
              className="btn btn-warning btn-lg m-2"
              onClick={downloadCertificate}
            >
              Download Certificate PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quize;
