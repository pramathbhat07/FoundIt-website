import React from "react";
import { Target, Users, BookOpen } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 bg-white dark:bg-transparent relative overflow-hidden">
      {/* Subtle top border for separation */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-4">
            About This Initiative
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Bridging the gap between lost belongings and their rightful owners
            through an intuitive, campus-wide digital ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-3xl p-8 relative group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl dark:hover:bg-gray-700">
            <div className="w-12 h-12 bg-indigo-600 text-white dark:bg-indigo-100 text-indigo-400 dark:text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Our Purpose
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              To cultivate a trustworthy community network where recovering lost
              items is no longer a stressful ordeal, but a seamless and
              collaborative experience for every student and staff member.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 relative group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl dark:hover:bg-gray-700">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              The Problem Solved
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              We replace scattered bulletin boards and fragmented social media
              posts with a centralized, intelligent hub, streamlining the
              reporting and discovery process with smart matching.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 relative group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl dark:hover:bg-gray-700">
            <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-active:scale-95 transition-transform duration-300 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Who Built It
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
              Conceived and crafted as a First-Year Engineering Project. This
              platform reflects a dedication to applying modern web technologies
              to forge meaningful solutions for genuine campus challenges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
