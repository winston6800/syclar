"use client";

type TranscriptDisplayProps = {
  transcript: string;
  response: string;
};

export function TranscriptDisplay({ transcript, response }: TranscriptDisplayProps) {
  return (
    <div className="mb-12 grid gap-6 sm:grid-cols-2">
      <div className="rounded-3xl bg-white/80 p-6 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:hover:shadow-black/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          You said
        </h3>
        <div className="min-h-[80px] text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
          {transcript || (
            <span className="text-neutral-400 italic">No input yet...</span>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white/80 p-6 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:hover:shadow-black/50">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          AI Response
        </h3>
        <div className="min-h-[80px] text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
          {response || (
            <span className="text-neutral-400 italic">
              Click "Start Listening" and say something...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


