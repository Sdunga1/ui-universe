// @ts-nocheck
import InfiniteMenu from "../../fixtures/InfiniteMenu"; // Assuming InfiniteMenu.jsx or InfiniteMenu.tsx is in the same directory

const Example = () => {
  const exampleItems = [
    {
      image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Product+A",
      link: "/products/product-a",
      title: "Product Alpha",
      description: "Discover the revolutionary features of Product Alpha.",
    },
    {
      image: "https://via.placeholder.com/150/33FF57/000000?text=Service+B",
      link: "/services/service-b",
      title: "Service Beta",
      description: "Experience unparalleled support with Service Beta.",
    },
    {
      image: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Project+C",
      link: "/projects/project-c",
      title: "Project Gamma",
      description: "Explore our latest innovation in Project Gamma.",
    },
    {
      image: "https://via.placeholder.com/150/FFFF33/000000?text=Solution+D",
      link: "/solutions/solution-d",
      title: "Solution Delta",
      description: "Custom-tailored solutions for your business needs.",
    },
    {
      image: "https://via.placeholder.com/150/FF33FF/FFFFFF?text=Innovation+E",
      link: "/innovation/innovation-e",
      title: "Innovation Epsilon",
      description: "Pushing boundaries with cutting-edge technology.",
    },
    {
      image: "https://via.placeholder.com/150/33FFFF/000000?text=Feature+F",
      link: "/features/feature-f",
      title: "Feature Zeta",
      description: "Unlocking new possibilities with powerful features.",
    },
    {
      image: "https://via.placeholder.com/150/FFA500/FFFFFF?text=Concept+G",
      link: "/concepts/concept-g",
      title: "Concept Eta",
      description: "A glimpse into the future of design.",
    },
    {
      image: "https://via.placeholder.com/150/8A2BE2/FFFFFF?text=Experience+H",
      link: "/experiences/experience-h",
      title: "Experience Theta",
      description: "Immersive experiences crafted for you.",
    },
  ];

  return (
    <div style={{ height: "600px", position: "relative", width: "100%" }}>
      <InfiniteMenu items={exampleItems} />
    </div>
  );
};

export default Example;
