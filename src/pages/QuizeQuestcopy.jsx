import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../db/firebase";
import { collection, getDocs, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { jsPDF } from "jspdf";

const QUESTIONS = [
  { id:1, cat:"DWDM", q:"A Data Warehouse is:", options:["OLTP system","Subject-oriented, integrated, time-variant, non-volatile collection of data","Operational database","Distributed file system"], a:1 },
];

function shuffle(arr) {
  let a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const getHighScore = () => parseInt(localStorage.getItem("mcq_high") || "0", 10);
const setHighScore = (val) => localStorage.setItem("mcq_high", val);

const Quize = () => {
  const [allQuestions, setAllQuestions] = useState(QUESTIONS);
  const [userName, setUserName] = useState("");
  const [userEnroll, setUserEnroll] = useState("");
  const [userInfoFilled, setUserInfoFilled] = useState(false);
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
  const [highScore, setHighScoreState] = useState(getHighScore());
  const [review, setReview] = useState([]);

  // Fetch questions from Firestore
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const snap = await getDocs(collection(db, "questions"));
        if (!snap.empty) {
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
        } else console.log("No questions in Firestore; using fallback.");
      } catch (err) {
        console.error("Error loading questions:", err);
      }
    };
    fetchQuestions();
  }, []);

  // Fetch logged-in user info from Firestore
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserName(data.name || "Unknown");
            setUserEnroll(data.enroll || data.stream || "N/A");
            setUserInfoFilled(true);
          }
        } catch (err) {
          console.error("Error fetching user info:", err);
        }
      }
    };
    fetchUserInfo();
  }, []);

  const getCategories = () => ["all", ...Array.from(new Set(allQuestions.map(q => q.cat || "General")))];
  
  useEffect(() => {
    if (!quizStarted) return;
    const filtered = allQuestions.filter(q => category === "all" ? true : q.cat === category);
    const ord = shuffle(filtered.map((_, i) => i));
    setPool(filtered); setOrder(ord); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setSkipped(0);
    setSelected(null); setUserAnswers([]); setQuizEnded(false); setReview([]); setTimeLeft(60);
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

  const goFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
  };

  const handleSelect = i => setSelected(i);

  const handleNext = (skip=false) => {
    stopTimer();
    const q = pool[order[idx]];
    const ua = { id: q?.id, chosen: skip ? null : selected, correct: q?.a };
    const newUserAnswers = [...userAnswers, ua];
    let newScore = score, newCorrect = correct, newWrong = wrong, newSkipped = skipped;

    if (skip || selected===null) newSkipped++;
    else if (selected===q.a) { newScore++; newCorrect++; }
    else newWrong++;

    setUserAnswers(newUserAnswers); setScore(newScore); setCorrect(newCorrect); setWrong(newWrong); setSkipped(newSkipped);

    setTimeout(() => {
      if (idx + 1 >= pool.length) handleEnd(newUserAnswers, newScore);
      else { setIdx(idx+1); setSelected(null); setTimeLeft(60); if (mode==="timed") startTimer(); }
    }, 400);
  };

  const addAttempt = async (quizName, score) => {
    if (auth.currentUser) {
      const userRef = doc(db, "quizHistory", auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          attempts: arrayUnion({
            quiz: quizName,
            score,
            date: new Date().toLocaleString(),
          }),
        });
      } catch (err) {
        await setDoc(userRef, {
          attempts: [{ quiz: quizName, score, date: new Date().toLocaleString() }]
        });
      }
    }
  };

  const handleEnd = async (finalAnswers=userAnswers, finalScore=score) => {
    stopTimer(); 
    setQuizEnded(true); 
    setQuizStarted(false);

    if (finalScore > highScore) { setHighScore(finalScore); setHighScoreState(finalScore); }
    setReview(finalAnswers);

    await addAttempt(category, finalScore);
  };

  const handleRetry = () => {
    setQuizStarted(true); setQuizEnded(false); setIdx(0); setScore(0); setCorrect(0); setWrong(0); setSkipped(0);
    setSelected(null); setUserAnswers([]); setReview([]); setTimeLeft(60); if (mode==="timed") startTimer(); else stopTimer();
  };

  const progress = pool.length ? (idx / pool.length)*100 : 0;
  const q = pool[order[idx]];

  const getOptionClass = i => {
    if (!q) return "btn btn-outline-primary mb-2 w-100 text-start";
    if (!quizEnded && selected===null) return "btn btn-outline-primary mb-2 w-100 text-start";
    if (quizEnded) return "btn btn-outline-secondary mb-2 w-100 text-start";
    if (selected===i && selected===q.a) return "btn btn-success mb-2 w-100 text-start";
    if (selected===i && selected!==q.a) return "btn btn-danger mb-2 w-100 text-start";
    if (i===q.a) return "btn btn-success mb-2 w-100 text-start";
    return "btn btn-outline-primary mb-2 w-100 text-start";
  };

  const downloadCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(30);
    doc.text("Certificate", doc.internal.pageSize.width/2, 50, { align:"center" });
    doc.setFontSize(18);
    doc.text(`Awarded to: ${userName}`, doc.internal.pageSize.width/2, 80, { align:"center" });
    doc.text(`Enrollment: ${userEnroll}`, doc.internal.pageSize.width/2, 100, { align:"center" });
    doc.text(`Score: ${score} / ${pool.length}`, doc.internal.pageSize.width/2, 120, { align:"center" });
    doc.save(`Certificate_${userName}.pdf`);
  };

  return (
    <div className="container my-5">
      {!quizStarted && !quizEnded && (
        <div className="card p-4">
          <h3>Select Category & Mode</h3>
          <select className="form-select my-2" value={category} onChange={e=>setCategory(e.target.value)}>
            {getCategories().map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="form-select my-2" value={mode} onChange={e=>setMode(e.target.value)}>
            <option value="practice">Practice</option>
            <option value="timed">Timed</option>
          </select>
          <button className="btn btn-success mt-2" onClick={()=>{goFullScreen(); setQuizStarted(true);}}>Start Quiz</button>
        </div>
      )}

      {quizStarted && q && (
        <div>
          <h5>Question {idx+1} / {pool.length}</h5>
          <p>{q.q}</p>
          {q.options.map((opt, i) => (
            <button key={i} className={getOptionClass(i)} onClick={() => handleSelect(i)}>
              {opt}
            </button>
          ))}
          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-secondary" onClick={()=>handleNext(true)}>Skip</button>
            <button className="btn btn-primary" onClick={()=>handleNext(false)}>Next</button>
          </div>
          {mode==="timed" && <p>Time Left: {timeLeft}s</p>}
          <div className="progress mt-2">
            <div className="progress-bar" role="progressbar" style={{width: `${progress}%`}}></div>
          </div>
        </div>
      )}

      {quizEnded && (
        <div className="card p-4">
          <h3>Quiz Completed!</h3>
          <p>Student: {userName} | Enrollment: {userEnroll}</p>
          <p>Score: {score} / {pool.length}</p>
          <p>Correct: {correct} | Wrong: {wrong} | Skipped: {skipped}</p>
          <button className="btn btn-success m-2" onClick={handleRetry}>Retry Quiz</button>
          <button className="btn btn-warning m-2" onClick={downloadCertificate}>Download Certificate PDF</button>
        </div>
      )}
    </div>
  );
};

export default Quize;
