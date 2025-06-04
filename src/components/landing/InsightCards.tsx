import React from 'react';
import { MessageSquare, TrendingUp, Network } from 'lucide-react';

const Card = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="flex-1 min-w-[280px] p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-light text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 font-light leading-relaxed">{description}</p>
    </div>
  );
};

const InsightCards = () => {
  return (
    <section id="features" className="py-20 px-6 md:px-10 lg:px-0 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center text-gray-900 mb-12">Why Circl</h2>
        
        <div className="flex flex-col md:flex-row gap-6 mt-10">
          <Card 
            icon={<MessageSquare className="w-6 h-6" />}
            title="Ask Anything"
            description="Natural questions, no rigid filters. Just ask what you want to know about careers and networks."
          />
          
          <Card 
            icon={<TrendingUp className="w-6 h-6" />}
            title="See Patterns"
            description="We surface transitions, not just job titles. Discover where people like you went and why."
          />
          
          <Card 
            icon={<Network className="w-6 h-6" />}
            title="Explore Networks"
            description="Reveal shared paths and hidden links between professionals to understand career trajectories."
          />
        </div>
      </div>
    </section>
  );
};

export default InsightCards;