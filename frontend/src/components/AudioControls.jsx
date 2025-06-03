

// import React, { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Mic,
//   MicOff,
//   Play,
//   Pause,
//   Send,
//   Trash2,
//   Volume,
//   VolumeOff,
// } from "lucide-react";

// const AudioControls = ({ onTranscription }) => {
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [isMuted, setIsMuted] = useState(false);
//   const audioPlayerRef = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);

//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     } else if (mediaRecorder) {
//       mediaRecorder.stop();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isRecording]);

//   const startRecording = () => {
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         const recorder = new MediaRecorder(stream);
//         setMediaRecorder(recorder);
//         recorder.start();

//         const chunks = [];
//         recorder.ondataavailable = (event) => {
//           chunks.push(event.data);
//         };

//         recorder.onstop = () => {
//           const audio = new Blob(chunks, { type: "audio/webm" });
//           setAudioBlob(audio);
//         };
//       })
//       .catch((error) => {
//         console.error("Error accessing audio: ", error);
//         setIsRecording(false);
//       });
//   };

//   const handleSendAudio = () => {
//     if (audioBlob) {
//       sendAudioToBackend(audioBlob);
//       setAudioBlob(null);
//     } else {
//       console.error("No audio recorded to send.");
//     }
//   };

//   const discardRecording = () => {
//     setAudioBlob(null);
//     setIsPlaying(false);
//     if (audioPlayerRef.current) {
//       audioPlayerRef.current.src = "";
//     }
//     console.log("Recording discarded.");
//   };

//   const playRecording = () => {
//     if (audioBlob && audioPlayerRef.current) {
//       const url = URL.createObjectURL(audioBlob);
//       audioPlayerRef.current.src = url;

//       if (isPlaying) {
//         audioPlayerRef.current.pause();
//         setIsPlaying(false);
//       } else {
//         audioPlayerRef.current.play();
//         setIsPlaying(true);
//         audioPlayerRef.current.onended = () => {
//           setIsPlaying(false);
//           URL.revokeObjectURL(url);
//         };
//       }
//     } else {
//       console.error("No audio to play.");
//     }
//   };

//   const sendAudioToBackend = (audioBlob) => {
//     const formData = new FormData();
//     formData.append("audio", audioBlob, "audio.webm");

//     fetch("http://localhost:5000/api/convert-audio", {
//       method: "POST",
//       body: formData,
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         onTranscription(data.transcription);
//         console.log("Audio processed");
//       })
//       .catch((error) => {
//         console.error("Error sending audio to backend", error);
//       });
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     console.log(isMuted ? "Audio unmuted" : "Audio muted");
//   };

//   return (
//     <div className="flex items-center gap-2">
//       <Button
//         type="button"
//         size="icon"
//         onClick={() => setIsRecording(!isRecording)}
//         title={isRecording ? "Stop recording" : "Start recording"}
//         className={`!text-white hover:!opacity-90 ${
//           isRecording ? "!bg-red-600" : "!bg-black"
//         }`}
//       >
//         {isRecording ? (
//           <Mic className="h-4 w-4 animate-pulse text-white" />
//         ) : (
//           <MicOff className="h-4 w-4 text-white" />
//         )}
//       </Button>

//       {audioBlob && (
//         <>
//           <Button
//             type="button"
//             size="icon"
//             onClick={playRecording}
//             title={isPlaying ? "Pause playback" : "Play recording"}
//             className={`!text-white hover:!opacity-90 ${
//               isPlaying ? "!bg-red-600" : "!bg-black"
//             }`}
//             disabled={isRecording}
//           >
//             {isPlaying ? (
//               <Pause className="h-4 w-4 text-white" />
//             ) : (
//               <Play className="h-4 w-4 text-white" />
//             )}
//           </Button>

//           <Button
//             type="button"
//             size="icon"
//             variant="destructive"
//             onClick={discardRecording}
//             title="Discard recording"
//             disabled={isRecording}
//           >
//             <Trash2 className="h-4 w-4" />
//           </Button>

