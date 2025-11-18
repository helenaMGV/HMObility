import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Dashboard from "@/components/Dashboard";
import Statistics from "@/components/Statistics";
import SpeedMap from "@/components/SpeedMap";
import FineCalculator from "@/components/FineCalculator";
import ShareButton from "@/components/ShareButton";
import LiveNotifications from "@/components/LiveNotifications";
import ChatbotReglamento from "@/components/ChatbotReglamento";
import Footer from "@/components/Footer";

const Home = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onChatbotToggle={() => setIsChatbotOpen(!isChatbotOpen)} />
      <main>
        <HeroSection />
        <Dashboard />
        
        {/* Fine Calculator Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Herramientas Útiles</h2>
                <p className="text-muted-foreground mb-6">Calcula tus multas y comparte información importante</p>
                <ShareButton />
              </div>
              <FineCalculator />
            </div>
          </div>
        </section>
        
        <Statistics />
        <SpeedMap />
      </main>
      <Footer />
      
      {/* Live Notifications - Real-time alerts */}
      <LiveNotifications />
      
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Home;
