// src/components/StudentDetails.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Collapse, Spinner } from "react-bootstrap";
import { db } from "../db/firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

const StudentDetails = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contents, setContents] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);

  const [showUsers, setShowUsers] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ===== USERS =====
        const usersSnap = await getDocs(collection(db, "users"));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // ===== QUESTIONS =====
        const questionsSnap = await getDocs(collection(db, "questions"));
        setQuestions(questionsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // ===== STUDY CONTENT =====
        const contentsSnap = await getDocs(collection(db, "features"));
        setContents(contentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // ===== QUIZ HISTORY =====
        const quizSnap = await getDocs(collection(db, "quizHistory"));
        setQuizHistory(quizSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ===== DELETE HANDLERS =====
  const handleDelete = async (collectionName, id, setter) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, collectionName, id));
      setter(prev => prev.filter(item => item.id !== id));
    }
  };

  // ===== TOGGLE DISABLE / ENABLE USER =====
  const toggleDisable = async (userId) => {
    const userRef = doc(db, "users", userId);
    const user = users.find(u => u.id === userId);
    if (!user) return;
    const newStatus = !user.disabled;
    await updateDoc(userRef, { disabled: newStatus });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, disabled: newStatus } : u));
  };

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /> Loading...</div>;

  return (
    <Container className="my-5">
      <h1 className="text-center fw-bold mb-5 text-primary">Admin Dashboard</h1>

      <Row className="g-4">
        {/* Users */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="info" onClick={() => setShowUsers(!showUsers)}>
            Users ({users.length})
          </Button>
          <Collapse in={showUsers}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Enroll</th>
                    <th>Email</th>
                    <th>Disabled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.enroll}</td>
                      <td>{u.email}</td>
                      <td>{u.disabled ? "Yes" : "No"}</td>
                      <td className="d-flex gap-2">
                        <Button size="sm" variant="danger" onClick={() => handleDelete("users", u.id, setUsers)}>Delete</Button>
                        <Button size="sm" variant={u.disabled ? "success" : "secondary"} onClick={() => toggleDisable(u.id)}>
                          {u.disabled ? "Enable" : "Disable"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>

        {/* Questions */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="warning" onClick={() => setShowQuestions(!showQuestions)}>
            Questions ({questions.length})
          </Button>
          <Collapse in={showQuestions}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead><tr><th>Sr. No</th><th>Question</th><th>Category</th><th>Action</th></tr></thead>
                <tbody>{questions.map((q, idx) => (
                  <tr key={q.id}>
                    <td>{idx + 1}</td>
                    <td>{q.q}</td>
                    <td>{q.cat || "General"}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete("questions", q.id, setQuestions)}>Delete</Button>
                    </td>
                  </tr>
                ))}</tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>

        {/* Study Material */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="secondary" onClick={() => setShowContent(!showContent)}>
            Study Material ({contents.length})
          </Button>
          <Collapse in={showContent}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead><tr><th>Sr. No</th><th>Title</th><th>Action</th></tr></thead>
                <tbody>{contents.map((c, idx) => (
                  <tr key={c.id}>
                    <td>{idx + 1}</td>
                    <td>{c.title}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete("features", c.id, setContents)}>Delete</Button>
                    </td>
                  </tr>
                ))}</tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>

        {/* Quiz History */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="success" onClick={() => setShowQuizHistory(!showQuizHistory)}>
            Quiz History ({quizHistory.length})
          </Button>
          <Collapse in={showQuizHistory}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead>
                  <tr><th>Name</th><th>Enroll</th><th>Category</th><th>Score</th><th>Correct</th><th>Wrong</th><th>Skipped</th><th>Action</th></tr>
                </thead>
                <tbody>{quizHistory.map((q, idx) => (
                  <tr key={q.id}>
                    <td>{q.name}</td>
                    <td>{q.enroll}</td>
                    <td>{q.category}</td>
                    <td>{q.score}</td>
                    <td>{q.correct}</td>
                    <td>{q.wrong}</td>
                    <td>{q.skipped}</td>
                    <td>
                      <Button size="sm" variant="danger" onClick={() => handleDelete("quizHistory", q.id, setQuizHistory)}>Delete</Button>
                    </td>
                  </tr>
                ))}</tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDetails;
