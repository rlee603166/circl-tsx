import React, { useState, useEffect } from 'react';

const queries = [
  "Who left Goldman Sachs for fintech startups?",
  "How long do engineers spend at each company?",
  "What percentage of CTOs have computer science degrees?",
  "Which cities do remote workers actually live in?",
  "Stanford MBA graduates who became solo founders",
  "Average time from junior to senior engineer role",
  "Top universities for unicorn startup founders", 
  "Engineers with both Google and Meta experience",
  "What do successful Head of Sales backgrounds look like?",
  "What do people do during their gap year?",
  "Most common career pivot points for consultants",
  "Which coding bootcamps produce the most startup CTOs?",
  "Average number of years students take off before starting med school",
  "Geographic distribution of venture capital partners",
  "Common side projects among successful founders",
  "Career timelines of billion-dollar startup CTOs"
];

const QueryExamples = () => {
  const [currentQuery, setCurrentQuery] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuery((prev) => {
        const next = (prev + 1) % queries.length;
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [queries.length]); // Add queries.length as dependency

  return (
    <section id="examples" className="py-20 px-6 md:px-10 lg:px-0 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center text-gray-900 mb-8">
          Ask anything about careers
        </h2>
        <p className="text-xl md:text-2xl text-gray-600 font-light text-center max-w-3xl mx-auto mb-16">
          Discover hidden professional patterns with conversational queries
        </p>
        
        <div className="max-w-6xl mx-auto">
          <div className="relative h-36 overflow-hidden rounded-2xl backdrop-blur-xl bg-white/30 border border-gray-200/50 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            {queries.map((query, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center px-10 transition-all duration-1000 ${
                  index === currentQuery
                    ? "opacity-100 transform translate-y-0"
                    : index < currentQuery
                      ? "opacity-0 transform -translate-y-full"
                      : "opacity-0 transform translate-y-full"
                }`}
              >
                <p className="text-xl md:text-2xl font-light text-gray-700 text-center">"{query}"</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-3">
            {queries.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentQuery ? "bg-purple-500 w-10" : "bg-gray-300"
                }`}
                onClick={() => setCurrentQuery(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QueryExamples;