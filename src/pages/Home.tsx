import React, { Suspense } from 'react';
import { Navbar, Hero } from '../components/CoffeeComponents';
import Collection from '../components/Collection';
import Events from '../components/Events';
import Instagram from '../components/Instagram';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { BeanCluster } from '../components/ThreeScene';

const Home = ({ cartCount, onOpenCart, onOpenCategories, onAddToCart }: { cartCount: number, onOpenCart: () => void, onOpenCategories: () => void, onAddToCart: (item: any) => void }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative bg-coffee-dark"
    >
      <div className="grain" />
      
      {/* Global Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <Suspense fallback={null}>
          <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 15] }}>
            <BeanCluster />
          </Canvas>
        </Suspense>
      </div>

      <div className="relative z-10">
        <Navbar 
          onOpenCart={onOpenCart} 
          onOpenCategories={onOpenCategories} 
          cartCount={cartCount}
        />
        <Hero />
        <Collection onAddToCart={onAddToCart} />
        <Events />
        <Instagram />
        <Reviews />
        <Footer />
      </div>
    </motion.main>
  );
};

export default Home;
