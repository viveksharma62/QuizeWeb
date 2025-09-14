import React, { useState } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../db/firebase.js";

// ✅ Rich Text Editor
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const AddFeature = () => {
  const [formData, setFormData] = useState({
    youtubeUrl: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    image: "",
    exampleCode: "",
    outputType: "image", // default
    outputValue: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOutputTypeChange = (e) => {
    setFormData({ ...formData, outputType: e.target.value, outputValue: "" });
  };

  const getVideoId = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") return urlObj.pathname.slice(1);
      if (urlObj.hostname.includes("youtube.com"))
        return urlObj.searchParams.get("v");
    } catch {
      return null;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const newDocRef = doc(collection(db, "features"));
      await setDoc(newDocRef, {
        ...formData,
        id: newDocRef.id,
        createdAt: serverTimestamp(),
      });

      setMsg("✅ Feature added successfully!");
      setFormData({
        youtubeUrl: "",
        title: "",
        shortDescription: "",
        fullDescription: "",
        image: "",
        exampleCode: "",
        outputType: "image",
        outputValue: "",
        category: "",
      });
    } catch (error) {
      console.error("Error uploading feature:", error);
      setMsg("❌ Upload failed, try again!");
    }

    setLoading(false);
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
        {/* Header */}
        <div
          className="p-4 text-white"
          style={{ background: "linear-gradient(90deg,#28a745,#20c997)" }}
        >
          <h2 className="fw-bold text-center mb-0">➕ Add Feature</h2>
        </div>

        <div className="p-4 bg-light">
          <Form onSubmit={handleSubmit}>
            {/* YouTube Link */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">🎥 YouTube Video Link</Form.Label>
              <Form.Control
                type="text"
                placeholder="Paste YouTube video link"
                name="youtubeUrl"
                value={formData.youtubeUrl}
                onChange={handleChange}
              />
            </Form.Group>

            {/* YouTube Preview */}
            {formData.youtubeUrl && getVideoId(formData.youtubeUrl) && (
              <div className="mb-4 text-center">
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${getVideoId(
                    formData.youtubeUrl
                  )}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded shadow"
                ></iframe>
              </div>
            )}

            {/* Title */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📝 Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Short Description */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📖 Short Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Small intro for feature card"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* ✅ Full Description with Rich Text Editor */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📘 Full Description</Form.Label>
              <ReactQuill
                theme="snow"
                value={formData.fullDescription}
                onChange={(value) =>
                  setFormData({ ...formData, fullDescription: value })
                }
                placeholder="Write detailed content here..."
                style={{ background: "white", borderRadius: "8px" }}
              />
            </Form.Group>

            {/* Banner Image */}
            <Row className="mb-4">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-bold">🖼 Banner Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter banner image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col
                md={4}
                className="d-flex justify-content-center align-items-center"
              >
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="img-fluid rounded shadow-lg"
                    style={{ maxHeight: "120px", border: "3px solid #fff" }}
                  />
                ) : (
                  <div className="text-muted">Image Preview</div>
                )}
              </Col>
            </Row>

            {/* Example Code */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">💻 Example Code</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Write example code here..."
                name="exampleCode"
                value={formData.exampleCode}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Output Type */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">🖼 Output Type</Form.Label>
              <div>
                <Form.Check
                  inline
                  label="Image"
                  type="radio"
                  name="outputType"
                  value="image"
                  checked={formData.outputType === "image"}
                  onChange={handleOutputTypeChange}
                />
                <Form.Check
                  inline
                  label="Text"
                  type="radio"
                  name="outputType"
                  value="text"
                  checked={formData.outputType === "text"}
                  onChange={handleOutputTypeChange}
                />
              </div>
            </Form.Group>

            {/* Output Value */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">
                {formData.outputType === "image"
                  ? "🖼 Output Image URL"
                  : "📝 Output Text"}
              </Form.Label>
              <Form.Control
                type="text"
                placeholder={
                  formData.outputType === "image"
                    ? "Enter image URL"
                    : "Enter text output"
                }
                name="outputValue"
                value={formData.outputValue}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold">📂 Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type category name"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Submit */}
            <div className="text-center">
              <Button
                variant="success"
                type="submit"
                disabled={loading}
                className="px-5 py-2 rounded-pill shadow-sm fw-bold"
                style={{
                  background: "linear-gradient(90deg,#28a745,#20c997)",
                  border: "none",
                }}
              >
                {loading ? "⏳ Uploading..." : "🚀 Add Feature"}
              </Button>
            </div>

            {msg && <p className="text-center mt-3 fw-bold">{msg}</p>}
          </Form>
        </div>
      </Card>
    </Container>
  );
};

export default AddFeature;
