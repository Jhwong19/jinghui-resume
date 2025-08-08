function print() {
  const printWindow = window.open("print.html", "_blank");
  printWindow.onload = function () {
    printWindow.print();
    setTimeout(() => printWindow.close(), 500);
  };
}

function generatePDF() {
  // Path to your pre-generated PDF file
  const pdfPath = "assets/pdf/Jing_Hui_Wong_Resume.pdf";
  
  // Create a link element
  const link = document.createElement('a');
  link.href = pdfPath;
  link.download = "Jing_Hui_Wong_Resume.pdf";
  
  // Trigger the download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}