// @ts-nocheck
import type React from "react";
import FlowingMenu from "../../fixtures/FlowingMenu";

const Example: React.FC = () => {
  const menuItems = [
    {
      link: "/home",
      text: "Home",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    },
    {
      link: "/about",
      text: "About",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    },
    {
      link: "/services",
      text: "Services",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      link: "/portfolio",
      text: "Portfolio",
      image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
    },
    {
      link: "/contact",
      text: "Contact",
      image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6b725?w=400&h=300&fit=crop",
    },
  ];

  return (
    <div className="w-full h-screen">
      <FlowingMenu
        items={menuItems}
        speed={12}
        textColor="#ffffff"
        bgColor="#0a0a0a"
        marqueeBgColor="#ffffff"
        marqueeTextColor="#0a0a0a"
        borderColor="#333333"
      />
    </div>
  );
};

export default Example;
