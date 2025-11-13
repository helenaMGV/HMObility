import { useState } from "react";
import Navbar from "@/components/Navbar";
import AccidentsMap from "@/components/AccidentsMap";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";

const MapPage = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main className="container mx-auto px-4 py-16">
        <AccidentsMap />
      </main>
      <Footer />
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default MapPage;
