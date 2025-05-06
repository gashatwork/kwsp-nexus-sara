"use client";

import { useState, useEffect } from 'react';
import { Flex, Heading, Button } from '@radix-ui/themes';
import { IconMicrophone, IconMicrophoneFilled } from "@tabler/icons-react";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useSession } from "@/context/SessionContext";
import { toast } from "react-toastify";

interface SpeakPageProps {
  onDone: () => void;
}

export default function SpeakPage({ onDone }: SpeakPageProps) {
  const { isRecording, startRecording, stopRecording, error } = useAudioRecorder();
  const [showVolumeTwo, setShowVolumeTwo] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { session } = useSession(); // Assuming you have a function to set user audio in your session context

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowVolumeTwo(prev => !prev);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSendAudio = async () => {
    const sessionData = localStorage.getItem("voiceNexusSession");
    if (!sessionData) {
      throw new Error("Session data is missing in localStorage");
    }
    const { meetingId, clientId } = JSON.parse(sessionData);


    setIsSending(true);
    try {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        const audiopayload = {
          "audio_base64": audioBlob
        }
        // console.log("Audio Blob:", audioBlob);

        const sttresponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/speech/stt`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(audiopayload)
        });

        console.log("Audio Blob response:", sttresponse);
        const sttData = await sttresponse.json(); // Parse the JSON response
        const usertext = sttData.text; // Extract the "text" attribute

        const payload = {
          user_id: clientId, //session.clientId,
          group_name: meetingId,
          user_qry: usertext
        };
        //   console.log("Audio Payload:", payload);  

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/usermsg`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          toast.error("Failed to send audio");
          console.error(`Failed to send audio: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        console.log("Transcription:", data.status);
        onDone(); // Close the dialog or perform further actions
      }
    } catch (err) {
      toast.error("Error sending audio");
      console.error("Error sending audio:", err);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <Flex direction="column" justify="center" my="6">
      <Flex direction="column">
        <Flex direction="column" align="center" gap="3">
          <Heading size="8">Listening</Heading>
          <div className="relative inline-flex items-center justify-center my-[100px]">
            <div
              className="absolute inline-flex h-32 w-32 rounded-full brand-bg-blue opacity-25 animate-ping"
              style={{ animationDuration: '2s' }}
            ></div>
            <div className="relative">
              {showVolumeTwo ? (
                <IconMicrophone size={96} className="brand-gold" />
              ) : (
                <IconMicrophoneFilled size={96} className="brand-gold" />
              )}
            </div>
          </div>
        </Flex>

        {/* <Button variant="surface" size="4" className="w-full" onClick={onDone}>Send</Button> */}
        <Flex direction="row" gap="4">
          {!isRecording ? (
            <Button variant="solid" size="4" className="w-full" onClick={startRecording}>
              Start Recording
            </Button>
          ) : (
            <Button variant="solid" size="4" className="w-full" onClick={handleSendAudio} disabled={isSending}>
              {isSending ? "Sending..." : "Send"}
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}