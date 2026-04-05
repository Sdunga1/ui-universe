import FlowingMenu from "../../fixtures/FlowingMenu"; // Assuming FlowingMenu.jsx or FlowingMenu.tsx is in the same directory

const menuItems = [
  { link: "#home", text: "Home", image: "https://picsum.photos/600/400?random=101" },
  { link: "#about", text: "About Us", image: "https://picsum.photos/600/400?random=102" },
  { link: "#services", text: "Services", image: "https://picsum.photos/600/400?random=103" },
  { link: "#portfolio", text: "Portfolio", image: "https://picsum.photos/600/400?random=104" },
  { link: "#contact", text: "Contact", image: "https://picsum.photos/600/400?random=105" },
];

export default function Example() {
  return (
    <div style={{ height: "600px", position: "relative", border: "1px solid #ccc" }}>
      {/* 
        The FlowingMenu component must be inside a container with an explicit height 
        (e.g., h-[600px] or h-screen in Tailwind CSS, or style={{ height: '600px' }}).
        
        Using default props provided by FlowingMenu itself, 
        we only need to pass the required `items` prop.
        However, for demonstration, some props are explicitly set below.
      */}
      <FlowingMenu
        items={menuItems}
        speed={18} // Slightly slower than default 15 for a smoother feel
        textColor="#E0E0E0" // Light grey for menu items
        bgColor="#1a1a2e" // Dark blue background for the entire menu
        marqueeBgColor="#FFFFFF" // White background for the marquee
        marqueeTextColor="#1a1a2e" // Dark blue text inside the marquee
        borderColor="#6C5B7B" // A subtle purple border between items
      />
    </div>
  );
}
