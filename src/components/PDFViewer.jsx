// PDFViewer.js
import React from "react";
import { Document, Page } from "react-pdf";

const PDFViewer = ({ pdfURL }) => {
  return (
    <div>
      <Document file={pdfURL} options={{ workerSrc: "/pdf.worker.js" }}>
        <Page pageNumber={1} />
      </Document>
    </div>
  );
};

export default PDFViewer;
