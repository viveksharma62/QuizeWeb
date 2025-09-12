import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Collapse } from "react-bootstrap";
import { db } from "../db/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Learning = () => {
  const { category } = useParams();
  const [content, setContent] = useState(null);
  const [openCode, setOpenCode] = useState(false);
  const [openOutput, setOpenOutput] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const q = query(
          collection(db, "features"),
          where("category", "==", category)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setContent(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [category]);

  if (!content) {
    return (
      <p className="text-center text-muted mt-5 fs-5">⏳ Loading content...</p>
    );
  }

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Banner */}
        <div className="text-center mb-4">
          <img
            src={content.image}
            alt={content.title}
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: "300px", objectFit: "cover", borderRadius: "15px" }}
          />
        </div>

        {/* Title */}
        <h2 className="fw-bold text-primary mb-3">
          {content.title}
        </h2>

        {/* Full Description */}
        <p className="fs-5 text-dark mb-4" style={{ lineHeight: "1.8" }}>
          {content.fullDescription}
        </p>

        {/* Example Code Accordion */}
        {content.exampleCode && (
          <>
            <Button
              variant="outline-dark"
              onClick={() => setOpenCode(!openCode)}
              aria-controls="example-code-collapse"
              aria-expanded={openCode}
              className="mb-3"
            >
              💻 {openCode ? "Hide Example Code" : "Show Example Code"}
            </Button>
            <Collapse in={openCode}>
              <div id="example-code-collapse" className="p-3 bg-dark rounded shadow-sm mb-3">
                <pre className="text-white" style={{ overflowX: "auto" }}>
                  <code>{content.exampleCode}</code>
                </pre>
              </div>
            </Collapse>
          </>
        )}

        {/* Output Image Accordion */}
        {content.outputUrl && (
          <>
            <Button
              variant="outline-dark"
              onClick={() => setOpenOutput(!openOutput)}
              aria-controls="output-collapse"
              aria-expanded={openOutput}
              className="mb-3"
            >
              🖼 {openOutput ? "Hide Output" : "Show Output"}
            </Button>
            <Collapse in={openOutput}>
              <div id="output-collapse" className="text-center my-3">
                <img
                  src={content.outputUrl}
                  alt="Output"
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "250px", border: "2px solid #ddd" }}
                />
              </div>
            </Collapse>
          </>
        )}

        {/* Run Online Button */}
        {content.exampleCode && (
          <div className="text-center mt-4">
            <Button
              variant="primary"
              className="px-5 py-2 rounded-pill shadow-sm"
              style={{ background: "linear-gradient(90deg,#007bff,#00c6ff)", border: "none" }}
              onClick={() =>
                window.open(
                  `https://codesandbox.io/s/new?file=/App.js`,
                  "_blank"
                )
              }
            >
              🚀 Run Code Online
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Learning;
