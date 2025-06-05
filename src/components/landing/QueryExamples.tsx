import React, { useState, useEffect } from 'react';

const queries = [
  "Where do ex-YC founders go after their first startup winds down?",
  "Ex-AI researchers from DeepMind now working in robotics startups",
  "Ex-MBB consultants who became Chief of Staff at Series A companies",
  "Crypto operators who pivoted into climate or defense in 2024–25",
  "Ex-FANG PMs who joined sub-20 person AI infra startups",
  "Founders in healthcare AI who started as academic researchers",
  "Startup COOs who were previously in education or nonprofit work",
  "Ex-Palantir engineers who became solo founders post-2023",
  "Designers who transitioned into Head of Product roles",
  "Where did OpenAI alumni from 2022–2023 end up?",
  "People who left Bridgewater and later raised VC funding",
  "Ex-bankers now building fintech products in LATAM",
  "Operators who left unicorns in 2023 and joined seed-stage companies",
  "What kind of people do a16z repeatedly back in AI?",
  "VCs who used to be startup lawyers or policy analysts",
  "Where do crypto founders go after shutting down their startups?"
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