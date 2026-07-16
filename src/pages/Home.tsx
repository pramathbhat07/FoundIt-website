import React from "react";
import { HeroSection } from "../components/home/HeroSection";
import { AboutSection } from "../components/home/AboutSection";
import { BMSInfoSection } from "../components/home/BMSInfoSection";
import { RecentItemsSection } from "../components/home/RecentItemsSection";
import { CategoriesSection } from "../components/home/CategoriesSection";
import { HowItWorksSection } from "../components/home/HowItWorksSection";
import { CampusLocationsSection } from "../components/home/CampusLocationsSection";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <AboutSection />
      <BMSInfoSection />
      <RecentItemsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <CampusLocationsSection />
    </main>
  );
}
