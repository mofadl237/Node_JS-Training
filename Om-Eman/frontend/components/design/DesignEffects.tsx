"use client";

import { BackToTop } from "@/components/Animation/BackToTop";
import { ScrollProgressBar } from "@/components/Animation/ScrollProgressBar";

// Scroll effects mounted on /design only (D1) — the owner sees the scroll
// progress bar and the back-to-top button live here. Site-wide mounting is a
// later decision.
export const DesignEffects = () => (
  <>
    <ScrollProgressBar />
    <BackToTop />
  </>
);
