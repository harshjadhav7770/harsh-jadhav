"use client";

import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, FileDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function HeroSection({
  profile,
}: {
  profile: any;
  socialLinks?: any[];
}) {
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const words = useMemo(() => {
    return profile?.typingWords?.length
      ? profile.typingWords
      : ["Full-Stack Engineer", "Data Specialist", "Problem Solver"];
  }, [profile?.typingWords]);

  // Typing effect
  useEffect(() => {
    if (!profile?.enableTypingEffect) return;

    const currentWord = words[typingIndex % words.length];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTypingIndex((prev) => prev + 1);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, typingIndex, words, profile?.enableTypingEffect]);

  const showImage = profile?.isHeroImageVisible && profile?.profileImageUrl;
  const imagePosition = profile?.heroImagePosition || "right";

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={`flex flex-col gap-12 items-center ${
            imagePosition === "left"
              ? "lg:flex-row-reverse"
              : imagePosition === "center"
              ? "text-center items-center"
              : "lg:flex-row"
          } justify-between`}
        >
          {/* Animated Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`space-y-6 flex-1 ${imagePosition === "center" ? "max-w-2xl" : ""}`}
          >
            {profile?.availabilityStatus && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.availabilityStatus}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
              >
                Hi, I&apos;m{" "}
                <span className="text-primary">
                  {profile?.name || "Candidate"}
                </span>
              </motion.h1>

              {profile?.enableTypingEffect ? (
                <div className="h-8 sm:h-10 text-xl sm:text-2xl font-bold text-muted-foreground flex items-center gap-1">
                  <span>I build with</span>
                  <span className="text-foreground underline decoration-primary decoration-2 underline-offset-4">
                    {displayText}
                  </span>
                  <span className="w-0.5 h-6 bg-primary animate-pulse ml-0.5" />
                </div>
              ) : (
                <p className="text-xl sm:text-2xl font-semibold text-muted-foreground">
                  {profile?.professionalTitle}
                </p>
              )}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              {profile?.heroIntroduction || profile?.heroHeadline}
            </motion.p>

            {/* CTAs with micro-interactions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button asChild size="lg" className="gap-2 shadow-sm">
                  <Link href="/projects">
                    View Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              {profile?.resumeUrl ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
                      <FileDown className="h-4 w-4" /> Resume
                    </a>
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild variant="outline" size="lg" className="gap-2">
                    <Link href="/contact">Get in Touch</Link>
                  </Button>
                </motion.div>
              )}
            </motion.div>

            {/* Dynamic Highlight Stats with Stagger */}
            {profile?.highlightStats?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t max-w-lg"
              >
                {profile.highlightStats.map((stat: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className="space-y-0.5"
                  >
                    <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Profile Image with Gentle Floating Motion */}
          {showImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.6 },
                scale: { duration: 0.6 },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              className="relative shrink-0 w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden border-4 border-card shadow-xl group"
            >
              <img
                src={profile.profileImageUrl}
                alt={profile.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
