import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Collapse, Row, Col } from "react-bootstrap";
import { db } from "../db/firebase";
import { doc, getDoc } from "firebase/firestore";
import Loading from "../pages/Loading";

const Learning = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openCode, setOpenCode] = useState(false);
  const [openOutput, setOpenOutput] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "features", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setContent(docSnap.data());
        } else {
          console.log("❌ No such document!");
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [id]);

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

  if (loading) return <Loading />;

  if (!content)
    return (
      <Container className="my-5">
        <h3 className="text-center text-danger">❌ Content not found!</h3>
      </Container>
    );

  const videoId = getVideoId(content.youtubeUrl);

  return (
    <Container className="my-5">
      <Card className="shadow-lg border-0 rounded-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {/* Top Section */}
        <Row className="align-items-center mb-4">
          <Col md={6}>
            <img
              src={content.image}
              alt={content.title}
              className="img-fluid rounded shadow-sm"
              style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
            />
          </Col>
          <Col md={6} className="d-flex flex-column justify-content-center align-items-start ps-4">
            <h2 className="fw-bold text-primary">{content.title}</h2>
            <p className="text-muted fs-5">{content.shortDescription}</p>

            {content.youtubeUrl && videoId && (
              <Button
                variant={playVideo ? "secondary" : "danger"}
                className="px-4 py-2 rounded-pill mt-3"
                onClick={() => setPlayVideo(!playVideo)}
              >
                {playVideo ? "⏸ Pause Video" : "▶️ Play Video"}
              </Button>
            )}
          </Col>
        </Row>

        {/* YouTube Video */}
        {playVideo && videoId && (
          <div className="text-center mb-4">
            <iframe
              width="100%"
              height="600"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded shadow"
            ></iframe>
          </div>
        )}

        {/* Full Description (Rich Text) */}
        <div
          className="fs-5 text-dark mb-4"
          style={{ lineHeight: "1.8" }}
          dangerouslySetInnerHTML={{ __html: content.fullDescription }}
        ></div>

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

        {/* Output Accordion (Image or Text) */}
        {(content.outputType && content.outputValue) && (
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
                {content.outputType === "image" ? (
                  <img
                    src={content.outputValue}
                    alt="Output"
                    className="img-fluid rounded shadow-sm"
                    style={{ maxHeight: "250px", border: "2px solid #ddd" }}
                  />
                ) : (
                  <pre
                    className="p-3 bg-light text-dark rounded shadow-sm text-start"
                    style={{ overflowX: "auto" }}
                  >
                    {content.outputValue}
                  </pre>
                )}
              </div>
            </Collapse>
          </>
        )}

        {/* Run Online Buttons */}
        {content.exampleCode && (
          <div className="text-center mt-4 d-flex gap-3 flex-wrap justify-content-center">
            <Button
              variant="warning"
              className="px-4 py-2 rounded-pill shadow-sm"
              style={{ background: "linear-gradient(90deg,#ffc107,#ffecb3)", border: "none" }}
              onClick={() => window.open(`https://www.programiz.com/online-compiler`, "_blank")}
            >
              🖥 Run C/Java/Python Online
            </Button>

            <Button
              variant="success"
              className="px-4 py-2 rounded-pill shadow-sm"
              style={{ background: "linear-gradient(90deg,#28a745,#71ff85)", border: "none" }}
              onClick={() => window.open(`https://stackblitz.com/fork/react`, "_blank")}
            >
              🌐 Run React / Node Online
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default Learning;
