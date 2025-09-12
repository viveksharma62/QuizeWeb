import React, { useState } from "react";
import { db } from "../db/firebase.js";
import { collection, addDoc } from "firebase/firestore";

const AddQuest = () => {
  const [cat, setCat] = useState("");
  const [qText, setQText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [status, setStatus] = useState("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cat || !qText || options.some(o => o.trim() === "")) {
      alert("Fill all fields!");
      return;
    }

    try {
      await addDoc(collection(db, "questions"), {
        cat,
        q: qText,
        options,
        a: parseInt(correct, 10)
      });
      setStatus("Question added successfully!");
      setQText("");
      setOptions(["", "", "", ""]);
      setCorrect(0);
      setCat("");
    } catch (err) {
      console.error("Error adding question: ", err);
      setStatus("Error adding question!");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4 text-center">Admin - Add Question</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input 
              type="text" 
              className="form-control" 
              value={cat} 
              onChange={(e) => setCat(e.target.value)} 
              placeholder="e.g. DWDM, ML, React" 
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Question</label>
            <textarea 
              className="form-control" 
              value={qText} 
              onChange={(e) => setQText(e.target.value)} 
              placeholder="Type your question here"
            />
          </div>

          {options.map((opt, i) => (
            <div className="mb-2" key={i}>
              <label className="form-label">Option {i + 1}</label>
              <input 
                type="text" 
                className="form-control" 
                value={opt} 
                onChange={(e) => handleOptionChange(i, e.target.value)} 
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Correct Option (0-3)</label>
            <input 
              type="number" 
              className="form-control" 
              value={correct} 
              onChange={(e) => setCorrect(e.target.value)} 
              min={0} 
              max={3} 
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Add Question</button>
        </form>

        {status && <p className="mt-3 text-center">{status}</p>}
      </div>
    </div>
  );
};

export default AddQuest;
