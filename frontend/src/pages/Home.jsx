import Navbar from "../components/Navbar";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-blue-100">
      <Navbar />
      <Hero />
    </div>
  );
}