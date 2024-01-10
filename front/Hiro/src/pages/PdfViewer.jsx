
import React, { useEffect, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfViewer = ({ pdfUrl, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="pdf-viewer-modal" ref={modalRef}>
      <div className="pdf-viewer-content">
        <button className="close-button" onClick={handleClose}>
          Close
        </button>
        <div className="pdf-viewer-container">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}>
            <Viewer fileUrl={pdfUrl} />
          </Worker>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
