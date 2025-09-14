import React, { useEffect, useState } from "react";
import { db } from "../db/firebase";
import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { Container, Card, Button, Spinner, Form, Row, Col } from "react-bootstrap";

const ContactShow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      alert("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleReplyClick = (id) => {
    setReplyingId(id);
    setReplyText("");
  };

  const handleSaveReply = async (id) => {
    if (!replyText.trim()) {
      alert("Reply cannot be empty!");
      return;
    }
    try {
      const msgRef = doc(db, "contacts", id);
      await updateDoc(msgRef, {
        reply: replyText,
        replyAt: new Date(),
      });
      setReplyingId(null);
      alert("Reply saved successfully!");
    } catch (error) {
      console.error("Error saving reply:", error);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center fw-bold text-primary mb-4">📩 User Messages</h2>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center text-muted">No messages found!</p>
      ) : (
        <Row className="g-3">
          {messages.map((msg, index) => (
            <Col key={msg.id} md={6} lg={4}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>{msg.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{msg.email}</Card.Subtitle>
                  <Card.Text>{msg.message}</Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Submitted On: {msg.timestamp?.toDate().toLocaleString()}
                    </small>
                  </Card.Text>

                  {msg.reply ? (
                    <Card.Text className="mt-2 p-2 bg-light rounded">
                      <strong>Reply:</strong> {msg.reply}
                      <br />
                      <small className="text-muted">
                        {msg.replyAt
                          ? new Date(msg.replyAt.seconds * 1000).toLocaleString()
                          : ""}
                      </small>
                    </Card.Text>
                  ) : replyingId === msg.id ? (
                    <div className="mt-2">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="mb-2"
                      />
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => handleSaveReply(msg.id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setReplyingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleReplyClick(msg.id)}
                      className="mt-2"
                    >
                      Reply
                    </Button>
                  )}
                </Card.Body>
                <Card.Footer className="text-end">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ContactShow;
