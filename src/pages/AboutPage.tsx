import { useState } from "react";
import Navbar from "@/components/Navbar";
import About from "@/components/About";
import Chatbot from "@/components/Chatbot";
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
      <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default AboutPage;
