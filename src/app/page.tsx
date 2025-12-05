"use client";

import SplitText from "@/components/ui/split-text";
import { WaitlistForm } from "@/components/waitlist-form";
import { Counter } from "@/components/counter";
import * as motion from "motion/react-client";
import { ShieldCheck, Heart, Target, Zap, Infinity, Sparkles, Repeat, TrendingUp } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-white dark:bg-black">
      {/* Subtle Background Gradient - Apple style */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white via-white to-neutral-50/50 dark:from-black dark:via-black dark:to-neutral-950/50" />
      
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 py-32 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          {/* Badge - Apple style pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 flex justify-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100/80 px-5 py-2 text-sm backdrop-blur-xl dark:bg-neutral-900/80">
              <Repeat className="size-3.5 text-neutral-600 dark:text-neutral-400" />
              <span className="text-neutral-600 dark:text-neutral-400">
                Syclar — Work in cycles. Build momentum. Never stop.
              </span>
            </div>
          </motion.div>

          {/* Main Headline - Apple's large, bold typography */}
          <div className="mb-8 space-y-6 text-center">
            <SplitText className="text-6xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-7xl md:text-8xl lg:text-9xl">
              Syclar
            </SplitText>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-3xl text-2xl font-light leading-relaxed text-neutral-600 sm:text-3xl md:text-4xl dark:text-neutral-400"
            >
              Do as many cycles of work as possible. Work nonstop. Generate momentum. Never stop.
            </motion.p>
          </div>

          {/* Subheadline - Apple's subtle description */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 text-center"
          >
            <p className="mx-auto max-w-2xl text-lg font-light leading-relaxed text-neutral-500 sm:text-xl dark:text-neutral-500">
              Complete cycles. Start the next one immediately. Build unstoppable momentum through continuous work cycles. Keep going. Never stop.
            </p>
          </motion.div>

          {/* Waitlist Form - Centered, Apple style */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 flex justify-center"
          >
            <WaitlistForm />
          </motion.div>

          {/* Counter - Subtle, Apple style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <Counter />
          </motion.div>
        </div>
      </section>

      {/* Features Section - Apple's clean grid */}
      <section className="relative bg-neutral-50/50 py-32 dark:bg-neutral-950/50">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 text-center"
          >
            <h2 className="mb-4 text-5xl font-semibold leading-tight tracking-[-0.02em] sm:text-6xl md:text-7xl">
              How it works
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl font-light text-neutral-600 dark:text-neutral-400">
              Continuous cycles. Unstoppable momentum. Work nonstop.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Repeat,
                title: "Work Cycles",
                description: "Complete cycles of work. Finish one, immediately start the next. Build momentum through continuous cycles.",
              },
              {
                icon: TrendingUp,
                title: "Generate Momentum",
                description: "Work nonstop to build unstoppable momentum. Each cycle compounds into the next. Never stop.",
              },
              {
                icon: Zap,
                title: "Maximum Cycles",
                description: "Do as many cycles as possible. Track your cycle count. Push for more. Build velocity through repetition.",
              },
              {
                icon: Target,
                title: "Cycle Focus",
                description: "Each cycle has a clear goal. Complete it. Move to the next. No breaks. No stopping. Just cycles.",
              },
              {
                icon: Infinity,
                title: "Never Stop",
                description: "The goal is continuous work. No downtime. No pauses. Just cycle after cycle building momentum.",
              },
              {
                icon: Sparkles,
                title: "Momentum Building",
                description: "Watch your momentum grow with each completed cycle. The more cycles, the stronger the momentum.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="group relative rounded-3xl bg-white/80 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:hover:shadow-black/50"
              >
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-colors duration-500 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700">
                  <feature.icon className="size-7 text-neutral-900 dark:text-neutral-100" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Apple's final call to action */}
      <section className="relative bg-white py-32 dark:bg-black">
        <div className="mx-auto max-w-4xl px-6 text-center sm:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-10"
          >
            <div>
              <h2 className="mb-6 text-5xl font-semibold leading-tight tracking-[-0.02em] sm:text-6xl md:text-7xl">
                Ready to build momentum?
              </h2>
              <p className="mx-auto max-w-2xl text-xl font-light text-neutral-600 dark:text-neutral-400">
                Join the waitlist and start working in cycles. Build unstoppable momentum. Never stop.
              </p>
            </div>
            <div className="flex justify-center">
              <WaitlistForm />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
