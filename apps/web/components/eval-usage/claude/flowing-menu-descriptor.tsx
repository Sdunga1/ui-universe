// @ts-nocheck
import FlowingMenu from "../../fixtures/FlowingMenu";

const items = [
  {
    link: "/destinations/paris",
    text: "Paris",
    image: "https://picsum.photos/600/400?random=1",
  },
  {
    link: "/destinations/tokyo",
    text: "Tokyo",
    image: "https://picsum.photos/600/400?random=2",
  },
  {
    link: "/destinations/new-york",
    text: "New York",
    image: "https://picsum.photos/600/400?random=3",
  },
  {
    link: "/destinations/london",
    text: "London",
    image: "https://picsum.photos/600/400?random=4",
  },
  {
    link: "/destinations/sydney",
    text: "Sydney",
    image: "https://picsum.photos/600/400?random=5",
  },
];

export default function Example() {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <FlowingMenu
        items={items}
        speed={12}
        textColor="#ffffff"
        bgColor="#1a1a2e"
        marqueeBgColor="#ffffff"
        marqueeTextColor="#1a1a2e"
        borderColor="#444"
      />
    </div>
  );
}
