import InfiniteMenu from "../../fixtures/InfiniteMenu";

export default function Example() {
  const menuItems = [
    {
      image: "https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400&h=300&fit=crop",
      link: "/products",
      title: "Products",
      description: "Explore our latest product offerings",
    },
    {
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      link: "/services",
      title: "Services",
      description: "Professional services tailored to your needs",
    },
    {
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      link: "/about",
      title: "About Us",
      description: "Learn more about our company and mission",
    },
    {
      image: "https://images.unsplash.com/photo-1486312338219-ce68e2c6462b?w=400&h=300&fit=crop",
      link: "/contact",
      title: "Contact",
      description: "Get in touch with our team",
    },
    {
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
      link: "/analytics",
      title: "Analytics",
      description: "Data-driven insights and reporting",
    },
    {
      image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop",
      link: "/blog",
      title: "Blog",
      description: "Latest news and industry insights",
    },
  ];

  return (
    <div
      style={{
        height: "600px",
        position: "relative",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <InfiniteMenu items={menuItems} scale={1} />
    </div>
  );
}
