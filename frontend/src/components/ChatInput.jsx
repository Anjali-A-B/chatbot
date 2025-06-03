




// added feature like loading symbols ....


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import AudioControls from "./AudioControls";
import { Circles } from "react-loader-spinner";  // Import the loader component

const ChatInput = ({ onSendMessage, isProcessing }) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setIsTyping(message.trim() !== "");
  }, [message]);

  const handleSendMessageClick = (e) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage("");
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleTextareaChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && isTyping) {
      e.preventDefault();
      handleSendMessageClick(e);
    }
  };

  const handleReportClick = () => {
    if (!message.trim()) {
      const reportText = "/report ";
      setMessage(reportText);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            reportText.length,
            reportText.length
          );
        }
      }, 0);
    } else {
      onSendMessage(`/report ${message}`);
      setMessage("");
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  return (
    <form
      onSubmit={handleSendMessageClick}
      className="p-4 bg-white border-t shadow-md fixed bottom-0 left-0 right-0 z-10"
    >
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => {
              handleTextareaChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`; // autosize
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message or start with /report for SQL queries..."
            className="w-full h-auto resize-none overflow-hidden py-3 px-4"
            disabled={isProcessing}
            rows={1}
          />
        </div>

        {/* Show loading spinner or Audio controls depending on the state */}
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <Circles height="30" width="30" color="gray" ariaLabel="loading" />
          </div>
        ) : isTyping ? (
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isProcessing}
            className="rounded-full"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        ) : (
          <AudioControls
            onTranscription={(text) => setMessage((prev) => prev + text)}
            setIsProcessing={(status) => {}}
          />
        )}

        <Button
          type="button"
          onClick={handleReportClick}
          className="!bg-black !text-white hover:!bg-gray-800 rounded-full text-sm px-3 py-1 h-auto"
          disabled={isProcessing}
        >
          Report
        </Button>
      </div>

      {message.startsWith("/report") && (
        <div className="px-3 py-2 text-sm bg-muted rounded-md mt-2">
          <span className="font-medium">Report Mode:</span> SQL query will be
          generated based on your request
        </div>
      )}
    </form>
  );
};

export default ChatInput;
