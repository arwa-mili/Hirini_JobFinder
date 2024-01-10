import React from 'react';

const DownloadAndView = ({ applicant }) =>
{
    const handleDownloadAndView = () =>
    {
        
        const newWindow = window.open();

        newWindow.document.write(`
      <html>
        <head>
          <title>PDF Viewer</title>
        </head>
        <body>
          <div class="pdf-viewer">
            <embed src="http://localhost:8800${applicant.cv}" width="100%" height="100%">
          </div>
        </body>
      </html>
    `);

        // Download the PDF
        const downloadLink = document.createElement('a');
        downloadLink.href = `http://localhost:8800${applicant.cv}`;
        downloadLink.download = 'CV.pdf';
        downloadLink.click();
    };

    return (
        <div>
            <button
                className="download-button"
                onClick={handleDownloadAndView}
            >
                <img src="src/assets/PDF_file_icon.png" alt="PDF Icon" style={{ width: '50px', height: '50px', marginRight: '5px' }}
                />
                CV
            </button>
        </div>
    );
};

export default DownloadAndView;
