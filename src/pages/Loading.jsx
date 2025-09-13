import React, { useEffect, useState } from "react";
import { ProgressBar, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Loading.jsx using Bootstrap
// Usage: <Loading /> or <Loading progress={50} />

export default function Loading({ progress: propProgress = null, loop = true }) {
  const [progress, setProgress] = useState(propProgress ?? 0);

  useEffect(() => {
    if (propProgress !== null) {
      setProgress(propProgress);
      return;
    }

    let mounted = true;
    let p = 0;
    const step = 2;
    const interval = 40;

    function tick() {
      if (!mounted) return;
      p += step;
      if (p > 100) {
        if (loop) p = 0;
        else p = 100;
      }
      setProgress(p);
    }

    const id = setInterval(tick, interval);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [propProgress, loop]);

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      {/* Spinner */}
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>

      {/* Progress bar */}
      <div className="w-75 mt-3">
        <ProgressBar
          now={progress}
          animated
          striped
          variant="info"
          label={`${Math.round(progress)}%`}
        />
      </div>

      {/* Message */}
      <div className="mt-2 text-muted small fw-semibold">
        Please wait, preparing your content...
      </div>
    </div>
  );
}
