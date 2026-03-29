import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Lenis from '@studio-freight/lenis';
import { 
  Navbar, 
  Hero, 
  CoffeeCard, 
  ScrollStory, 
  CartPanel, 
  CategoryModal, 
  AccountDashboard,
  SearchPage,
  ShoppingPage,
  CoffeeDetailPage,
  ThankYouPage,
  OrderHistoryPage,
  TrackingPage,
  CategoryPage,
  LoadingScreen,
  LISTINGS
} from './components/CoffeeComponents';
import { CoffeeImageGenerator } from './components/CoffeeImageGenerator';
import { Coffee } from 'lucide-react';

function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero />
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold"
            >
              Curated Selection
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow">
              Popular Near You
            </h2>
          </div>
          <button className="group flex items-center gap-4 text-gold font-bold uppercase tracking-[0.2em] text-xs">
            View All Collections
            <div className="w-12 h-[1px] bg-gold group-hover:w-20 transition-all duration-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {LISTINGS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <CoffeeCard {...item} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

function PageWrapper() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const location = useLocation();

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-coffee-dark selection:bg-caramel/30">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <CustomCursor />
            <Navbar onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />
            
            <CartPanel 
              isOpen={isCartOpen} 
              onClose={() => setIsCartOpen(false)} 
              items={cart}
              onRemove={removeFromCart}
              onUpdateQty={updateQty}
            />
            
            <CategoryModal isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} />

            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/category" element={<CategoryPage />} />
                <Route path="/shopping" element={<ShoppingPage onAddToCart={addToCart} />} />
                <Route path="/about" element={<ScrollStory />} />
                <Route path="/account" element={<AccountDashboard />} />
                <Route path="/thankyou" element={<ThankYouPage />} />
                <Route path="/orderHistory" element={<OrderHistoryPage />} />
                <Route path="/tracking" element={<TrackingPage />} />
                <Route path="/coffeeDetail/:id" element={<CoffeeDetailPage onAddToCart={addToCart} />} />
                <Route path="/studio" element={<CoffeeImageGenerator />} />
              </Routes>
            </AnimatePresence>

            <footer className="py-32 px-6 border-t border-white/5 glass relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full liquid-blob opacity-10 pointer-events-none" />
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-20 relative z-10">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-caramel rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(198,142,93,0.5)]">
                      <Coffee className="text-coffee-dark w-7 h-7" />
                    </div>
                    <span className="text-3xl font-bold tracking-tighter uppercase">Caffeina</span>
                  </div>
                  <p className="text-cream/40 max-w-sm text-lg leading-relaxed font-light">
                    Redefining the coffee experience through cinematic design, technology, and the world's finest harvests.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-8 uppercase tracking-[0.3em] text-[10px] text-gold">Explore</h4>
                  <ul className="space-y-5 text-cream/60 text-sm font-medium">
                    <li><a href="#" className="hover:text-gold transition-colors">The Roastery</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Global Spaces</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Brewing Guides</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Membership</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-8 uppercase tracking-[0.3em] text-[10px] text-gold">Connect</h4>
                  <ul className="space-y-5 text-cream/60 text-sm font-medium">
                    <li><a href="#" className="hover:text-gold transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Twitter</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Discord</a></li>
                    <li><a href="#" className="hover:text-gold transition-colors">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-cream/20 font-bold">
                <span>© 2026 Caffeina Platform. All rights reserved.</span>
                <div className="flex gap-10">
                  <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <PageWrapper />
    </Router>
  );
}

function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 rounded-full border border-gold/30 pointer-events-none z-[9999] hidden md:block"
      animate={{ x: mousePos.x - 20, y: mousePos.y - 20 }}
      transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.5 }}
    >
      <div className="absolute inset-0 bg-gold/5 rounded-full blur-md" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gold rounded-full" />
    </motion.div>
  );
}
