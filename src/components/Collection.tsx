import React from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS } from '../constants';
import { ShowcaseCard } from './CoffeeComponents';
import { Canvas } from '@react-three/fiber';
import { BeanCluster } from './ThreeScene';

const Collection = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {
  return (
    <section className="section-padding bg-coffee-dark relative overflow-hidden">
      {/* Background 3D Beans */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-20">
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 10] }}>
          <BeanCluster />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-24">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold"
          >
            Discovery
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-bold tracking-tighter text-glow uppercase leading-none"
          >
            Coffee <br />
            <span className="text-caramel italic serif lowercase">Collection</span>
          </motion.h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-20">
          {PRODUCTS.map((product, i) => (
            <ShowcaseCard key={product.id} item={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
