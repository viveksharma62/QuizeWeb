import React, { useEffect, useState } from "react";
import { db } from "../db/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Container, Table, Spinner, Button, Form } from "react-bootstrap";

const ContactShow = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null); // kis message ko reply kar rahe hai
  const [replyText, setReplyText] = useState(""); // reply ka text

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const q = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Delete message
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setMessages(messages.filter((msg) => msg.id !== id));
      alert("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  // Start reply
  const handleReplyClick = (id) => {
    setReplyingId(id);
    setReplyText(""); // reset reply
  };

  // Save reply in Firebase
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
      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, reply: replyText, replyAt: new Date() } : msg
        )
      );
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
        <Table striped bordered hover responsive className="shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Submitted On</th>
              <th>Reply</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg, index) => (
              <tr key={msg.id}>
                <td>{index + 1}</td>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>{msg.timestamp?.toDate().toLocaleString()}</td>
                <td>
                  {msg.reply ? (
                    <div>
                      <strong>{msg.reply}</strong>
                      <br />
                      <small className="text-muted">
                        {msg.replyAt
                          ? new Date(msg.replyAt.seconds * 1000).toLocaleString()
                          : ""}
                      </small>
                    </div>
                  ) : replyingId === msg.id ? (
                    <div>
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
                    >
                      Reply
                    </Button>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(msg.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ContactShow;
