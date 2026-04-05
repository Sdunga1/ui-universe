// @ts-nocheck
import type React from "react";
import FlowingMenu from "../../fixtures/FlowingMenu"; // Adjust the import path as necessary

const Example: React.FC = () => {
  const menuItems = [
    {
      link: "#home",
      text: "Home",
      image:
        "https://images.unsplash.com/photo-1488998427799-dfd1ee3914be?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      link: "#projects",
      text: "Projects",
      image:
        "https://images.unsplash.com/photo-1497032628154-7f4159511674?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      link: "#team",
      text: "Our Team",
      image:
        "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      link: "#contact",
      text: "Contact Us",
      image:
        "https://images.unsplash.com/photo-1544717305-278252277872?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      link: "#blog",
      text: "Blog",
      image:
        "https://images.unsplash.com/photo-1510519138101-570d1dca3d66?q=80&w=2911&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-8">
      <div className="w-full max-w-6xl h-[70vh] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
        <FlowingMenu
          items={menuItems}
          speed={20} // Slower marquee animation
          textColor="#f0f0f0" // Light grey for main text
          bgColor="#0c0c0c" // Deep dark background
          marqueeBgColor="#8a2be2" // Blue Violet for the marquee background on hover
          marqueeTextColor="#ffffff" // White text for the marquee
          borderColor="#444444" // Subtle border color between items
        />
      </div>
    </div>
  );
};

export default Example;
