// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { toast } from '@/components/ui/sonner';
// import { FileText, Download } from 'lucide-react';

// const PDFExport = ({ data, query }) => {
//   const generatePDF = () => {
//     // In a real implementation, you would use a library like jsPDF
//     // For this mockup, we'll create a simple text blob
//     try {
//       const content = `
// SQL Query: ${query}

// Results:
// ${JSON.stringify(data, null, 2)}
//       `;

//       const blob = new Blob([content], { type: 'text/plain' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');

//       link.href = url;
//       link.download = `report-${new Date().toISOString().split('T')[0]}.txt`;
//       document.body.appendChild(link);
//       link.click();

//       // Clean up
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);

//       toast.success('Report downloaded successfully');
//     } catch (error) {
//       toast.error('Failed to download report');
//       console.error('PDF generation error:', error);
//     }
//   };

//   return (
//     <Button
//       variant="outline"
//       size="sm"
//       className="flex items-center gap-1"
//       onClick={generatePDF}
//     >
//       <Download className="h-4 w-4" />
//       <span>Download</span>
//     </Button>
//   );
// };

// export default PDFExport;

import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";

const PDFExport = ({ data, query }) => {
  const generatePDF = () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        putOnlyUsedFonts: true,
      });
      pdf.setFontSize(12);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      let y = 20;
      const lineHeight = 5;
      const columnSpacing = 5;

      // Title
      pdf.setFontSize(16);
      pdf.text("Query Results", margin, y);
      y += lineHeight * 2;

      // Query
      pdf.setFontSize(12);
      pdf.text(`SQL Query: ${query}`, margin, y);
      y += lineHeight * 3;

      // Headers and Data
      if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        const columnWidths = {};
        columns.forEach((col) => {
          columnWidths[col] = 15; // Initial guess
        });

        // Auto-sizing columns (basic)
        data.forEach((row) => {
          columns.forEach((col) => {
            const textWidth = pdf.getTextWidth(String(row[col])) + 2;
            columnWidths[col] = Math.max(columnWidths[col], textWidth);
          });
        });

        let currentX = margin;
        pdf.setFont("helvetica", "bold");
        columns.forEach((column) => {
          pdf.text(column, currentX, y);
          currentX += columnWidths[column] + columnSpacing;
        });
        y += lineHeight;
        pdf.line(margin, y - 1, currentX - columnSpacing, y - 1);
        y += lineHeight;
        pdf.setFont("helvetica", "normal");

        data.forEach((row) => {
          currentX = margin;
          columns.forEach((column) => {
            const text = String(row[column]);
            const lines = pdf.splitTextToSize(text, columnWidths[column] - 2);
            lines.forEach((line) => {
              pdf.text(line, currentX, y);
              y += lineHeight;
            });
            currentX += columnWidths[column] + columnSpacing;
            y -= (lines.length - 1) * lineHeight;
          });
          y += lineHeight * 0.75;
          if (y > pdf.internal.pageSize.getHeight() - margin - lineHeight) {
            pdf.addPage();
            y = margin + lineHeight * 2;
          }
        });
      } else {
        pdf.text("No data to display.", margin, y);
      }

      pdf.save(`report-${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("Report downloaded as PDF successfully");
    } catch (error) {
      toast.error("Failed to download report as PDF");
      console.error("PDF generation error:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-1"
      onClick={generatePDF}
    >
      <Download className="h-4 w-4" />
      <span>Download PDF</span>
    </Button>
  );
};

export default PDFExport;
