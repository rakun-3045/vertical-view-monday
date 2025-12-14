// LoadingSkeleton component - Displays animated placeholders while loading
import React from 'react';
import './LoadingSkeleton.css';

const LoadingSkeleton = () => {
  return (
    <div className="loading-skeleton">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-title shimmer"></div>
        <div className="skeleton-meta shimmer"></div>
        <div className="skeleton-actions">
          <div className="skeleton-btn shimmer"></div>
          <div className="skeleton-btn shimmer"></div>
          <div className="skeleton-btn shimmer"></div>
        </div>
      </div>

      {/* Banner Skeleton */}
      <div className="skeleton-banner shimmer"></div>

      {/* Category Skeletons */}
      {[1, 2, 3].map((categoryIdx) => (
        <div key={categoryIdx} className="skeleton-category">
          <div className="skeleton-category-header">
            <div className="skeleton-category-title shimmer"></div>
            <div className="skeleton-category-count shimmer"></div>
          </div>
          
          {/* Field Row Skeletons */}
          {[1, 2, 3, 4, 5, 6].map((fieldIdx) => (
            <div key={fieldIdx} className="skeleton-field-row">
              <div className="skeleton-field-label">
                <div className="skeleton-icon shimmer"></div>
                <div className="skeleton-label-text">
                  <div className="skeleton-label-title shimmer"></div>
                  <div className="skeleton-label-type shimmer"></div>
                </div>
              </div>
              <div className="skeleton-field-value shimmer"></div>
            </div>
          ))}
        </div>
      ))}

      {/* Loading Text */}
      <div className="loading-text">
        <div className="loading-spinner"></div>
        <span>Loading item details...</span>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
