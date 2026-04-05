import type React from "react";
import InfiniteMenu from "../../fixtures/InfiniteMenu";

const Example: React.FC = () => {
  const menuItems = [
    {
      image: "https://picsum.photos/900/900?random=1",
      link: "https://github.com",
      title: "GitHub",
      description: "Where the world builds software",
    },
    {
      image: "https://picsum.photos/900/900?random=2",
      link: "https://dribbble.com",
      title: "Dribbble",
      description: "Discover the world's top designers",
    },
    {
      image: "https://picsum.photos/900/900?random=3",
      link: "https://behance.net",
      title: "Behance",
      description: "Creative portfolios and projects",
    },
    {
      image: "https://picsum.photos/900/900?random=4",
      link: "https://figma.com",
      title: "Figma",
      description: "Collaborative design tool",
    },
    {
      image: "https://picsum.photos/900/900?random=5",
      link: "https://stackoverflow.com",
      title: "Stack Overflow",
      description: "Developer Q&A community",
    },
    {
      image: "https://picsum.photos/900/900?random=6",
      link: "https://codepen.io",
      title: "CodePen",
      description: "Front-end developer playground",
    },
    {
      image: "https://picsum.photos/900/900?random=7",
      link: "https://medium.com",
      title: "Medium",
      description: "Stories and ideas worth reading",
    },
    {
      image: "https://picsum.photos/900/900?random=8",
      link: "https://dev.to",
      title: "DEV Community",
      description: "Where programmers share ideas",
    },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <InfiniteMenu items={menuItems} scale={1.2} />
    </div>
  );
};

export default Example;
