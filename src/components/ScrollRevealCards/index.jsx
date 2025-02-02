import React from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    title: 'Professional Templates',
    description: 'Choose from our collection of ATS-friendly templates',
    image: '/assets/template.jpg',
    color: 'from-blue-500 to-purple-500'
  },
  {
    title: 'AI-Powered Writing',
    description: 'Get smart suggestions for your content',
    image: '/assets/ai.jpg',
    color: 'from-purple-500 to-pink-500'
  },
  {
    title: 'Expert Review',
    description: 'Get feedback from industry professionals',
    image: '/assets/review.jpg',
    color: 'from-pink-500 to-red-500'
  }
];

const ScrollRevealCards = () => {
  return (
    <div className="py-24 bg-slate-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ 
                opacity: 1, 
                y: 0,
                transition: {
                  type: "spring",
                  bounce: 0.4,
                  duration: 0.8,
                  delay: index * 0.2
                }
              }}
              viewport={{ once: true }}
              className="w-full md:w-1/3 max-w-sm"
            >
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Image Container */}
                <div className="relative h-48">
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-90`} />
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollRevealCards;
