import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";
import Statistics from "@/components/Statistics";
import SpeedMap from "@/components/SpeedMap";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main>
        <HeroSection />
        <Dashboard />
        <Statistics />
        <SpeedMap />
      </main>
      <Footer />
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Home;
