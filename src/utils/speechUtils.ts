
export const speakText = (text: string): void => {
  // Check if the browser supports speech synthesis
  if ('speechSynthesis' in window) {
    // Create a new speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure voice settings
    utterance.lang = 'en-US';
    utterance.volume = 1; // 0 to 1
    utterance.rate = 1; // 0.1 to 10
    utterance.pitch = 1; // 0 to 2
    
    // Optional: Get available voices and set a preferred one
    const voices = window.speechSynthesis.getVoices();
    // Try to find a female voice for medical advice
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google US English Female'));
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    // Speak the text
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Speech synthesis not supported in this browser');
  }
};

// Function to stop speaking
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
