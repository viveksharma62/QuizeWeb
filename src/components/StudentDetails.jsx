// src/components/StudentDetails.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Collapse, Spinner, Modal, Form } from "react-bootstrap";
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
        const usersSnap = await getDocs(collection(db, "users"));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const questionsSnap = await getDocs(collection(db, "questions"));
        setQuestions(questionsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        const contentsSnap = await getDocs(collection(db, "features"));
        setContents(contentsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

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

  const handleDelete = async (collectionName, id, setter) => {
    if (window.confirm("Are you sure?")) {
      await deleteDoc(doc(db, collectionName, id));
      setter(prev => prev.filter(item => item.id !== id));
    }
  };

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
      <h1 className="text-center fw-bold mb-4 text-primary">Admin Dashboard</h1>

      {/* Summary Boxes */}
      <Row className="mb-4 text-center">
        <Col md={3} className="mb-2">
          <Card bg="info" text="white" className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h2>{users.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card bg="warning" text="white" className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total Questions</Card.Title>
              <h2>{questions.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card bg="secondary" text="white" className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total Study Material</Card.Title>
              <h2>{contents.length}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card bg="success" text="white" className="p-3 shadow-sm">
            <Card.Body>
              <Card.Title>Total Quiz Attempts</Card.Title>
              <h2>{quizHistory.length}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Users Table */}
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

        {/* Questions Table */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="warning" onClick={() => setShowQuestions(!showQuestions)}>
            Questions ({questions.length})
          </Button>
          <Collapse in={showQuestions}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead>
                  <tr><th>Sr. No</th><th>Question</th><th>Category</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {questions.map((q, idx) => (
                    <QuestionRow key={q.id} q={q} idx={idx} setQuestions={setQuestions} handleDelete={handleDelete} />
                  ))}
                </tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>

        {/* Study Material Table */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="secondary" onClick={() => setShowContent(!showContent)}>
            Study Material ({contents.length})
          </Button>
          <Collapse in={showContent}>
            <Card className="p-3 mb-4 shadow-sm">
              <Table striped bordered hover responsive>
                <thead>
                  <tr><th>Sr. No</th><th>Title</th><th>Category</th><th>Content</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {contents.map((c, idx) => (
                    <ContentRow key={c.id} c={c} idx={idx} setContents={setContents} handleDelete={handleDelete} />
                  ))}
                </tbody>
              </Table>
            </Card>
          </Collapse>
        </Col>

        {/* Quiz History Table */}
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

// ===== QuestionRow with Modal =====
const QuestionRow = ({ q, idx, setQuestions, handleDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editQuestion, setEditQuestion] = useState(q.q);
  const [editOptions, setEditOptions] = useState(q.options || ["", "", "", ""]);
  const [editAnswer, setEditAnswer] = useState(q.answer || "");

  const handleUpdate = async () => {
    const questionRef = doc(db, "questions", q.id);
    await updateDoc(questionRef, { q: editQuestion, options: editOptions, answer: editAnswer });
    setQuestions(prev => prev.map(item => item.id === q.id ? { ...item, q: editQuestion, options: editOptions, answer: editAnswer } : item));
    setShowModal(false);
  };

  return (
    <>
      <tr>
        <td>{idx + 1}</td>
        <td>{q.q}</td>
        <td>{q.cat || "General"}</td>
        <td className="d-flex gap-2">
          <Button size="sm" variant="danger" onClick={() => handleDelete("questions", q.id, setQuestions)}>Delete</Button>
          <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>Edit</Button>
        </td>
      </tr>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Question</Form.Label>
              <Form.Control type="text" value={editQuestion} onChange={e => setEditQuestion(e.target.value)} />
            </Form.Group>
            {editOptions.map((opt, i) => (
              <Form.Group key={i} className="mb-2">
                <Form.Label>Option {i + 1}</Form.Label>
                <Form.Control type="text" value={opt} onChange={e => {
                  const newOpts = [...editOptions]; newOpts[i] = e.target.value; setEditOptions(newOpts);
                }} />
              </Form.Group>
            ))}
            <Form.Group className="mb-2">
              <Form.Label>Answer</Form.Label>
              <Form.Control type="text" value={editAnswer} onChange={e => setEditAnswer(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// ===== ContentRow with Modal =====
const ContentRow = ({ c, idx, setContents, handleDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState(c.title);
  const [editCategory, setEditCategory] = useState(c.category || "");
  const [editContent, setEditContent] = useState(c.content || "");

  const handleUpdate = async () => {
    const contentRef = doc(db, "features", c.id);
    await updateDoc(contentRef, { title: editTitle, category: editCategory, content: editContent });
    setContents(prev => prev.map(item => item.id === c.id ? { ...item, title: editTitle, category: editCategory, content: editContent } : item));
    setShowModal(false);
  };

  return (
    <>
      <tr>
        <td>{idx + 1}</td>
        <td>{c.title}</td>
        <td>{c.category || "General"}</td>
        <td>{c.content || ""}</td>
        <td className="d-flex gap-2">
          <Button size="sm" variant="danger" onClick={() => handleDelete("features", c.id, setContents)}>Delete</Button>
          <Button size="sm" variant="primary" onClick={() => setShowModal(true)}>Edit</Button>
        </td>
      </tr>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Study Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={editCategory} onChange={e => setEditCategory(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" rows={3} value={editContent} onChange={e => setEditContent(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="success" onClick={handleUpdate}>Update</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
