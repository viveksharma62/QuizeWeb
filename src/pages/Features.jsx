import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";
import Loading from "./Loading"; 

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); 
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
        setFiltered(data);

        const uniqueCategories = ["All", ...new Set(data.map((item) => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") setFiltered(features);
    else setFiltered(features.filter((item) => item.category === category));
  };

  if (loading) return <Loading />;

  return (
    <Container className="my-5">
      {/* Filter Dropdown */}
      <div className="d-flex justify-content-end mb-4">
        <Form.Select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-auto shadow-sm border-0"
          style={{ maxWidth: "250px", background: "#f8f9fa" }}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Features Cards */}
      <Row className="g-4">
        {filtered.map((item) => (
          <Col md={6} lg={4} key={item.id}>
            <Card
              className="h-100 shadow-lg rounded-4 border-0 overflow-hidden"
              style={{
                transition: "transform 0.3s, box-shadow 0.3s",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/learning/${item.category}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 1rem 2rem rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.15)";
              }}
            >
              <Card.Img
                variant="top"
                src={item.image}
                style={{
                  height: "200px",
                  objectFit: "cover",
                  transition: "transform 0.3s",
                }}
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title
                    style={{ color: "#0d6efd", fontWeight: "700", fontSize: "1.3rem" }}
                  >
                    {item.title}
                  </Card.Title>
                  <Card.Text className="text-muted" style={{ minHeight: "60px" }}>
                    {item.shortDescription}
                  </Card.Text>
                </div>
                <Button
                  className="mt-3"
                  style={{
                    background: "linear-gradient(90deg, #0d6efd, #6610f2)",
                    border: "none",
                    fontWeight: "600",
                    borderRadius: "50px",
                    padding: "0.5rem 1.5rem",
                    boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.2)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 1rem 2rem rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgba(0,0,0,0.2)";
                  }}
                  onClick={() => navigate(`/learning/${item.category}`)}
                >
                  Read More
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Features;
