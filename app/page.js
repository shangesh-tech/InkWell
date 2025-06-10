import BlogList from "@/components/BlogList";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="px-10">
      <Hero />
      <BlogList />
    </div>
  );
}
