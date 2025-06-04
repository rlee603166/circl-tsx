import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';

const queries = [
  "Ex-Stripe PMs in AI startups",
  "VCs who used to be founders",
  "People like me who became PMs",
  "Crypto engineers post-FTX",
  "Ex-MBB consultants who joined startups",
  "Product managers who switched to design",
  "Ex-Google engineers at startups",
  "Finance professionals in climate tech"
];

const QueryCard = ({ query }: { query: string }) => {
  return (
    <div className="flex-shrink-0 w-full sm:w-[280px] p-5 rounded-2xl bg-white shadow-sm border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
          <Search className="w-4 h-4" />
        </div>
        <p className="text-gray-700 font-light">{query}</p>
      </div>
    </div>
  );
};

const QueryExamples = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, []);

  return (
    <section id="examples" className="py-20 px-6 md:px-10 lg:px-0 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-light text-center text-gray-900 mb-4">
          Ask anything about careers
        </h2>
        <p className="text-gray-600 font-light text-center max-w-2xl mx-auto mb-12">
          Discover hidden professional patterns with conversational queries
        </p>
        
        <div className="relative">
          <button 
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all ${!canScrollLeft ? 'opacity-0' : 'opacity-100'}`}
            disabled={!canScrollLeft}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {queries.map((query, index) => (
              <div key={index} className="snap-start">
                <QueryCard query={query} />
              </div>
            ))}
          </div>
          
          <button 
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all ${!canScrollRight ? 'opacity-0' : 'opacity-100'}`}
            disabled={!canScrollRight}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default QueryExamples;