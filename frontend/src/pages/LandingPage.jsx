import React, { useEffect, useRef, useState } from 'react';
import HeroSection from '../components/landing/HeroSection';
import LogoMarquee from '../components/landing/LogoMarquee';
import FeatureCards from '../components/landing/FeatureCards';
import CodeShowcase from '../components/landing/CodeShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import ComponentGrid from '../components/landing/ComponentGrid';
import AIIntegration from '../components/landing/AIIntegration';
import CTAFooter from '../components/landing/CTAFooter';

const LandingPage = () => {
  useEffect(() => {
    // Scroll-triggered animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page bg-[#050505] text-white min-h-screen overflow-hidden">
      {/* Subtle grid background */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
      
      <HeroSection />
      <LogoMarquee />
      <FeatureCards />
      <CodeShowcase />
      <HowItWorks />
      <ComponentGrid />
      <AIIntegration />
      <CTAFooter />
    </div>
  );
};

export default LandingPage;
