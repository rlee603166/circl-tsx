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
    <div className="flex-1 min-w-[280px] p-8 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mb-8 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-light text-gray-900 mb-4">{title}</h3>
      <p className="text-lg text-gray-600 font-light leading-relaxed">{description}</p>
    </div>
  );
};

const InsightCards = () => {
  return (
    <section id="features" className="py-20 px-6 md:px-10 lg:px-0 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-16">Why Circl</h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mt-12">
            <Card 
              icon={<MessageSquare className="w-7 h-7" />}
              title="Ask Anything"
              description="Ask freely. Ditch filters and explore careers, people, and paths conversationally."
            />
            
            <Card 
              icon={<TrendingUp className="w-7 h-7" />}
              title="See Patterns"
              description="Uncover patterns. Trace real career moves, pivotal turns, and what came next for people like you."
            />
            
            <Card 
              icon={<Network className="w-7 h-7" />}
              title="Explore Networks"
              description="Map networks. Discover hidden connections and how professional paths intertwine."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsightCards;