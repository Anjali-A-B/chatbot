

// Send the text message to your backend and receive a "received" response
export const sendMessageToAPI = async (message) => {
  try {
    const response = await fetch("http://localhost:5000/api/text-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    return {
      content: data.reply, // should be "received"
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error calling chat API:", error);
    return {
      content: "Error: Could not reach the server.",
      timestamp: new Date().toISOString(),
    };
  }
};

// Function to handle audio playback of messages
export const speakMessage = (message, isMuted) => {
  if (isMuted || !message || !window.speechSynthesis) return;

  const speech = new SpeechSynthesisUtterance(message);
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;

  window.speechSynthesis.speak(speech);
};

// Cancel any ongoing speech
export const cancelSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};


