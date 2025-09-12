import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";

const Features = () => {
  const [features, setFeatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "features"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeatures(data);
      } catch (error) {
        console.error("Error fetching features:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="my-5">
      <Row className="g-4">
        {features.map((item) => (
          <Col md={6} key={item.id}>
            <Card className="shadow-lg border-0 rounded-4 overflow-hidden h-100">
              <Row className="align-items-center h-100">
                {/* Left Side (Text) */}
                <Col md={6} className="p-4">
                  <h3 className="fw-bold text-primary">{item.title}</h3>
                  <p className="text-muted">{item.shortDescription}</p>
                  <Button
                    variant="primary"
                    className="mt-2 px-4 py-2 rounded-pill shadow-sm"
                    onClick={() => navigate(`/learning/${item.category}`)}
                  >
                    Read More
                  </Button>
                </Col>
                {/* Right Side (Image) */}
                <Col md={6} className="text-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="img-fluid"
                    style={{ maxHeight: "200px", objectFit: "contain" }}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Features;
