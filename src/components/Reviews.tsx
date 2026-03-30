import React from 'react';
import { motion } from 'framer-motion';
import { REVIEWS } from '../constants';
import { Star, Quote } from 'lucide-react';
import { TiltWrapper } from './CoffeeComponents';

const Reviews = () => {
  return (
    <section className="section-padding bg-coffee-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Feedback</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Customer Reviews</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {REVIEWS.map((review, i) => (
            <TiltWrapper key={review.id} className="group relative glass rounded-[60px] p-12 hover:glow-border transition-all duration-500 flex flex-col items-center text-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 1 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-caramel/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-caramel/20 transition-colors" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-cream text-cream" />
                    ))}
                  </div>
                  
                  <div className="relative">
                    <Quote className="absolute -top-6 -left-6 w-12 h-12 text-cream/10 rotate-180" />
                    <p className="text-2xl font-light italic leading-relaxed text-cream/80">"{review.text}"</p>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 pt-8 border-t border-white/5">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-caramel/20 group-hover:border-caramel transition-colors">
                      <img 
                        src={review.userImage} 
                        alt={review.userName} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-[10px] text-caramel uppercase tracking-[0.5em] font-bold">{review.userName}</span>
                  </div>
                </div>
              </motion.div>
            </TiltWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