//           <Button
//             type="button"
//             size="icon"
//             onClick={handleSendAudio}
//             title="Send audio"
//             disabled={isRecording}
//             className={`!text-white hover:!opacity-90 ${
//               isRecording ? "!bg-red-600" : "!bg-black"
//             }`}
//           >
//             <Send className="h-4 w-4 text-white" />
//           </Button>

//           <audio ref={audioPlayerRef} style={{ display: "none" }} />
//         </>
//       )}
//     </div>
//   );
// };

// export default AudioControls;




/// added feature like loading symbols ....

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Send,
  Trash2,
} from "lucide-react";
import { RingLoader } from "react-spinners"; // Importing a loading spinner

const AudioControls = ({ onTranscription, setIsProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioPlayerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false); // Track processing state

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else if (mediaRecorder) {
      mediaRecorder.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        recorder.start();

        const chunks = [];
        recorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };

        recorder.onstop = () => {
          const audio = new Blob(chunks, { type: "audio/webm" });
          setAudioBlob(audio);
        };
      })
      .catch((error) => {
        console.error("Error accessing audio: ", error);
        setIsRecording(false);
      });
  };

  const handleSendAudio = () => {
    if (audioBlob) {
      setIsProcessingAudio(true); // Set processing to true to show loading spinner
      sendAudioToBackend(audioBlob);
      setAudioBlob(null);
    } else {
      console.error("No audio recorded to send.");
    }
  };

  const sendAudioToBackend = (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "audio.webm");

    fetch("http://localhost:5000/api/convert-audio", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        onTranscription(data.transcription);
        setIsProcessingAudio(false); // Hide loading spinner once transcription is done
        console.log("Audio processed");
      })
      .catch((error) => {
        console.error("Error sending audio to backend", error);
        setIsProcessingAudio(false); // Hide spinner in case of error
      });
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = "";
    }
    console.log("Recording discarded.");
  };

  const playRecording = () => {
    if (audioBlob && audioPlayerRef.current) {
      const url = URL.createObjectURL(audioBlob);
      audioPlayerRef.current.src = url;

      if (isPlaying) {
        audioPlayerRef.current.pause();
        setIsPlaying(false);
      } else {
        audioPlayerRef.current.play();
        setIsPlaying(true);
        audioPlayerRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        };
      }
    } else {
      console.error("No audio to play.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="icon"
        onClick={() => setIsRecording(!isRecording)}
        title={isRecording ? "Stop recording" : "Start recording"}
        className={`!text-white hover:!opacity-90 ${
          isRecording ? "!bg-red-600" : "!bg-black"
        }`}
      >
        {isRecording ? (
          <Mic className="h-4 w-4 animate-pulse text-white" />
        ) : (
          <MicOff className="h-4 w-4 text-white" />
        )}
      </Button>

      {audioBlob && (
        <>
          <Button
            type="button"
            size="icon"
            onClick={playRecording}
            title={isPlaying ? "Pause playback" : "Play recording"}
            className={`!text-white hover:!opacity-90 ${
              isPlaying ? "!bg-red-600" : "!bg-black"
            }`}
            disabled={isRecording || isProcessingAudio} // Disable button while processing
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </Button>

          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={discardRecording}
            title="Discard recording"
            disabled={isRecording || isProcessingAudio} // Disable button while processing
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            onClick={handleSendAudio}
            title="Send audio"
            disabled={isRecording || isProcessingAudio} // Disable button while processing
            className={`!text-white hover:!opacity-90 ${
              isRecording || isProcessingAudio ? "!bg-gray-500" : "!bg-black"
            }`}
          >
            {isProcessingAudio ? (
              <RingLoader color="#fff" size={24} /> // Show loading spinner while processing
            ) : (
              <Send className="h-4 w-4 text-white" />
            )}
          </Button>

          <audio ref={audioPlayerRef} style={{ display: "none" }} />
        </>
      )}

{isProcessingAudio && (
  <div className="text-sm text-gray-500 ml-2 animate-pulse">
    Processing audio...
  </div>
)}

    </div>
  );
};

export default AudioControls;

