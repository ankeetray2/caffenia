import React from 'react';
import { motion } from 'framer-motion';
import { INSTAGRAM_IMAGES } from '../constants';
import { Instagram as InstagramIcon } from 'lucide-react';
import { TiltWrapper } from './CoffeeComponents';

const Instagram = () => {
  return (
    <section className="section-padding bg-coffee-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 flex items-end justify-between">
          <div>
            <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Social</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Instagram Gallery</h2>
          </div>
          <button className="hidden md:flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.4em] text-cream hover:text-cream transition-colors group">
            Follow @ASSAVA <InstagramIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_IMAGES.map((image, i) => (
            <TiltWrapper key={i} className="group relative aspect-square rounded-[30px] overflow-hidden glass border-white/5 cursor-pointer">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.8 }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <img 
                  src={image} 
                  alt={`Instagram ${i}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-coffee-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <InstagramIcon className="w-8 h-8 text-white/50" />
                </div>
              </motion.div>
            </TiltWrapper>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Instagram;
