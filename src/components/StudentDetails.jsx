// src/components/StudentDetails.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table, Collapse, Spinner } from "react-bootstrap";
import { db } from "../db/firebase"; // tumhara firebase config
import { collection, getDocs } from "firebase/firestore";

const StudentDetails = () => {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [contents, setContents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);

  // Collapse state
  const [showUsers, setShowUsers] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showQuizHistory, setShowQuizHistory] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalQuestions: 0,
    addedQuestions: 0,
    pendingQuestions: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // USERS
        const usersSnap = await getDocs(collection(db, "users"));
        const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        // QUESTIONS
        const questionsSnap = await getDocs(collection(db, "quizQuestions"));
        const questionsDataRaw = questionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Category wise count
        const categoryCount = {};
        questionsDataRaw.forEach(q => {
          if (q.category) {
            categoryCount[q.category] = (categoryCount[q.category] || 0) + 1;
          }
        });
        const questionsData = Object.keys(categoryCount).map(cat => ({
          category: cat,
          total: categoryCount[cat],
        }));
        setQuestions(questionsData);

        const totalQ = questionsDataRaw.length;
        const addedQ = questionsDataRaw.filter(q => q.added).length;
        const pendingQ = totalQ - addedQ;
        setStats({ totalQuestions: totalQ, addedQuestions: addedQ, pendingQuestions: pendingQ });

        // STUDY CONTENT
        const contentsSnap = await getDocs(collection(db, "studyContent"));
        const contentsDataRaw = contentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Category wise count
        const contentCount = {};
        contentsDataRaw.forEach(c => {
          if (c.category) {
            contentCount[c.category] = (contentCount[c.category] || 0) + 1;
          }
        });
        const contentsData = Object.keys(contentCount).map(cat => ({
          category: cat,
          total: contentCount[cat],
        }));
        setContents(contentsData);

        // MESSAGES (from contact collection)
        const messagesSnap = await getDocs(collection(db, "contact"));
        const messagesData = messagesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(messagesData);

        // QUIZ HISTORY
        const quizSnap = await getDocs(collection(db, "quizHistory"));
        const quizData = quizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuizHistory(quizData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center my-5"><Spinner animation="border" /> Loading...</div>;

  return (
    <Container className="my-5">
      <h1 className="text-center fw-bold mb-5 text-primary">Admin Dashboard - Student Details</h1>

      {/* Stats Cards */}
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="text-center shadow-lg border-0 rounded-4 bg-primary text-white p-4">
            <h4>Total Questions</h4>
            <h2>{stats.totalQuestions}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-lg border-0 rounded-4 bg-success text-white p-4">
            <h4>Added Questions</h4>
            <h2>{stats.addedQuestions}</h2>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center shadow-lg border-0 rounded-4 bg-danger text-white p-4">
            <h4>Pending Questions</h4>
            <h2>{stats.pendingQuestions}</h2>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">

        {/* Users */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="info" onClick={() => setShowUsers(!showUsers)}>
            Users ({users.length})
          </Button>
          <Collapse in={showUsers}>
            <div>
              <Card className="p-3 shadow-sm mb-4">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Enrollment</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, idx) => (
                      <tr key={idx}>
                        <td>{user.name}</td>
                        <td>{user.enroll}</td>
                        <td>{user.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Collapse>
        </Col>

        {/* Questions Category-wise */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="warning" onClick={() => setShowQuestions(!showQuestions)}>
            Questions Category-wise
          </Button>
          <Collapse in={showQuestions}>
            <div>
              <Card className="p-3 shadow-sm mb-4">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Questions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((q, idx) => (
                      <tr key={idx}>
                        <td>{q.category}</td>
                        <td>{q.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Collapse>
        </Col>

        {/* Study Material */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="secondary" onClick={() => setShowContent(!showContent)}>
            Study Material Added
          </Button>
          <Collapse in={showContent}>
            <div>
              <Card className="p-3 shadow-sm mb-4">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Total Materials</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contents.map((c, idx) => (
                      <tr key={idx}>
                        <td>{c.category}</td>
                        <td>{c.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Collapse>
        </Col>

        {/* Messages */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="dark" onClick={() => setShowMessages(!showMessages)}>
            Messages Received
          </Button>
          <Collapse in={showMessages}>
            <div>
              <Card className="p-3 shadow-sm mb-4">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>From</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((m, idx) => (
                      <tr key={idx}>
                        <td>{m.from}</td>
                        <td>{m.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Collapse>
        </Col>

        {/* Quiz History */}
        <Col md={12}>
          <Button className="w-100 mb-2" variant="success" onClick={() => setShowQuizHistory(!showQuizHistory)}>
            Quiz History
          </Button>
          <Collapse in={showQuizHistory}>
            <div>
              <Card className="p-3 shadow-sm mb-4">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Enroll</th>
                      <th>Quiz</th>
                      <th>Correct</th>
                      <th>Wrong</th>
                      <th>Skipped</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizHistory.map((q, idx) => {
                      const total = (q.correct || 0) + (q.wrong || 0) + (q.skipped || 0);
                      const percent = total > 0 ? ((q.correct / total) * 100).toFixed(2) : 0;
                      return (
                        <tr key={idx}>
                          <td>{q.name}</td>
                          <td>{q.enroll}</td>
                          <td>{q.quiz}</td>
                          <td>{q.correct}</td>
                          <td>{q.wrong}</td>
                          <td>{q.skipped}</td>
                          <td>{percent}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Card>
            </div>
          </Collapse>
        </Col>

      </Row>
    </Container>
  );
};

export default StudentDetails;
