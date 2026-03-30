import React from 'react';
import { motion } from 'framer-motion';
import { EVENTS } from '../constants';
import { Calendar, ArrowRight } from 'lucide-react';
import { TiltWrapper } from './CoffeeComponents';

const Events = () => {
  return (
    <section className="section-padding bg-coffee-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Community</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Upcoming Events</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {EVENTS.map((event, i) => (
            <TiltWrapper key={event.id} className="group relative glass rounded-[60px] p-10 hover:glow-border transition-all duration-500 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-caramel/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-caramel/20 transition-colors" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-full md:w-48 h-48 rounded-[40px] overflow-hidden flex-shrink-0">
                    <img 
                      src={event.image} 
                      alt={event.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center border-white/5">
                        <Calendar className="w-5 h-5 text-cream" />
                      </div>
                      <span className="text-[10px] text-caramel uppercase tracking-[0.5em] font-bold">{event.date}</span>
                    </div>
                    <h3 className="text-3xl font-bold tracking-tighter uppercase group-hover:text-cream transition-colors">{event.name}</h3>
                    <p className="text-cream/40 text-base font-light leading-relaxed">{event.description}</p>
                    <button className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-cream hover:text-cream transition-colors group/btn">
                      Reserve Spot <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
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

export default Events;
