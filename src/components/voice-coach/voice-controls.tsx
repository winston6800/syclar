"use client";

import { Mic, MicOff, Volume2 } from "lucide-react";

type VoiceControlsProps = {
  isListening: boolean;
  isSpeaking: boolean;
  isSpeechSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
};

export function VoiceControls({
  isListening,
  isSpeaking,
  isSpeechSupported,
  onStartListening,
  onStopListening,
}: VoiceControlsProps) {
  return (
    <div className="mb-12 flex flex-col items-center gap-6">
      <button
        onClick={onStartListening}
        disabled={!isSpeechSupported || isListening}
        className={`group flex items-center gap-3 rounded-full px-8 py-4 text-lg font-medium transition-all duration-300 ${
          isListening
            ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
            : "bg-black text-white shadow-lg shadow-black/10 hover:bg-neutral-800 hover:shadow-xl dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isListening ? (
          <>
            <MicOff className="w-6 h-6" />
            Listening...
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            Start Listening
          </>
        )}
      </button>

      {isListening && (
        <button
          onClick={onStopListening}
          className="rounded-full border border-neutral-300 bg-white/80 px-6 py-2.5 text-sm font-medium backdrop-blur-xl transition-all hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/80 dark:hover:bg-neutral-900"
        >
          Stop
        </button>
      )}

      {isSpeaking && (
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <Volume2 className="w-4 h-4" />
          <span>Speaking...</span>
        </div>
      )}
    </div>
  );
}


