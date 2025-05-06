// useAudioRecorder.ts
"use client";

import { useState, useRef, useCallback } from "react";

interface AudioRecorderHook {
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  error: string | null;
}

export function useAudioRecorder(): AudioRecorderHook {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const chunksRef = useRef<ArrayBuffer[]>([]);

  const WAV_SAMPLE_RATE = 16000;
  const WAV_BIT_DEPTH = 16;

  const startRecording = useCallback(async () => {
    try {
      // 1) grab mic (or for system audio, use getDisplayMedia instead)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: false });

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      // 2) create AudioContext @ 16 kHz
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext);
      const audioCtx = new AudioCtx({ sampleRate: WAV_SAMPLE_RATE });
      audioCtxRef.current = audioCtx;

      // 3) hook up stream → ScriptProcessor
      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (evt) => {
        const input = evt.inputBuffer.getChannelData(0);
        // convert floats to 16-bit PCM
        const buf = new ArrayBuffer(input.length * 2);
        const view = new DataView(buf);
        for (let i = 0; i < input.length; i++) {
          const s = Math.max(-1, Math.min(1, input[i]));
          view.setInt16(
            i * 2,
            s < 0 ? s * 0x8000 : s * 0x7fff,
            true
          );
        }
        chunksRef.current.push(buf);
      };

      // must connect to start the chain
      source.connect(processor);
      processor.connect(audioCtx.destination);

      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not start recording. Check permissions and device.");
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!isRecording) return null;

    // tear down AudioGraph
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioCtxRef.current?.close();

    // stop tracks
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);

    // merge all PCM chunks
    const totalLength = chunksRef.current.reduce((sum, b) => sum + b.byteLength, 0);
    const pcmBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const buf of chunksRef.current) {
      pcmBuffer.set(new Uint8Array(buf), offset);
      offset += buf.byteLength;
    }

    // build WAV
    const wavBlob = encodeWAV(pcmBuffer.buffer, WAV_SAMPLE_RATE, WAV_BIT_DEPTH);

    // convert to Base64
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(wavBlob);
    });
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, error };
}

// --- utility to prepend WAV header to PCM16 buffer ---
function encodeWAV(
  pcmBuffer: ArrayBuffer,
  sampleRate: number,
  bitDepth: number
): Blob {
  const numChannels = 1;
  const bytesPerSample = bitDepth / 8;
  const dataLength = pcmBuffer.byteLength;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, "RIFF");
  /* file length */
  view.setUint32(4, 36 + dataLength, true);
  /* RIFF type */
  writeString(view, 8, "WAVE");
  /* format chunk identifier */
  writeString(view, 12, "fmt ");
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, 1, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sampleRate * blockAlign) */
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * bytesPerSample, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, "data");
  /* data chunk length */
  view.setUint32(40, dataLength, true);

  // PCM samples
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmBuffer));
  return new Blob([buffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
