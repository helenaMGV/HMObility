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
      
      {/* Floating Chatbot Button - Premium */}
      {!isChatbotOpen && (
        <Button
          onClick={() => setIsChatbotOpen(true)}
          className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-2xl hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 group"
          aria-label="Abrir chatbot"
        >
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
          <MessageCircle className="w-7 h-7 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
          </span>
        </Button>
      )}
      
      <ChatbotReglamento isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />
    </div>
  );
};

export default Home;
