function print() {
  const printWindow = window.open("print.html", "_blank");
  printWindow.onload = function () {
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
  };
}

function generatePDF() {
  console.log("Generating PDF with custom margins...");
  const element = document.querySelector('.wrapper');
  
  const tempStyle = document.createElement('style');
  tempStyle.innerHTML = `
    @media print {
      body {
        font-size: 9pt !important;
        line-height: 1.2 !important;
        height: auto !important;
        max-height: 285mm !important; /* Reduced from 297mm */
        overflow: hidden !important;
      }
      
      .wrapper {
        display: flex !important;
        width: 100% !important;
        height: auto !important;
        max-height: 285mm !important; /* Reduced from 297mm */
        overflow: hidden !important;
      }
    }
  `;
  document.head.appendChild(tempStyle);
  
  const name = document.querySelector(".name").textContent || "Resume";
  const filename = `${name.replace(/\s+/g, "_")}_Resume.pdf`;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    enableLinks: false, /* Disable links to prevent extra pages */
    html2canvas: {
      scale: 2,
      dpi: 300,
      useCORS: true,
      letterRendering: true,
      scrollY: 0,
      height: Math.min(element.offsetHeight, 2970), /* Force maximum height */
      windowHeight: Math.min(element.offsetHeight + 20, 2970),
      onclone: function(clonedDoc) {
        // First, remove whitespace nodes between experience items
        const experienceSection = clonedDoc.querySelector('.experiences-section');
        if (experienceSection) {
          // Clean up whitespace text nodes
          Array.from(experienceSection.childNodes).forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim() === '') {
              experienceSection.removeChild(node);
            }
          });
          
          // Also remove HTML comments that might be creating space
          let html = experienceSection.innerHTML;
          html = html.replace(/<!--[\s\S]*?-->/g, '');
          experienceSection.innerHTML = html;
        }
        
        // Now add the aggressive styling
        const style = clonedDoc.createElement('style');
        style.innerHTML = `
          /* Force single page */
          html, body {
            height: auto !important;
            max-height: 285mm !important; /* Reduced height */
            overflow: hidden !important;
            page-break-after: avoid !important;
          }
          
          /* Hide anything that might extend beyond the page */
          @page {
            size: A4;
            margin: 0;
          }
          
          /* Rest of your styles */
          .main-wrapper { font-size: 7.5pt !important; line-height: 1.1 !important; }
          .sidebar-wrapper { font-size: 7pt !important; }
          
          /* Super aggressive experience spacing */
          .experiences-section > *:not(.item) {
            display: none !important;
          }
          
          .experiences-section {
            display: flex !important;
            flex-direction: column !important;
            gap: 10pt !important;
          }
          
          .experiences-section .item {
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
          }
          
          /* Other spacing fixes remain the same */
          .experiences-section .details p {
            margin-bottom: 2pt !important;
          }
          
          .experiences-section .details ul {
            margin-top: 2pt !important;
            margin-bottom: 2pt !important;
            padding-left: 12pt !important;
          }
          
          .experiences-section .details li {
            margin-bottom: 2pt !important;
          }
          
          .experiences-section .meta {
            margin-bottom: 2pt !important;
          }
          
          .experiences-section .company {
            margin-bottom: 2pt !important;
          }
          
          /* Set exactly 2 lines spacing between certifications and skills */
          .certifications-section {
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
          }
          
          .skills-section {
            margin-top: 16.5pt !important; /* Exactly 2 lines at 7.5pt × 1.1 line height */
            padding-top: 0 !important;
          }
          
          /* Remove any other spacing that might interfere */
          .certifications-section + .skills-section {
            margin-top: 16.5pt !important; /* Exactly 2 lines */
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
      putOnlyUsedFonts: true,
      precision: 16
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().set(opt).from(element).save();
}
