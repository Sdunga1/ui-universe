import type React from "react";
import InfiniteMenu from "../../fixtures/InfiniteMenu"; // Adjust the path as necessary

// Define the MenuItem interface as it's used internally by InfiniteMenu
interface MenuItem {
  image: string;
  link: string;
  title: string;
  description: string;
}

const Example: React.FC = () => {
  // Example data for the InfiniteMenu
  const menuItems: MenuItem[] = [
    {
      image:
        "https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      link: "https://unsplash.com/photos/a-man-standing-in-a-field-of-wheat-542435503",
      title: "Golden Fields",
      description: "Vast landscapes under a warm sky.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1579547622941-e94553259e51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "https://unsplash.com/photos/a-close-up-of-a-colorful-abstract-painting-W6Q4r0R9MhA",
      title: "Abstract Dreams",
      description: "A vibrant blend of colors and shapes.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1502691523177-3e6e6659ee7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "https://unsplash.com/photos/a-close-up-of-a-bird-on-a-branch-F7s90MvQ0J4",
      title: "Forest Whisper",
      description: "Nature's delicate balance in focus.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "https://unsplash.com/photos/a-laptop-and-coffee-on-a-desk-eCktzGjC-iE",
      title: "Coding Journey",
      description: "The digital realm awaits exploration.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1533109721021-36a5b82c8969?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1968&q=80",
      link: "https://unsplash.com/photos/a-person-standing-on-a-rocky-shore-LBI7Vv6nE2Y",
      title: "Ocean's Call",
      description: "Waves crashing against rugged shores.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1601758532463-71a25ed0b8b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80",
      link: "https://unsplash.com/photos/a-person-walking-down-a-street-with-a-red-umbrella-S1nB7k-3wA4",
      title: "City Lights",
      description: "The bustling energy of urban life.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1549419163-f27357c3e536?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "https://unsplash.com/photos/a-woman-standing-in-front-of-a-mountain-range-i-1jD6qXF3A",
      title: "Mountain Peaks",
      description: "Majestic views from the world's roof.",
    },
    {
      image:
        "https://images.unsplash.com/photo-1550995640-c36142718107?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      link: "https://unsplash.com/photos/a-person-standing-in-a-forest-with-a-camera-r7bA4g-V2kE",
      title: "Deep Forest",
      description: "Enchanting paths hidden among trees.",
    },
  ];

  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-900 text-white">
      {/* The parent div for InfiniteMenu needs to have defined dimensions */}
      <div className="w-[80vw] h-[80vh] relative">
        <InfiniteMenu
          items={menuItems}
          scale={0.8} // Adjust the scale to make the menu larger or smaller
        />
      </div>
    </div>
  );
};

export default Example;
