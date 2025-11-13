import { useState } from "react";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";

const AboutPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main>
        <About />
      </main>
      <Footer />
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default AboutPage;
