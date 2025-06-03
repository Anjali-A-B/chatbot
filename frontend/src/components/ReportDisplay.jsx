
// //table form data

// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import PDFExport from './PDFExport';

// const ReportDisplay = ({ reportData, query }) => {
//   if (!reportData || !reportData.length) {
//     return null;
//   }
  
//   // Get column headers from the first object
//   const columns = Object.keys(reportData[0]);
  
//   return (
//     <Card className="w-full mt-4">
//       <CardHeader>
//         <CardTitle className="text-lg flex justify-between items-center">
//           <span>Query Results</span>
//           <PDFExport data={reportData} query={query} />
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 {columns.map((column) => (
//                   <th 
//                     key={column} 
//                     className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
//                   >
//                     {column}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-card divide-y divide-border">
//               {reportData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {columns.map((column) => (
//                     <td key={column} className="px-4 py-2 text-sm">
//                       {row[column]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//       <CardFooter className="text-xs text-muted-foreground">
//         {reportData.length} rows returned
//       </CardFooter>
//     </Card>
//   );
// };

// export default ReportDisplay;





// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import PDFExport from './PDFExport';

// const ReportDisplay = ({ reportData, query }) => {
//   if (!reportData || reportData.length === 0) {
//     return null;
//   }

//   const columns = Object.keys(reportData[0]); // Get the column names from the first row

//   return (
//     <Card className="w-full mt-4">
//       <CardHeader>
//         <CardTitle className="text-lg flex justify-between items-center">
//           <span>Query Results</span>
//           <PDFExport data={reportData} query={query} />
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-border">
//             <thead>
//               <tr>
//                 {columns.map((column) => (
//                   <th
//                     key={column}
//                     className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
//                   >
//                     {column}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="bg-card divide-y divide-border">
//               {reportData.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {columns.map((column) => (
//                     <td key={column} className="px-4 py-2 text-sm">
//                       {row[column]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </CardContent>
//       <CardFooter className="text-xs text-muted-foreground">
//         {reportData.length} rows returned
//       </CardFooter>
//     </Card>
//   );
// };
// export default ReportDisplay;




import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PDFExport from './PDFExport';

const ReportDisplay = ({ reportData, query }) => {
  const [showAll, setShowAll] = useState(false); // State to toggle full report display

  if (!reportData || reportData.length === 0) {
    return null;
  }

  const columns = Object.keys(reportData[0]); // Get the column names from the first row
  const rowsToDisplay = showAll ? reportData : reportData.slice(0, 10); // Show full or first 10 rows

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="text-lg flex justify-between items-center">
          <span>Query Results</span>
          <PDFExport data={reportData} query={query} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {rowsToDisplay.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 text-sm">
                      {row[column]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Show "Read More" button only if there are more rows */}
        {reportData.length > 10 && !showAll && (
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setShowAll(true)}>
              Read More
            </Button>
          </div>
        )}
        {/* Show "Show Less" button when showing all rows */}
        {showAll && reportData.length > 10 && (
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setShowAll(false)}>
              Show Less
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        {reportData.length} rows returned
      </CardFooter>
    </Card>
  );
};

export default ReportDisplay;
