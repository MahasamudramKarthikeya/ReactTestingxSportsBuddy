import React from "react";
import "../styles/Shimmer.css";

export default function Shimmer() {
  return (
    <div className="shimmer-container" data-testid="shimmer-loader">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="shimmer-card">
          <div className="shimmer-image-wrapper">
            <div className="shimmer-image" />
            <div className="shimmer-rating-wrapper">
              <div className="shimmer-rating-score" />
              <div className="shimmer-rating-votes" />
            </div>
          </div>
          <div className="shimmer-content">
            <div className="shimmer-title" />
            <div className="shimmer-location" />
            <div className="shimmer-icons">
              <div className="shimmer-icon" />
              <div className="shimmer-icon" />
              <div className="shimmer-icon" />
            </div>
            <div className="shimmer-tags">
              <div className="shimmer-tag" />
              <div className="shimmer-tag" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
