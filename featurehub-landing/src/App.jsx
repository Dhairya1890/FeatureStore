import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhatItSolves from './components/WhatItSolves';
import DemoStrip from './components/DemoStrip';
import NavCards from './components/NavCards';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-surface font-body-md text-body-md text-on-surface flex flex-col selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="w-full pt-16 bg-surface flex-1 max-w-7xl mx-auto px-gutter">
        <div className="flex flex-col w-full relative">
          {/* Ambient Global Glow Layers */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-primary/10 rounded-full blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-[820px] right-4 w-[520px] h-[340px] bg-secondary/5 rounded-full blur-[160px] pointer-events-none -z-10" />
          <div className="absolute top-[1700px] left-10 w-[600px] h-[360px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10" />

          {/* 1. Hero Section */}
          <Hero />

          {/* 2. What It Solves & Architecture Section */}
          <WhatItSolves />

          {/* 3. Live Demo Sandbox */}
          <DemoStrip />

          {/* 4. Live System Nav Cards (Grafana, Docs, Flower, Locust) */}
          <NavCards />

          {/* 5. How It Works / Engineering Decisions */}
          <HowItWorks />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
