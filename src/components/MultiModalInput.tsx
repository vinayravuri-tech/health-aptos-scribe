
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Image, Loader, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MultiModalInputProps {
  onImageCapture: (imageData: string) => void;
  onVoiceCapture: (transcript: string) => void;
  isLoading: boolean;
}

const MultiModalInput: React.FC<MultiModalInputProps> = ({
  onImageCapture,
  onVoiceCapture,
  isLoading
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Image capture functions
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      onImageCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/png');
      onImageCapture(imageData);
      closeCamera();
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Mock transcription service - in a real app, you would send this to a speech-to-text API
        setTimeout(() => {
          toast({
            title: "Voice Processed",
            description: "Your voice message has been transcribed."
          });
          onVoiceCapture("I'm experiencing headache and fever for the past two days.");
        }, 1000);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = window.setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        
        // Auto-stop after 30 seconds
        if (seconds >= 30) {
          stopRecording();
        }
      }, 1000);

    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setRecordingTime(0);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {isCameraOpen && (
        <div className="mb-4 relative bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-[300px] object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
            <Button onClick={captureImage} className="bg-green-500 hover:bg-green-600">
              Capture
            </Button>
            <Button onClick={closeCamera} variant="destructive">
              Cancel
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="outline"
          className="gap-2"
          disabled={isLoading || isRecording}
        >
          <Image className="h-4 w-4" />
          Upload Image
        </Button>
        
        <Button
          onClick={openCamera}
          variant="outline"
          className="gap-2"
          disabled={isLoading || isRecording || isCameraOpen}
        >
          <Camera className="h-4 w-4" />
          Take Photo
        </Button>
        
        {!isRecording ? (
          <Button
            onClick={startRecording}
            variant="outline"
            className="gap-2"
            disabled={isLoading || isCameraOpen}
          >
            <Mic className="h-4 w-4" />
            Voice Input
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="gap-2 animate-pulse"
          >
            <MicOff className="h-4 w-4" />
            Stop Recording ({formatTime(recordingTime)})
          </Button>
        )}
        
        {isLoading && (
          <div className="flex items-center text-sm text-gray-500 ml-2">
            <Loader className="h-4 w-4 animate-spin mr-2" />
            Processing...
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiModalInput;
