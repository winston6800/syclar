"use client";

import { useState, useEffect, useRef } from "react";
import type { Pillar, DailyGoal } from "@/components/voice-coach/types";
import { PillarDisplay } from "@/components/voice-coach/pillar-display";
import { DailyGoalCard } from "@/components/voice-coach/daily-goal-card";
import { VoiceControls } from "@/components/voice-coach/voice-controls";
import { TranscriptDisplay } from "@/components/voice-coach/transcript-display";

export default function VoiceCoachPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const [pillars, setPillars] = useState<{
    pillar1: Pillar | null;
    pillar2: Pillar | null;
  }>({
    pillar1: null,
    pillar2: null,
  });
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [goalCompleted, setGoalCompleted] = useState(false);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && dailyGoal) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTimerRunning, dailyGoal]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const aiResponse = processInput(text);
        setResponse(aiResponse);
        speak(aiResponse);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-generate daily goal when pillars are set
  useEffect(() => {
    if (pillars.pillar1 && pillars.pillar2 && !dailyGoal && !goalCompleted) {
      const priorityPillar = getPriorityPillar();
      if (!priorityPillar) return;

      const goalDescriptions = [
        `Make progress on ${priorityPillar.description}`,
        `Complete one task related to ${priorityPillar.description}`,
        `Take the next step on ${priorityPillar.description}`,
        `Move forward with ${priorityPillar.description}`,
      ];

      const randomGoal = goalDescriptions[Math.floor(Math.random() * goalDescriptions.length)];
      const estimatedMinutes = 30 + Math.floor(Math.random() * 90);

      const newGoal: DailyGoal = {
        id: Date.now().toString(),
        description: randomGoal,
        pillarId: priorityPillar.id,
        estimatedMinutes,
        createdAt: new Date(),
      };

      setDailyGoal(newGoal);
      setTimer(0);
      setIsTimerRunning(true);
      setGoalCompleted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pillars.pillar1, pillars.pillar2]);

  const extractPillar = (input: string): string => {
    return input
      .replace(/pillar\s*[12]/i, "")
      .replace(/thing\s*[12]/i, "")
      .replace(/^(is|are|to)\s+/i, "")
      .trim();
  };

  const getPriorityPillar = (): Pillar | null => {
    if (!pillars.pillar1 && !pillars.pillar2) return null;
    if (!pillars.pillar1) return pillars.pillar2;
    if (!pillars.pillar2) return pillars.pillar1;
    return pillars.pillar1;
  };

  const processInput = (input: string): string => {
    const lowerInput = input.toLowerCase();

    // Set Pillar 1
    if (lowerInput.includes("pillar 1") || lowerInput.includes("thing 1") || lowerInput.includes("first")) {
      const pillar = extractPillar(input);
      setPillars((prev) => ({
        ...prev,
        pillar1: {
          id: "1",
          description: pillar,
        },
      }));
      return `Got it. Pillar 1: ${pillar}`;
    }

    // Set Pillar 2
    if (lowerInput.includes("pillar 2") || lowerInput.includes("thing 2") || lowerInput.includes("second")) {
      const pillar = extractPillar(input);
      setPillars((prev) => ({
        ...prev,
        pillar2: {
          id: "2",
          description: pillar,
        },
      }));
      return `Got it. Pillar 2: ${pillar}`;
    }

    // Complete goal
    if (
      lowerInput.includes("done") ||
      lowerInput.includes("completed") ||
      lowerInput.includes("finished") ||
      lowerInput.includes("complete")
    ) {
      if (dailyGoal && !goalCompleted) {
        setIsTimerRunning(false);
        setGoalCompleted(true);
        const minutes = Math.floor(timer / 60);
        return `Great job! You completed it in ${minutes} minutes. Want a new goal?`;
      }
      return "You don't have an active goal right now.";
    }

    // Get new goal
    if (
      lowerInput.includes("new goal") ||
      lowerInput.includes("give me a goal") ||
      lowerInput.includes("what should i do")
    ) {
      if (!pillars.pillar1 || !pillars.pillar2) {
        return "Set your 2 pillars first, then I'll give you a goal.";
      }
      const priorityPillar = getPriorityPillar();
      if (!priorityPillar) return "Set your pillars first.";

      const goalDescriptions = [
        `Make progress on ${priorityPillar.description}`,
        `Complete one task related to ${priorityPillar.description}`,
        `Take the next step on ${priorityPillar.description}`,
        `Move forward with ${priorityPillar.description}`,
      ];

      const randomGoal = goalDescriptions[Math.floor(Math.random() * goalDescriptions.length)];
      const estimatedMinutes = 30 + Math.floor(Math.random() * 90);

      const newGoal: DailyGoal = {
        id: Date.now().toString(),
        description: randomGoal,
        pillarId: priorityPillar.id,
        estimatedMinutes,
        createdAt: new Date(),
      };

      setDailyGoal(newGoal);
      setTimer(0);
      setIsTimerRunning(true);
      setGoalCompleted(false);
      
      return `Your daily goal: ${newGoal.description}. Timer started. Get it done ASAP!`;
    }

    // Check status
    if (lowerInput.includes("status") || lowerInput.includes("how") || lowerInput.includes("what")) {
      if (!pillars.pillar1 || !pillars.pillar2) {
        return "Set your 2 pillars first.";
      }
      if (dailyGoal && !goalCompleted) {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `Current goal: ${dailyGoal.description}. Timer: ${minutes}m ${seconds}s. Keep going!`;
      }
      if (goalCompleted) {
        return "Goal completed! Say 'new goal' for another one.";
      }
      return "No active goal. Say 'new goal' to get started.";
    }

    // Default response
    if (!pillars.pillar1 || !pillars.pillar2) {
      return "What are your 2 pillars to focus on?";
    }
    if (!dailyGoal) {
      return "Say 'new goal' to get your daily goal and start the timer.";
    }
    return `Focus on: ${dailyGoal.description}. Timer is running. Get it done!`;
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      if (synthRef.current) {
        synthRef.current.cancel();
        setIsSpeaking(false);
      }
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthRef.current.speak(utterance);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const priorityPillar = getPriorityPillar();

  return (
    <div className="min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-white to-neutral-50/50 dark:from-black dark:via-black dark:to-neutral-950/50" />
      
      <div className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-6xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-7xl md:text-8xl">
              Voice Coach
            </h1>
            <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-neutral-600 dark:text-neutral-400">
              Set 2 pillars. Get a daily goal. Do it ASAP.
            </p>
          </div>

          {!isSpeechSupported && (
            <div className="mb-8 rounded-full bg-yellow-50/80 px-5 py-2.5 text-center text-sm backdrop-blur-xl dark:bg-yellow-900/20">
              <p className="text-yellow-800 dark:text-yellow-200">
                ⚠️ Speech recognition not supported. Please use Chrome or Edge.
              </p>
            </div>
          )}

          {/* Pillars Display */}
          <PillarDisplay
            pillar1={pillars.pillar1}
            pillar2={pillars.pillar2}
            priorityPillarId={priorityPillar?.id || null}
            onPillar1Change={(pillar) => setPillars((prev) => ({ ...prev, pillar1: pillar }))}
            onPillar2Change={(pillar) => setPillars((prev) => ({ ...prev, pillar2: pillar }))}
          />

          {/* Daily Goal & Timer */}
          <DailyGoalCard
            goal={dailyGoal}
            timer={timer}
            isTimerRunning={isTimerRunning}
            goalCompleted={goalCompleted}
            formatTime={formatTime}
          />

          {/* Voice Controls */}
          <VoiceControls
            isListening={isListening}
            isSpeaking={isSpeaking}
            isSpeechSupported={isSpeechSupported}
            onStartListening={startListening}
            onStopListening={stopListening}
          />

          {/* Transcript & Response */}
          <TranscriptDisplay transcript={transcript} response={response} />

          {/* Quick Test Phrases */}
          <div className="rounded-3xl bg-white/80 p-8 backdrop-blur-xl dark:bg-neutral-900/80">
            <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
              Try saying
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "Pillar 1 is ship the feature",
                "Pillar 2 is hire a designer",
                "New goal",
                "Done",
                "Status",
              ].map((phrase) => (
                <button
                  key={phrase}
                  onClick={() => {
                    setTranscript(phrase);
                    const aiResponse = processInput(phrase);
                    setResponse(aiResponse);
                    speak(aiResponse);
                  }}
                  className="rounded-full border border-neutral-200 bg-white/80 px-4 py-2 text-sm font-medium backdrop-blur-xl transition-all hover:bg-white hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
                >
                  {phrase}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
