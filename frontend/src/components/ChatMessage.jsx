

// import React from "react";
// import { cn } from "@/lib/utils";
// import ReportDisplay from "@/components/ReportDisplay"; // Import ReportDisplay

// const ChatMessage = ({ message, isUser }) => {
//   return (
//     <div
//       className={cn(
//         "flex w-full my-2",
//         isUser ? "justify-end" : "justify-start"
//       )}
//     >
//       <div
//         className={cn(
//           "max-w-[80%] rounded-lg p-4",
//           isUser
//             ? "bg-primary text-primary-foreground rounded-bl-none ml-auto"
//             : "bg-muted rounded-br-none mr-auto"
//         )}
//       >
//         <p className="whitespace-pre-wrap break-words">{message.content}</p>

//         {message.reportData && (
//           <div className="mt-4">
//             <ReportDisplay
//               reportData={message.reportData}
//               query={message.query}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;



//working sql query


// import React from "react";
// import { cn } from "@/lib/utils";
// import ReportDisplay from "@/components/ReportDisplay"; // Import ReportDisplay
// const ChatMessage = ({ message, isUser }) => {
//   return (
//     <div
//       className={cn(
//         "flex w-full my-2",
//         isUser ? "justify-end" : "justify-start"
//       )}
//     >
//       <div
//         className={cn(
//           "max-w-[80%] rounded-lg p-4",
//           isUser
//             ? "bg-primary text-primary-foreground rounded-bl-none ml-auto"
//             : "bg-muted rounded-br-none mr-auto"
//         )}
//       >
//         <p className="whitespace-pre-wrap break-words">{message.content}</p>

//         {/* Display SQL Query */}
//         {message.content.includes("Generated SQL query:") && (
//           <pre className="mt-4 bg-gray-100 p-2 rounded-md text-sm">{message.content}</pre>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;




//sql table show
import { cn } from "@/lib/utils";
import ReportDisplay from "@/components/ReportDisplay";
const ChatMessage = ({ message, isUser }) => {
  return (
    <div
      className={cn(
        "flex w-full my-2",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg p-4",
          isUser
            ? "bg-primary text-primary-foreground rounded-bl-none ml-auto"
            : "bg-muted rounded-br-none mr-auto"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>

        {/* Display SQL Query or Report Data */}
        {message.content.includes("Generated SQL query:") && (
          <pre className="mt-4 bg-gray-100 p-2 rounded-md text-sm">{message.content}</pre>
        )}

        {/* Check if there's report data */}
        {message.reportData && Array.isArray(message.reportData) && message.reportData.length > 0 && (
          <ReportDisplay reportData={message.reportData} query={message.content} />
        )}
      </div>
    </div>
  );
};
export default ChatMessage;



