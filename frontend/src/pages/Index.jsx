
import React, { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ReportDisplay from "@/components/ReportDisplay";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Import the Button component
import { useParams } from "react-router-dom";
import {
  sendMessageToAPI,
  speakMessage,
  cancelSpeech,
} from "@/utils/chatUtils";
// import { processReportCommand, executeQuery } from "@/utils/reportUtils";
import {sendReportQueryToAPI } from "@/utils/reportUtils";

import { Volume, VolumeOff } from "lucide-react"; // Import VolumeOff and Volume icons


const Index = () => {

  const navigate = useNavigate();  // Initialize navigate
  const { companyId } = useParams(); // ⬅️ Add this line
  useEffect(() => {
    console.log("Loaded chatbot for company:", companyId);
    // You can fetch company-specific data here if needed
  }, [companyId]);


  const [messages, setMessages] = useState([
    {
      content: "Hello! I'm your AI assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [isMuted, setIsMuted] = useState(false); // State for mute status

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMuteToggle = () => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      cancelSpeech(); // Optionally cancel current speech when muting
    }
  };


  

  //backend 2nd


  // const handleSendMessage = async (message) => {
  //   const timestamp = new Date().toISOString();
  //   const userMessage = {
  //     content: message,
  //     isUser: true,
  //     isProcessing: true,
  //     timestamp,
  //   };
  
  //   setMessages((prev) => [...prev, userMessage]);
  //   setIsProcessing(true);
  
  //   try {
  //     if (message.trim().toLowerCase().startsWith("/report")) {
  //       const reportResponse = await sendReportQueryToAPI(message);
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           content: reportResponse.reply, // Display SQL query in response
  //           isUser: false,
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  //     } else {
  //       setMessages((prev) =>
  //         prev.map((msg) =>
  //           msg.timestamp === timestamp ? { ...msg, isProcessing: false } : msg
  //         )
  //       );
  
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           content: "typing...",
  //           isUser: false,
  //           isTyping: true,
  //           timestamp: new Date().toISOString(),
  //         },
  //       ]);
  
  //       const response = await sendMessageToAPI(message);
  
  //       setMessages((prev) => prev.filter((msg) => !msg.isTyping));
  
  //       const botMessage = {
  //         content: response.content,
  //         isUser: false,
  //         timestamp: response.timestamp,
  //       };
  
  //       setMessages((prev) => [...prev, botMessage]);
  
  //       if (!isMuted) {
  //         speakMessage(response.content, false);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error processing message:", error);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         content: "Sorry, I encountered an error processing your request.",
  //         isUser: false,
  //         timestamp: new Date().toISOString(),
  //       },
  //     ]);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };
  
  



  //fullmessage and report


  const handleSendMessage = async (message) => {
    const timestamp = new Date().toISOString();
    const userMessage = {
      content: message,
      isUser: true,
      isProcessing: true,
      timestamp,
    };
  
    // Add user's message to chat
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
  
    try {
      if (message.trim().toLowerCase().startsWith("/report")) {
        // Handling report request
        const reportResponse = await sendReportQueryToAPI(message);
        
        if (reportResponse && reportResponse.data && Array.isArray(reportResponse.data)) {
          // If report data exists, display the result
          setMessages((prev) => [
            ...prev,
            {
              content: "Report generated successfully.", // Indicating success
              isUser: false,
              timestamp: new Date().toISOString(),
              reportData: reportResponse.data, // Pass report data for display
            },
          ]);
        } else {
          // If there's an error with the report data
          setMessages((prev) => [
            ...prev,
            {
              content: "Error: Unexpected response format for report.",
              isUser: false,
              timestamp: new Date().toISOString(),
            },
          ]);
        }
      } else {
        // Handling regular non-report messages
        setMessages((prev) =>
          prev.map((msg) =>
            msg.timestamp === timestamp ? { ...msg, isProcessing: false } : msg
          )
        );
  
        // Display typing message to simulate the bot is processing
        setMessages((prev) => [
          ...prev,
          {
            content: "typing...",
            isUser: false,
            isTyping: true,
            timestamp: new Date().toISOString(),
          },
        ]);
  
        // Call your regular API for non-report messages
        const response = await sendMessageToAPI(message);
  
        // Remove the typing message
        setMessages((prev) => prev.filter((msg) => !msg.isTyping));
  
        const botMessage = {
          content: response.content,
          isUser: false,
          timestamp: response.timestamp,
        };
  
        // Add bot's response to chat
        setMessages((prev) => [...prev, botMessage]);
  
        // Optional: Handle text-to-speech for bot response
        if (!isMuted) {
          speakMessage(response.content, false);
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
  
      // Handle any errors by notifying the user
      setMessages((prev) => [
        ...prev,
        {
          content: "Sorry, I encountered an error processing your request.",
          isUser: false,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      // Turn off the processing state after completion
      setIsProcessing(false);
    }
  };
  


  // multiple entry i table 

  
  
  const handleReportCommand = async (message) => {
    const { sqlQuery, originalRequest } = processReportCommand(message);

    setMessages((prev) => [
      ...prev,
      {
        content: `I'll run this SQL query for you:\n\`\`\`sql\n${sqlQuery}\n\`\`\``,
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);

    const results = await executeQuery(sqlQuery);

    setMessages((prev) => [
      ...prev,
      {
        content: `Here are the results for your query "${originalRequest}":`,
        reportData: results, // Include reportData in the message
        query: sqlQuery, // Optionally include the query here too
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);

    setCurrentReport(null); // Optionally clear currentReport if no longer needed separately
  };

  // return (
  //   <div className="flex flex-col h-screen bg-background">
  //     <header className="border-b p-4 flex items-center justify-between">
  //       {" "}
  //       {/* Added flex for alignment */}
  //       <h1 className="text-xl font-bold">AI Chat Assistant</h1>
  //       <Button onClick={handleMuteToggle} size="icon">
  //         {isMuted ? (
  //           <VolumeOff className="h-5 w-5" />
  //         ) : (
  //           <Volume className="h-5 w-5" />
  //         )}
  //         <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
  //       </Button>
  //     </header>

  //     <main className="flex-1 overflow-y-auto p-4 flex flex-col justify-end pb-32">
  //       <div className="max-w-3xl mx-auto w-full">
  //         <div className="space-y-4">
  //           {messages.map((msg, index) => (
  //             <ChatMessage key={index} message={msg} isUser={msg.isUser} />
  //           ))}
  //           <div ref={messagesEndRef} />
  //         </div>

  //         {isProcessing && (
  //           <div className="text-center my-4">
  //             <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
  //           </div>
  //         )}

  //         {/* {currentReport && (
  //           <ReportDisplay
  //             reportData={currentReport.data}
  //             query={currentReport.query}
  //           />
  //         )} */}
  //       </div>
  //     </main>

  //     <div>
  //       <ChatInput
  //         onSendMessage={handleSendMessage}
  //         isProcessing={isProcessing}
  //       />
  //     </div>
  //   </div>
  // );

  const handleLogout = () => {
    console.log("Logging out...");
  
    // Match the key you used to store the token
    localStorage.removeItem("user");
  
    // Redirect to login
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        <div className="flex items-center gap-4">
        <Button onClick={handleMuteToggle} size="icon">
          {isMuted ? (
            <VolumeOff className="h-5 w-5" />
          ) : (
            <Volume className="h-5 w-5" />
          )}
          <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
        </Button>
        <Button onClick={handleLogout} variant="destructive" size="icon" title="Logout">
          <LogOut className="h-5 w-5" />
          <span className="sr-only">Logout</span>
        </Button>
      </div>
     
      </header>

      {/* Chat area (scrollable) */}
      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ paddingBottom: "120px" }}
      >
        <div className="max-w-3xl mx-auto w-full space-y-4">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} isUser={msg.isUser} />
          ))}
          <div ref={messagesEndRef} />
          {isProcessing && (
            <div className="text-center my-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" />
            </div>
          )}
        </div>
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;



