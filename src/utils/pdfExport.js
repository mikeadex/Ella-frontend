import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports a DOM element to PDF
 * @param {HTMLElement|string} element - DOM element or element ID to export
 * @param {string} filename - Name of the PDF file to download
 */
export const exportToPDF = async (element, filename = 'cv.pdf') => {
  try {
    // Get the target element
    const targetElement = typeof element === 'string' 
      ? document.getElementById(element) 
      : element;
      
    if (!targetElement) {
      console.error('Target element not found:', element);
      return;
    }
    
    // Add a class to the element when exporting
    targetElement.classList.add('for-print');
    
    // A4 dimensions in points (72 dpi)
    const a4Width = 595.28;
    const a4Height = 841.89;
    
    // Configure canvas options for better quality
    const canvasOptions = {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Allow cross-origin images
      allowTaint: true,
      logging: false,
      letterRendering: true,
      windowWidth: targetElement.scrollWidth,
      windowHeight: targetElement.scrollHeight
    };
    
    // Create canvas from the element
    const canvas = await html2canvas(targetElement, canvasOptions);
    
    // Calculate dimensions to fit A4
    const imgWidth = a4Width;
    const imgHeight = (canvas.height * a4Width) / canvas.width;
    
    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'pt',
      format: 'a4'
    });
    
    // Add image to PDF
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    let pdfHeight = imgHeight;
    let pdfWidth = imgWidth;
    
    // Handle multi-page PDFs if content is too long
    if (imgHeight > a4Height) {
      // Content is taller than a single page
      const pageCount = Math.ceil(imgHeight / a4Height);
      
      // Create a new canvas for each page
      for (let i = 0; i < pageCount; i++) {
        // Add a new page after the first page
        if (i > 0) {
          pdf.addPage();
        }
        
        // Calculate position to "crop" from original canvas
        const sourceY = a4Height * i;
        let sourceHeight = a4Height;
        
        // If this is the last page and it's not full
        if (i === pageCount - 1 && imgHeight % a4Height !== 0) {
          sourceHeight = imgHeight % a4Height;
        }
        
        // Add portion of the image to the PDF
        pdf.addImage(
          imgData, 
          'JPEG', 
          0, 
          0, 
          pdfWidth, 
          pdfHeight, 
          `page-${i}`, 
          'FAST',
          -sourceY
        );
      }
    } else {
      // Content fits on a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }
    
    // Remove the print class
    targetElement.classList.remove('for-print');
    
    // Save PDF
    pdf.save(filename);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    
    // Clean up if there was an error
    if (typeof element === 'string') {
      const el = document.getElementById(element);
      if (el) el.classList.remove('for-print');
    } else if (element) {
      element.classList.remove('for-print');
    }
    
    return false;
  }
};

/**
 * Opens browser print dialog for a specific element
 * @param {HTMLElement|string} element - DOM element or ID to print
 */
export const print = (element) => {
  const targetElement = typeof element === 'string' 
    ? document.getElementById(element) 
    : element;
    
  if (!targetElement) {
    console.error('Target element not found for printing');
    return;
  }
  
  // Store original styles to restore later
  const originalBodyOverflow = document.body.style.overflow;
  const originalBodyPosition = document.body.style.position;
  const originalBodyWidth = document.body.style.width;
  const originalBodyHeight = document.body.style.height;
  
  // Hide scrollbars and prevent user interaction during printing
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'relative';
  document.body.style.width = '100%';
  document.body.style.height = '100%';
  
  // Use window.print() to open the print dialog
  window.print();
  
  // Restore original body styles
  document.body.style.overflow = originalBodyOverflow;
  document.body.style.position = originalBodyPosition;
  document.body.style.width = originalBodyWidth;
  document.body.style.height = originalBodyHeight;
};

/**
 * Apply print-optimized styles to the document
 * This is called before print in print preview
 */
export const applyPrintStyles = () => {
  // Create print style element if it doesn't exist
  let printStyle = document.getElementById('cv-print-styles');
  
  if (!printStyle) {
    printStyle = document.createElement('style');
    printStyle.id = 'cv-print-styles';
    document.head.appendChild(printStyle);
  }
  
  // Add print-specific styles
  printStyle.textContent = `
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      /* Hide unnecessary elements */
      nav, header, footer, .no-print, button {
        display: none !important;
      }
      
      /* Ensure the CV container is properly sized */
      .cv-container {
        width: 100% !important;
        height: auto !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      
      /* Ensure page breaks don't cut content awkwardly */
      .cv-section {
        page-break-inside: avoid;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
      
      img, table, figure {
        page-break-inside: avoid;
      }
      
      /* Ensure links are not underlined and show their URL */
      a {
        text-decoration: none !important;
      }
      
      a[href]:after {
        content: " (" attr(href) ")";
      }
    }
  `;
  
  return printStyle;
};

/**
 * Add download and print buttons to the CV preview
 * @param {string} containerId - DOM ID of the container to add buttons to
 * @param {string} cvId - DOM ID of the CV element
 */
export const addExportControls = (containerId, cvId, filename = 'cv.pdf') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'cv-export-controls no-print';
  controlsContainer.style.cssText = `
    display: flex;
    justify-content: center;
    gap: 10px;
    margin: 20px 0;
    padding: 10px;
  `;
  
  // Download PDF button
  const downloadBtn = document.createElement('button');
  downloadBtn.textContent = 'Download as PDF';
  downloadBtn.className = 'btn btn-primary';
  downloadBtn.onclick = () => exportToPDF(cvId, filename);
  
  // Print button
  const printBtn = document.createElement('button');
  printBtn.textContent = 'Print';
  printBtn.className = 'btn btn-outline-primary';
  printBtn.onclick = () => print(cvId);
  
  controlsContainer.appendChild(downloadBtn);
  controlsContainer.appendChild(printBtn);
  container.appendChild(controlsContainer);
  
  return controlsContainer;
};
