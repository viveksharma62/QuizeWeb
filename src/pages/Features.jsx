import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";
import Loading from "./Loading"; // 👈 apna Loading component import kar lo

const Features = () => {
  const [features, setFeatures] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true); // 👈 new loading state
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

        // Get unique categories
        const uniqueCategories = [
          "All",
          ...new Set(data.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching features:", error);
      } finally {
        setLoading(false); // 👈 loading done
      }
    };

    fetchData();
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFiltered(features);
    } else {
      setFiltered(features.filter((item) => item.category === category));
    }
  };

  if (loading) {
    return <Loading />; // 👈 yaha loading screen dikhega
  }

  return (
    <Container className="my-5">
      {/* Filter Dropdown */}
      <div className="d-flex justify-content-end mb-4">
        <Form.Select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-auto shadow-sm"
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
