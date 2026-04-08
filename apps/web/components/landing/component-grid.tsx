"use client";

import { useState } from "react";

const componentDemos = [
  {
    name: "Animated Heroes",
    type: "gradient",
    content: "linear-gradient(135deg, #ee502c 0%, #ff6b4a 100%)",
  },
  { name: "Text Animations", type: "text-animate", content: "Hello World" },
  { name: "Card Stacks", type: "card-stack" },
  { name: "Pulse Effects", type: "pulse-ring" },
  { name: "Parallax Layers", type: "parallax-layers" },
  { name: "Grid Reveals", type: "grid-reveal" },
  { name: "Morphing Shapes", type: "morphing-shape" },
  { name: "Stagger Animations", type: "stagger-bars" },
];

export function ComponentGrid() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="py-32 px-6 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-azeret font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-400">
            25+ components that feel alive
          </h2>
          <p className="text-xl text-[var(--muted)] max-w-2xl mx-auto">
            Every component is designed with motion in mind. Hover to see them in action.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {componentDemos.map((demo, index) => (
            <div
              key={demo.name}
              className="component-demo-card group relative aspect-square rounded-none border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--background)] overflow-hidden cursor-pointer hover:border-[var(--accent)]/50"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 flex items-center justify-center p-6">
                {demo.type === "gradient" && (
                  <div
                    className={`w-full h-full rounded-none transition-all duration-1000 ${hoveredIndex === index ? "scale-110 rotate-6" : "scale-100 rotate-0"}`}
                    style={{
                      background: demo.content,
                      filter: hoveredIndex === index ? "brightness(1.2)" : "brightness(1)",
                    }}
                  />
                )}
                {demo.type === "text-animate" && (
                  <div className="text-center w-full">
                    <h3 className="text-3xl font-azeret font-bold">
                      {(demo.content ?? "").split("").map((char, i) => (
                        <span
                          // biome-ignore lint/suspicious/noArrayIndexKey: static char animation, index is the only stable key
                          key={i}
                          className={`inline-block transition-all duration-500 ${hoveredIndex === index ? "text-[var(--accent)]" : ""}`}
                          style={{
                            transform:
                              hoveredIndex === index
                                ? `translateY(${Math.sin(i * 0.5) * 10}px)`
                                : "translateY(0)",
                            transitionDelay: `${i * 50}ms`,
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </h3>
                  </div>
                )}
                {demo.type === "card-stack" && (
                  <div className="relative w-full h-full">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="absolute inset-0 bg-gradient-to-br from-[var(--border)] to-[var(--card)] rounded-none border border-[#2a2a2a] transition-all duration-700"
                        style={{
                          transform:
                            hoveredIndex === index
                              ? `translateY(${i * -25}px) rotate(${i * 4}deg) scale(${1 - i * 0.05})`
                              : `translateY(${i * 10}px)`,
                          zIndex: 3 - i,
                          opacity: hoveredIndex === index ? 1 - i * 0.2 : 1,
                        }}
                      />
                    ))}
                  </div>
                )}
                {demo.type === "pulse-ring" && (
                  <div className="relative flex items-center justify-center">
                    {hoveredIndex === index && (
                      <>
                        <div className="absolute w-24 h-24 bg-[var(--accent)] animate-ping opacity-75" />
                        <div
                          className="absolute w-24 h-24 bg-[var(--accent)] animate-ping opacity-50"
                          style={{ animationDelay: "0.5s" }}
                        />
                      </>
                    )}
                    <div
                      className="w-24 h-24 bg-[var(--accent)] transition-all duration-500"
                      style={{
                        boxShadow:
                          hoveredIndex === index
                            ? "0 0 60px rgba(238,80,44,0.6)"
                            : "0 0 20px rgba(238,80,44,0.3)",
                      }}
                    />
                  </div>
                )}
                {demo.type === "parallax-layers" && (
                  <div className="relative w-full h-full">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-none transition-all duration-700"
                        style={{
                          background: `linear-gradient(135deg, rgba(238,80,44,${0.4 - i * 0.1}) 0%, transparent 100%)`,
                          transform:
                            hoveredIndex === index
                              ? `translateX(${i * 20}px) translateY(${i * -15}px)`
                              : "translate(0)",
                          transitionDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {demo.type === "grid-reveal" && (
                  <div className="grid grid-cols-3 gap-2 w-full">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: generated grid cells have no other identifier
                        key={i}
                        className="aspect-square bg-[var(--accent)] rounded-none transition-all duration-500"
                        style={{
                          opacity: hoveredIndex === index ? 1 : 0.2,
                          transform:
                            hoveredIndex === index
                              ? "scale(1) rotate(0deg)"
                              : "scale(0.8) rotate(-180deg)",
                          transitionDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {demo.type === "morphing-shape" && (
                  <div
                    className="w-32 h-32 bg-gradient-to-br from-[var(--accent)] to-[#ff6b4a] transition-all duration-1000"
                    style={{
                      borderRadius: hoveredIndex === index ? "50%" : "20%",
                      transform:
                        hoveredIndex === index ? "rotate(180deg) scale(1.1)" : "rotate(0) scale(1)",
                      boxShadow:
                        hoveredIndex === index
                          ? "0 0 60px rgba(238,80,44,0.6)"
                          : "0 0 20px rgba(238,80,44,0.2)",
                    }}
                  />
                )}
                {demo.type === "stagger-bars" && (
                  <div className="flex gap-2 items-end h-32">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 bg-[var(--accent)] rounded-none transition-all duration-700"
                        style={{
                          height: hoveredIndex === index ? `${100 - i * 15}%` : "30%",
                          transitionDelay: `${i * 80}ms`,
                          opacity: hoveredIndex === index ? 1 : 0.5,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent z-20 pointer-events-none">
                <p className="text-sm font-medium text-white group-hover:text-[var(--accent)] transition-colors duration-500">
                  {demo.name}
                </p>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--accent)] opacity-20 blur-[60px]" />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/animations/fade-up"
            className="group relative inline-block px-8 py-4 border-2 border-[var(--accent)] text-[var(--accent)] rounded-none font-medium hover:bg-[var(--accent)] hover:text-white transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(238,80,44,0.4)] overflow-hidden"
          >
            <span className="relative z-10">View All Components</span>
          </a>
        </div>
      </div>
    </section>
  );
}
