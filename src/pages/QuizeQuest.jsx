import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../db/firebase";
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";
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
  const [warningCount, setWarningCount] = useState(0);
  const timerRef = useRef(null);

  const shuffle = (arr) => {
    let a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

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

  const fetchQuestions = async () => {
    const snap = await getDocs(collection(db, "questions"));
    const docs = snap.docs.map(d => {
      const data = d.data();
      return {
        id: data.id ?? d.id,
        cat: data.cat ?? "General",
        q: data.q ?? "",
        options: Array.isArray(data.options) ? data.options : [],
        a: typeof data.a === "number" ? data.a : parseInt(data.a || "0", 10)
      };
    });
    setAllQuestions(docs);
  };

  useEffect(() => { fetchUserInfo(); fetchQuestions(); }, []);

  const getCategories = () => ["all", ...Array.from(new Set(allQuestions.map(q => q.cat || "General")))];

  useEffect(() => {
    if (!quizStarted) return;
    const filtered = allQuestions.filter(q => category === "all" ? true : q.cat === category);
    const ord = shuffle(filtered.map((_, i) => i));
    setPool(filtered); setOrder(ord); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setSkipped(0);
    setSelected(null); setUserAnswers([]); setQuizEnded(false); setTimeLeft(60); setWarningCount(0);
    if (mode === "timed") startTimer(); else stopTimer();
  }, [category, mode, quizStarted, allQuestions]);

  useEffect(() => {
    if (!quizStarted || mode !== "timed" || quizEnded) return;
    if (timeLeft <= 0) { handleNext(true); return; }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, quizStarted, mode, quizEnded]);

  const startTimer = () => setTimeLeft(60);
  const stopTimer = () => clearTimeout(timerRef.current);
  const handleSelect = i => setSelected(i);

  const handleNext = (skip=false, goTo=null) => {
    stopTimer();
    const q = pool[order[idx]];
    const ua = { id: q?.id, chosen: skip ? null : selected, correct: q?.a };
    const newUserAnswers = [...userAnswers];
    newUserAnswers[idx] = ua;

    let newScore = score, newCorrect = correct, newWrong = wrong, newSkipped = skipped;
    if (skip || selected===null) newSkipped++;
    else if (selected===q.a) newScore++, newCorrect++;
    else newWrong++;

    setUserAnswers(newUserAnswers); setScore(newScore); setCorrect(newCorrect); setWrong(newWrong); setSkipped(newSkipped);
    setSelected(null);

    if (goTo !== null) setIdx(goTo);
    else if (idx + 1 >= pool.length) handleEnd();
    else setIdx(idx+1);
    setTimeLeft(60); if (mode==="timed") startTimer();
  };

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
        createdAt: serverTimestamp()
      });
    } catch (err) { console.error("Error saving history:", err); }
  };

  const handleEnd = async () => {
    stopTimer();
    setQuizEnded(true); setQuizStarted(false);
    await saveHistory();
  };

  const handleRetry = () => {
    setQuizStarted(true); setQuizEnded(false); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setSkipped(0);
    setSelected(null); setUserAnswers([]); setTimeLeft(60); setWarningCount(0); if (mode==="timed") startTimer();
  };

  const downloadCertificate = (userName, userEnroll, score, total) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const primaryColor = "#1976d2"; 
    const secondaryColor = "#444";
    doc.setDrawColor(primaryColor);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    doc.setFontSize(32); doc.setTextColor(primaryColor);
    doc.text("Certificate of Achievement", pageWidth / 2, 40, { align: "center" });
    doc.setFontSize(18); doc.setTextColor(255,140,0);
    doc.text("Awarded By: QuizoPedia", pageWidth/2, 60, {align:"center"});
    doc.setFontSize(20); doc.setTextColor("#000");
    doc.text("This certificate is proudly presented to", pageWidth/2, 80, {align:"center"});
    doc.setFontSize(26); doc.setTextColor(primaryColor);
    doc.text(userName, pageWidth/2, 100, {align:"center"});
    doc.setFontSize(16); doc.setTextColor(secondaryColor);
    doc.text(`Enrollment: ${userEnroll}`, pageWidth/2, 115, {align:"center"});
    const percentage = ((score / total) * 100).toFixed(2);
    doc.text(`Score: ${score} / ${total}`, pageWidth/2, 130, {align:"center"});
    doc.text(`Percentage: ${percentage}%`, pageWidth/2, 145, {align:"center"});
    const now = new Date();
    doc.setFontSize(14);
    doc.text(`Date: ${now.toLocaleDateString()}   Time: ${now.toLocaleTimeString()}`, pageWidth/2, 165, {align:"center"});
    doc.setFontSize(12); doc.setTextColor(secondaryColor);
    doc.text("© QuizoPedia", 20, pageHeight-20, {align:"left"});
    doc.text("Signed by: Vivek Sharma", pageWidth-20, pageHeight-20, {align:"right"});
    doc.save(`Certificate_${userName}.pdf`);
  };

  const getCircleColor = (i) => {
    const ans = userAnswers[i];
    if (!ans) return "bg-secondary";
    if (ans.chosen === null) return "bg-primary";
    if (ans.chosen === ans.correct) return "bg-success";
    return "bg-danger";
  };

  const q = pool[order[idx]];

  const startFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        if (warningCount < 2) alert(`Warning #${warningCount+1}: Do not switch tabs!`);
        setWarningCount(prev => prev + 1);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [warningCount]);

  useEffect(() => { if (warningCount >= 3) handleEnd(); }, [warningCount]);

  useEffect(() => {
    const block = (e) => e.preventDefault();
    document.addEventListener("copy", block);
    document.addEventListener("contextmenu", block);
    document.addEventListener("selectstart", block);
    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("selectstart", block);
    };
  }, []);

  return (
    <div className="container my-5">
      {!quizStarted && !quizEnded && (
        <div className="card shadow-lg p-5 scale-up-center">
          <h2 className="mb-3 text-center text-3xl font-bold animate-bounce">Start Your Quiz</h2>
          <div className="mb-3">
            <label className="form-label">Select Category</label>
            <select className="form-select transition-all duration-300 hover:scale-105" value={category} onChange={e=>setCategory(e.target.value)}>
              {getCategories().map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Select Mode</label>
            <select className="form-select transition-all duration-300 hover:scale-105" value={mode} onChange={e=>setMode(e.target.value)}>
              <option value="practice">Practice</option>
              <option value="timed">Timed</option>
            </select>
          </div>
          <div className="text-center">
            <button className="btn btn-success btn-lg mt-3 animate-pulse" onClick={() => { setQuizStarted(true); startFullscreen(); }}>Start Quiz</button>
          </div>
        </div>
      )}

      {quizStarted && q && (
        <div className="row fade-in">
          <div className="col-lg-8">
            <div className="card shadow-sm p-4 mb-3 hover:shadow-lg transition-shadow duration-300">
              <h5 className="fw-bold">Question {idx+1} / {pool.length}</h5>
              <p className="fs-5">{q.q}</p>
              {q.options.map((opt, i) => (
                <button key={i} className={`btn mb-2 w-100 text-start transition-all duration-300 hover:scale-105 ${selected===i ? "btn-primary" : "btn-outline-primary"} text-truncate`} onClick={()=>handleSelect(i)}>
                  {opt}
                </button>
              ))}
              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-secondary hover:scale-105 transition-transform" onClick={()=>handleNext(true)}>Skip</button>
                <button className="btn btn-primary hover:scale-105 transition-transform" onClick={()=>handleNext(false)}>Next</button>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm p-3">
              <h5 className="text-center mb-3">Timer: {timeLeft}s</h5>
              <div className="d-flex flex-wrap justify-content-center">
                {pool.map((_, i) => (
                  <div key={i} className={`rounded-circle text-white d-flex justify-content-center align-items-center me-2 mb-2 ${getCircleColor(i)} hover:scale-110 transition-transform`} style={{width:"40px", height:"40px", cursor:"pointer"}} onClick={()=>setIdx(i)}>
                    {i+1}
                  </div>
                ))}
              </div>
              <button className="btn btn-success w-100 mt-3 animate-bounce" onClick={handleEnd}>Submit Quiz</button>
            </div>
          </div>
        </div>
      )}

      {quizEnded && (
        <div className="card shadow-lg p-5 text-center scale-up-center">
          <h2 className="mb-3 text-success animate-bounce">Quiz Completed!</h2>
          <p className="fs-5">Student: <strong>{userName}</strong> | Enrollment: <strong>{userEnroll}</strong></p>
          <p className="fs-5">Score: <strong>{score} / {pool.length}</strong></p>
          <p className="fs-6">Correct: <strong>{correct}</strong> | Wrong: <strong>{wrong}</strong> | Skipped: <strong>{skipped}</strong></p>
          <div className="mt-4">
            <button className="btn btn-success btn-lg m-2 animate-pulse" onClick={handleRetry}>Retry Quiz</button>
            <button className="btn btn-warning btn-lg m-2 animate-pulse" onClick={() => downloadCertificate(userName, userEnroll, score, pool.length)}>Download Certificate</button>
          </div>
        </div>
      )}

      <style>{`
        .scale-up-center { animation: scale-up-center 0.5s ease-in-out both; }
        @keyframes scale-up-center { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .fade-in { animation: fade-in 0.5s ease-in-out both; }
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Quize;
