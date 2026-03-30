import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Search, Coffee, MapPin, Star, ArrowRight, Menu, X, User, ShoppingCart, Settings, Package, LogOut, ChevronRight, Filter, Check, Droplets, Zap, FlaskConical, Wind, Cylinder, Flame, ChevronDown, Plus } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { useTexture, Preload } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing';
import { CoffeeBean, CoffeeDust, CoffeeSteam, LiquidBlob, BeanCluster, ExplodingHeroBean, FieryParticles } from './ThreeScene';
import { cn } from '../lib/utils';
import { Link, useLocation, useParams } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

// --- Navbar ---
export function Navbar({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Experience', path: '/' },
    { name: 'Shop', path: '/shopping' },
    { name: 'Categories', onClick: onOpenCategories },
    { name: 'Story', path: '/about' },
    { name: 'Account', path: '/account' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "glass py-3" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-caramel rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(198,142,93,0.5)] group-hover:scale-110 transition-transform">
              <Coffee className="text-coffee-dark w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-cream uppercase">ASSAVA</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-[9px] font-bold uppercase tracking-[0.3em] text-cream/80">
            {navLinks.slice(0, 4).map((link) => (
              link.path ? (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={cn("hover:text-cream transition-colors", location.pathname === link.path && "text-cream")}
                >
                  {link.name}
                </Link>
              ) : (
                <button 
                  key={link.name}
                  onClick={link.onClick} 
                  className="hover:text-cream transition-colors flex items-center gap-1"
                >
                  {link.name} <Filter className="w-3 h-3" />
                </button>
              )
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenCart} className="relative p-2 hover:bg-cream/10 rounded-full transition-colors group">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-caramel text-coffee-dark text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            <Link to="/account" className="hidden sm:flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold hover:glow-border transition-all">
              <User className="w-4 h-4" />
              <span>Account</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-cream/10 rounded-full transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] mobile-nav flex flex-col p-10"
          >
            <div className="flex justify-between items-center mb-20">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-caramel rounded-full flex items-center justify-center">
                  <Coffee className="text-coffee-dark w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tighter text-cream uppercase">ASSAVA</span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 hover:bg-cream/10 rounded-full transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {link.path ? (
                    <Link 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-4xl font-bold tracking-tighter uppercase hover:text-caramel transition-colors"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        link.onClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-4xl font-bold tracking-tighter uppercase hover:text-caramel transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// --- Hero Section ---
function FloatingBeans() {
  const beanTexture = useTexture('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=500');
  
  return (
    <>
      <CoffeeBean position={[-4, 2, -2]} rotation={[0.4, 0.2, 0.5]} scale={0.2} texture={beanTexture} />
      <CoffeeBean position={[5, -3, -1]} rotation={[1.2, 0.5, 0.1]} scale={0.25} texture={beanTexture} />
      <CoffeeBean position={[-6, -4, -3]} rotation={[0.1, 0.8, 0.9]} scale={0.18} texture={beanTexture} />
      <CoffeeBean position={[7, 4, -5]} rotation={[0.5, 0.5, 0.5]} scale={0.22} texture={beanTexture} />
      <CoffeeBean position={[-8, 1, -4]} rotation={[0.2, 0.9, 0.1]} scale={0.15} texture={beanTexture} />
      <CoffeeBean position={[2, 5, -6]} rotation={[0.8, 0.1, 0.4]} scale={0.2} texture={beanTexture} />
    </>
  );
}

export function Hero() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-coffee-dark">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 flex items-center justify-center bg-coffee-dark/20 text-caramel/50 font-mono text-xs tracking-widest uppercase">Loading Cinematic Scene...</div>}>
          <Canvas 
            gl={{ 
              antialias: true, 
              alpha: true,
              powerPreference: "high-performance",
              preserveDrawingBuffer: true
            }}
            camera={{ position: [0, 0, 8], fov: 45 }}
            dpr={[1, 2]}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={3} color="#C68E5D" />
              <pointLight position={[-10, -10, -10]} intensity={2} color="#4E342E" />
              <pointLight position={[0, 0, 5]} intensity={2} color="#FFFFFF" />
              <CoffeeDust count={300} />
              <FieryParticles count={200} />
              <BeanCluster />
              <Preload all />
            </Suspense>
            
            <EffectComposer multisampling={0}>
              <Bloom 
                intensity={2.0} 
                luminanceThreshold={0.15} 
                luminanceSmoothing={0.9} 
                mipmapBlur
              />
              <DepthOfField 
                focusDistance={0} 
                focalLength={0.02} 
                bokehScale={2} 
                height={480} 
              />
              <Vignette eskil={false} offset={0.1} darkness={1.2} />
            </EffectComposer>
          </Canvas>
        </Suspense>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-coffee-dark/20 backdrop-blur-none rounded-2xl px-8 py-10"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "1em" }}
            transition={{ duration: 2, delay: 0.5 }}
            className="text-cream/60 font-mono text-[9px] uppercase block mb-6 font-bold"
          >
            THE ULTIMATE AWAKENING
          </motion.span>
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.8] uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            Ignite <br />
            <span className="text-caramel italic serif lowercase drop-shadow-[0_0_30px_rgba(198,142,93,0.4)]">The Soul</span>
          </h1>
          <p className="text-cream/75 text-base md:text-xl mb-12 max-w-2xl mx-auto font-light tracking-wide leading-relaxed">
            Experience the explosive intensity of our volcanic-grown beans, roasted to perfection for the modern ritual.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="pointer-events-auto"
          >
            <Link to="/shopping">
              <button className="group relative px-12 py-5 rounded-full overflow-hidden glass border-white/10 hover:glow-border transition-all duration-500">
                <div className="absolute inset-0 bg-caramel/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-cream group-hover:text-cream transition-colors">
                  Explore Collection
                </span>
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] uppercase tracking-[0.5em] text-cream/50 font-bold">Scroll to Discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cream/40 to-transparent" />
      </motion.div>

      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-coffee-dark/0 via-coffee-dark/20 to-coffee-dark pointer-events-none" />
    </section>
  );
}

// --- Category Modal ---
export function CategoryModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const categories = [
    { name: "Single Origin", icon: "🌍", count: 24 },
    { name: "House Blends", icon: "🏠", count: 12 },
    { name: "Rare Finds", icon: "💎", count: 5 },
    { name: "Brewing Gear", icon: "⚖️", count: 18 },
    { name: "Coffee Spaces", icon: "🏢", count: 8 },
    { name: "Workshops", icon: "🎓", count: 4 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-coffee-dark/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative glass w-full max-w-4xl rounded-[60px] p-12 glow-border overflow-hidden bg-white/5 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-caramel/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cream/5 rounded-full blur-[120px] pointer-events-none" />

            <button onClick={onClose} className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-full transition-all group z-20">
              <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
            </button>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12"
              >
                <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Discovery</span>
                <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Collections</h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {categories.map((cat, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="glass p-8 rounded-[40px] text-left group hover:glow-border transition-all bg-white/5 border-white/5 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-caramel/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="text-5xl mb-6 block drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">{cat.icon}</span>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-cream transition-colors tracking-tighter uppercase">{cat.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-cream/40 uppercase tracking-[0.3em] font-bold">{cat.count} Items</span>
                      <ChevronRight className="w-4 h-4 text-caramel opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Cart Panel ---
export function CartPanel({ isOpen, onClose, items, onRemove, onUpdateQty }: { 
  isOpen: boolean, 
  onClose: () => void, 
  items: any[],
  onRemove: (id: string) => void,
  onUpdateQty: (id: string, delta: number) => void
}) {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-coffee-dark/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.8 }}
            className="relative w-full max-w-md h-full glass border-l border-white/10 p-10 flex flex-col bg-coffee-dark/95 backdrop-blur-2xl shadow-[-50px_0_100px_rgba(0,0,0,0.5)]"
          >
            {/* Background Glow */}
            <div className="absolute top-1/4 -right-20 w-64 h-64 bg-caramel/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between mb-12 relative z-10">
              <div>
                <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-2 block font-bold">Your Ritual</span>
                <h2 className="text-4xl font-bold tracking-tighter uppercase">Cart</h2>
              </div>
              <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all group">
                <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-8 pr-4 custom-scrollbar relative z-10">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-cream/20 space-y-6">
                  <div className="w-24 h-24 rounded-full glass flex items-center justify-center border-white/5">
                    <ShoppingCart className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="uppercase tracking-[0.4em] text-[10px] font-bold">Your ritual is empty</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 items-center group relative"
                  >
                    <div className="w-24 h-24 rounded-[32px] overflow-hidden glass border-white/10 group-hover:glow-border transition-all duration-500 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-cream group-hover:text-cream transition-colors tracking-tight text-lg mb-1">{item.name}</h3>
                      <span className="text-caramel font-mono text-xs font-bold tracking-wider">${item.price.toFixed(2)}</span>
                      <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-3 glass px-3 py-1.5 rounded-full border-white/5">
                          <button 
                            onClick={() => onUpdateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover:text-cream transition-all"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                          <button 
                            onClick={() => onUpdateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs hover:text-cream transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="absolute top-0 right-0 p-2 text-cream/10 hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="mt-10 pt-10 border-t border-white/10 space-y-6 relative z-10">
                <div className="space-y-3">
                  <div className="flex justify-between text-cream/40 text-xs uppercase tracking-widest font-bold">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold tracking-tighter">
                    <span className="uppercase">Total</span>
                    <span className="text-cream font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <Link to="/thankyou" onClick={onClose} className="block">
                  <button className="w-full bg-caramel text-coffee-dark py-6 rounded-[32px] font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-caramel/90 transition-all shadow-[0_20px_40px_rgba(198,142,93,0.2)] hover:shadow-[0_20px_50px_rgba(198,142,93,0.3)] active:scale-[0.98]">
                    Complete Ritual
                  </button>
                </Link>
                <p className="text-center text-[8px] text-cream/20 uppercase tracking-[0.4em] font-bold">Secure Checkout Powered by Caffeina</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Account Dashboard ---
export function AccountDashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 relative z-10">
        {/* Sidebar */}
        <div className="lg:w-80 space-y-4">
          <div className="mb-10">
            <span className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-4 block font-bold">Member Portal</span>
            <h2 className="text-5xl font-bold tracking-tighter text-glow uppercase">Account</h2>
          </div>
          
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-4 px-8 py-5 rounded-3xl transition-all font-bold uppercase tracking-widest text-xs border border-white/5",
                activeTab === tab.id 
                  ? "bg-caramel text-coffee-dark shadow-[0_0_30px_rgba(198,142,93,0.3)]" 
                  : "glass text-cream/60 hover:text-cream hover:bg-white/5"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
          <button className="w-full flex items-center gap-4 px-8 py-5 rounded-3xl glass text-destructive hover:bg-destructive/10 transition-all font-bold uppercase tracking-widest text-xs mt-10 border border-destructive/20">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass rounded-[48px] p-12 glow-border bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl"
            >
              {activeTab === 'profile' && (
                <div className="space-y-12">
                  <div className="flex items-center gap-8">
                    <div className="w-32 h-32 rounded-full glass border-2 border-caramel p-1 relative group">
                      <img src="https://picsum.photos/seed/user/200/200" alt="avatar" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-coffee-dark/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Settings className="w-6 h-6 text-cream" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold tracking-tighter uppercase mb-2">Ankit Kumar</h2>
                      <p className="text-cream font-mono text-sm">ankitkumar999090@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-cream/60 font-bold">Full Name</label>
                      <div className="glass px-8 py-5 rounded-2xl text-cream/80 border border-white/5">Ankit Kumar</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-cream/60 font-bold">Member Since</label>
                      <div className="glass px-8 py-5 rounded-2xl text-cream/80 border border-white/5">March 2026</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-cream/60 font-bold">Preferred Roast</label>
                      <div className="glass px-8 py-5 rounded-2xl text-cream border border-white/20 font-bold">Light-Medium</div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest text-cream/60 font-bold">Total Rituals</label>
                      <div className="glass px-8 py-5 rounded-2xl text-cream/80 border border-white/5">12 Brews</div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold mb-6 uppercase tracking-widest">Recent Orders</h3>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="glass p-8 rounded-[32px] flex items-center justify-between group hover:glow-border transition-all bg-white/5 border border-white/5">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-caramel/10 flex items-center justify-center border border-caramel/20">
                          <Package className="text-caramel w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg uppercase tracking-tight">Order #CF-928{i}</h4>
                          <p className="text-xs text-cream/40 uppercase tracking-widest">Delivered on March {20 + i}, 2026</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <span className="block font-mono text-cream text-xl font-bold">$84.00</span>
                          <span className="text-[10px] text-cream/20 uppercase font-bold">3 Items</span>
                        </div>
                        <Link to="/tracking" className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:bg-caramel group-hover:text-coffee-dark transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  <h3 className="text-xl font-bold mb-6 uppercase tracking-widest">Preferences</h3>
                  <div className="flex items-center justify-between p-8 glass rounded-[32px] bg-white/5 border border-white/5">
                    <div>
                      <h4 className="font-bold text-lg">Email Notifications</h4>
                      <p className="text-sm text-cream/40">Receive updates about new roasts and rare finds</p>
                    </div>
                    <div className="w-14 h-7 bg-caramel rounded-full relative p-1 cursor-pointer shadow-[0_0_20px_rgba(198,142,93,0.3)]">
                      <div className="w-5 h-5 bg-coffee-dark rounded-full absolute right-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-8 glass rounded-[32px] bg-white/5 border border-white/5">
                    <div>
                      <h4 className="font-bold text-lg">Two-Factor Authentication</h4>
                      <p className="text-sm text-cream/40">Secure your account with biometric verification</p>
                    </div>
                    <div className="w-14 h-7 bg-white/10 rounded-full relative p-1 cursor-pointer">
                      <div className="w-5 h-5 bg-cream/20 rounded-full absolute left-1" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-8 glass rounded-[32px] bg-white/5 border border-white/5">
                    <div>
                      <h4 className="font-bold text-lg">Privacy Mode</h4>
                      <p className="text-sm text-cream/40">Hide your brewing history from the community</p>
                    </div>
                    <div className="w-14 h-7 bg-white/10 rounded-full relative p-1 cursor-pointer">
                      <div className="w-5 h-5 bg-cream/20 rounded-full absolute left-1" />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- Card Component ---
export function CoffeeCard({ title, location, rating, image, price, oldPrice, tag, description, id = "1", onAddToCart }: any) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass rounded-[40px] overflow-hidden group cursor-pointer relative glow-border-hover"
    >
      <Link to={`/coffeeDetail/${id}`}>
        <div className="relative h-72 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 card-gradient" />
          
          {/* Tag */}
          <div className="absolute top-6 left-6">
            <div className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-cream glow-border bg-coffee-dark/40 backdrop-blur-md">
              {tag || "Premium"}
            </div>
          </div>

          <div className="absolute top-6 right-6 glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold glow-border">
            <Star className="w-3 h-3 text-gold fill-gold" />
            <span>{rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-8">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/coffeeDetail/${id}`}>
            <h3 className="text-2xl font-bold text-cream group-hover:text-cream transition-colors tracking-tighter uppercase">
              {title}
            </h3>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-gold font-bold text-xl">{price}</span>
            {oldPrice && (
              <span className="text-cream/30 text-xs line-through">{oldPrice}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-cream/60 text-sm mb-4">
          <MapPin className="w-4 h-4 text-caramel" />
          <span>{location}</span>
        </div>

        <p className="text-cream/70 text-xs line-clamp-2 mb-6 leading-relaxed italic">
          {description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-coffee-dark overflow-hidden glass">
                <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" referrerPolicy="no-referrer" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-coffee-dark bg-espresso flex items-center justify-center text-[10px] font-bold text-cream/40">
              +12
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart && onAddToCart({ id, title, price, image });
            }}
            className="px-6 py-3 rounded-full bg-caramel text-coffee-dark font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(198,142,93,0.3)] hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Search Page ---
export function SearchPage({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const results = PRODUCTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      <Navbar onOpenCart={onOpenCart} onOpenCategories={onOpenCategories} cartCount={cartCount} />
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold">Discovery</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Search Results</h2>
          </motion.div>
          
          <button className="glass px-8 py-4 rounded-full flex items-center gap-3 text-sm font-bold uppercase tracking-widest hover:glow-border transition-all bg-white/5 backdrop-blur-xl border border-white/10">
            <Filter className="w-4 h-4 text-caramel" /> 
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass h-[500px] rounded-[40px] animate-pulse bg-white/5 border border-white/10" />
            ))
          ) : (
            results.map((item, index) => (
              <CoffeeCard key={index} {...item} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- Shopping Page ---
// --- Tilt Wrapper ---
export function TiltWrapper({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- Showcase Card ---
export function ShowcaseCard({ item, onAddToCart }: { item: any, onAddToCart: (item: any) => void }) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        perspective: 1500,
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      className="relative group cursor-pointer"
    >
      <Link to={`/coffeeDetail/${item.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden rounded-[50px] bg-coffee-dark border border-white/5 transition-all duration-700 group-hover:glow-border group-hover:-translate-y-6 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          {/* Image */}
          <motion.img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-40"
            referrerPolicy="no-referrer"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 card-gradient opacity-70 group-hover:opacity-95 transition-opacity duration-700" />
          
          {/* Content */}
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
            <motion.div
              className="space-y-6"
            >
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <span className="text-cream font-mono text-[9px] uppercase tracking-[0.5em] mb-4 block font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.profile?.origin} / {item.profile?.roast}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white group-hover:text-cream transition-colors duration-500 uppercase leading-[0.85]">
                    {item.name}
                  </h3>
                  <Link to={`/coffeeDetail/${item.id}`} className="text-[10px] text-caramel uppercase tracking-widest font-bold mt-4 inline-block hover:text-gold transition-colors">
                    View Details
                  </Link>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-gold font-mono tracking-tighter block">${item.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700 pt-2 space-y-8">
                <p className="text-cream/50 text-sm leading-relaxed font-light italic">
                  "{item.description}"
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.flavorNotes?.slice(0, 3).map((note: string, i: number) => (
                    <span key={i} className="text-[8px] uppercase tracking-widest px-3 py-1 rounded-full glass border-white/5 text-cream/60">{note}</span>
                  ))}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(item);
                  }}
                  className="w-full py-6 bg-caramel text-coffee-dark rounded-3xl text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-caramel/90 transition-all duration-500 shadow-[0_0_40px_rgba(198,142,93,0.2)]"
                >
                  Add to Collection
                </button>
              </div>
            </motion.div>
          </div>

          {/* Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

export function ShoppingPage({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const filters = ['All', 'Instant', 'Brew', 'Espresso'];

  const filteredItems = PRODUCTS.filter(item => {
    const matchesFilter = activeFilter === 'All' || item.category === activeFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-coffee-dark pt-40 pb-32 px-6 relative">
      {/* Background Grain & Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 5] }}>
          <CoffeeDust count={100} />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-cream font-mono text-xs uppercase tracking-[0.5em] mb-6 block font-bold"
            >
              Curated Blends
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-8"
            >
              Minimal. Modern. <br />
              <span className="text-caramel italic serif lowercase">Unforgettable Coffee.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-cream/70 text-xl font-light max-w-lg"
            >
              Explore curated blends crafted for experience. Each bean is a story of origin, precision, and passion.
            </motion.p>
          </div>

          <div className="w-full lg:w-auto space-y-8">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-cream/30 group-focus-within:text-cream transition-colors" />
              <input 
                type="text"
                placeholder="Search Collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full lg:w-96 bg-white/5 border border-white/10 rounded-full py-5 pl-16 pr-8 text-sm text-cream focus:glow-border outline-none transition-all placeholder:text-cream/20"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500",
                    activeFilter === filter 
                      ? "bg-cream text-coffee-dark shadow-[0_0_20px_rgba(255,255,255,0.3)]" 
                      : "glass text-cream/40 hover:text-cream hover:border-white/20"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                <ShowcaseCard item={item} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-40 text-center"
          >
            <p className="text-cream/20 font-mono text-sm uppercase tracking-[0.5em]">No blends found in this collection</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- Coffee Detail Page ---
export function CoffeeDetailPage({ onAddToCart }: { onAddToCart: (item: any) => void }) {
  const { id } = useParams();
  const item = PRODUCTS.find(l => l.id === id) || PRODUCTS[0];

  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Left: 3D Model Placeholder */}
          <div className="sticky top-32">
            <div className="relative h-[600px] glass rounded-[60px] overflow-hidden group shadow-[0_0_50px_rgba(0,0,0,0.3)] bg-white/5 border border-white/10">
               <Canvas gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ position: [0, 0, 5] }} dpr={[1, 2]}>
                 <Suspense fallback={null}>
                   <ambientLight intensity={0.5} />
                   <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
                   <CoffeeDust count={200} />
                   <CoffeeSteam count={30} />
                   <CoffeeBean position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1.8} />
                   <LiquidBlob />
                 </Suspense>
               </Canvas>
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                 Interactive 3D Harvest
               </div>
               
               {/* Floating Badge */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute top-10 left-10 glass p-6 rounded-3xl border-white/20 bg-coffee-dark/40 backdrop-blur-xl"
               >
                 <span className="text-[10px] uppercase tracking-[0.3em] text-cream font-bold block mb-2">Purity Level</span>
                 <div className="text-3xl font-bold font-mono">98.4%</div>
               </motion.div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-16">
            <section>
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-caramel font-mono text-sm uppercase tracking-[0.4em] mb-6 block font-bold"
              >
                Special Reserve • {item.profile?.origin}
              </motion.span>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 text-glow leading-[0.9] uppercase">
                {item.name}
              </h1>
              
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-4 h-4", i < Math.floor(item.rating || 5) ? "text-cream fill-cream" : "text-white/10")} />
                    ))}
                  </div>
                  <span className="font-bold text-cream">{item.rating || 5.0}</span>
                  <span className="text-cream/20 text-xs uppercase tracking-widest">({item.reviews || 100} Reviews)</span>
                </div>
                <div className="h-4 w-[1px] bg-white/10" />
                <div className="flex items-center gap-2 text-cream/60 text-sm">
                  <MapPin className="w-4 h-4 text-caramel" />
                  {item.location || "Global"}
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-cream font-bold">The Story</h3>
              <p className="text-2xl text-cream/60 leading-relaxed font-light italic font-serif">
                "{item.description}"
              </p>
            </section>

            <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Origin", value: item.profile?.origin || "Unknown", icon: MapPin },
                { label: "Roast", value: item.profile?.roast || "Medium", icon: Coffee },
                { label: "Body", value: item.profile?.body || "Medium", icon: Droplets },
                { label: "Acidity", value: item.profile?.acidity || "Balanced", icon: Zap },
              ].map((attr, i) => (
                <TiltWrapper key={i}>
                  <div className="glass p-6 rounded-3xl border-white/5 hover:glow-border transition-all bg-white/5 h-full">
                    <attr.icon className="w-5 h-5 text-caramel mb-4" />
                    <span className="text-[10px] uppercase tracking-widest text-cream/40 font-bold block mb-1">{attr.label}</span>
                    <span className="text-sm font-bold text-cream">{attr.value}</span>
                  </div>
                </TiltWrapper>
              ))}
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-cream font-bold">Flavor Profile</h3>
              <div className="flex flex-wrap gap-4">
                {(item.flavorNotes || ["Chocolate", "Caramel", "Nutty"]).map((note: string, i: number) => (
                  <TiltWrapper key={i}>
                    <motion.div 
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                      className="glass px-6 py-3 rounded-full border-white/20 text-sm font-bold text-cream shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-default bg-white/5"
                    >
                      {note}
                    </motion.div>
                  </TiltWrapper>
                ))}
              </div>
            </section>

            <section className="space-y-8">
              <h3 className="text-[10px] uppercase tracking-[0.4em] text-cream font-bold">Recommended Brewing</h3>
              <div className="flex gap-10">
                {(item.brewingMethods || ["V60", "Espresso"]).map((method: string, i: number) => {
                  const MethodIcon = method.includes('V60') ? Wind : 
                                   method.includes('Chemex') ? FlaskConical :
                                   method.includes('Aeropress') ? Cylinder :
                                   method.includes('Espresso') ? Coffee :
                                   method.includes('Moka') ? Flame :
                                   Coffee;
                  return (
                    <div key={i} className="flex flex-col items-center gap-4 group">
                      <div className="w-16 h-16 rounded-full glass flex items-center justify-center group-hover:bg-caramel group-hover:text-coffee-dark transition-all duration-500 bg-white/5">
                        <MethodIcon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest font-bold text-cream/40 group-hover:text-cream transition-colors">{method}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-cream/40 font-bold mb-2">Price per 250g</span>
                <span className="text-6xl font-bold text-cream font-mono tracking-tighter">${item.price.toFixed(2)}</span>
              </div>
              
              <motion.button 
                onClick={() => onAddToCart(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ 
                  boxShadow: ["0 0 20px rgba(198,142,93,0.2)", "0 0 40px rgba(198,142,93,0.5)", "0 0 20px rgba(198,142,93,0.2)"]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="px-16 py-8 bg-caramel text-coffee-dark rounded-full font-bold uppercase tracking-[0.3em] text-sm shadow-[0_0_40px_rgba(198,142,93,0.4)] hover:opacity-90 transition-all relative overflow-hidden group"
              >
                <span className="relative z-10">Add to Ritual</span>
                <motion.div 
                  className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                />
              </motion.button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Thank You Page ---
export function ThankYouPage({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  return (
    <div className="min-h-screen bg-coffee-dark flex items-center justify-center text-center px-6 relative overflow-hidden">
      <Navbar onOpenCart={onOpenCart} onOpenCategories={onOpenCategories} cartCount={cartCount} />
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl relative z-10 glass p-16 rounded-[60px] border border-white/10 shadow-2xl backdrop-blur-3xl"
      >
        <div className="relative w-48 h-48 mx-auto mb-12">
          <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 5] }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#FFD700" />
              <CoffeeBean position={[0, 0, 0]} rotation={[0, 0, 0]} scale={2} />
              <CoffeeSteam count={20} />
            </Suspense>
          </Canvas>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0 bg-cream/10 rounded-full blur-3xl"
          />
        </div>

        <span className="text-caramel font-mono text-xs uppercase tracking-[0.5em] mb-6 block font-bold">Ritual Confirmed</span>
        <h1 className="text-6xl font-bold tracking-tighter text-glow mb-8 uppercase">Thank You</h1>
        <p className="text-xl text-cream/60 mb-12 leading-relaxed italic font-serif">
          "Your selection has been secured. Our master roasters are now preparing your beans for the ultimate extraction."
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/tracking">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-caramel text-coffee-dark rounded-full font-bold uppercase tracking-widest text-xs shadow-lg"
            >
              Track Shipment
            </motion.button>
          </Link>
          <Link to="/shopping">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 glass text-cream rounded-full font-bold uppercase tracking-widest text-xs border border-white/10 hover:bg-white/5"
            >
              Back to Collection
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// --- Order History Page ---
export function OrderHistoryPage({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      <Navbar onOpenCart={onOpenCart} onOpenCategories={onOpenCategories} cartCount={cartCount} />
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <span className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold">Archive</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Order History</h2>
        </div>

        <div className="space-y-8">
          {[1, 2, 3, 4].map(i => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[48px] border border-white/5 hover:glow-border-hover transition-all bg-white/5 backdrop-blur-3xl group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 rounded-3xl bg-caramel/10 flex items-center justify-center border border-caramel/20">
                    <Package className="text-caramel w-10 h-10" />
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-2xl font-bold uppercase tracking-tight">Order #CF-928{i}</h4>
                      <span className="px-3 py-1 rounded-full bg-white/10 text-cream text-[10px] font-bold uppercase tracking-widest border border-white/20">Delivered</span>
                    </div>
                    <p className="text-sm text-cream/50 uppercase tracking-widest font-bold">March {20 + i}, 2026 • 3 Items</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <span className="block font-mono text-cream text-3xl font-bold">$84.00</span>
                    <span className="text-[10px] text-cream/50 uppercase font-bold">Total Ritual Cost</span>
                  </div>
                  <Link to="/tracking" className="px-8 py-4 rounded-full glass text-xs font-bold uppercase tracking-widest hover:bg-caramel hover:text-coffee-dark transition-all border border-white/10">
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Tracking Page ---
export function TrackingPage({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  const steps = [
    { label: "Order Placed", date: "Mar 24, 10:30 AM", status: "completed" },
    { label: "Master Roasting", date: "Mar 24, 02:15 PM", status: "completed" },
    { label: "Quality Control", date: "Mar 25, 09:00 AM", status: "current" },
    { label: "In Transit", date: "Expected Mar 26", status: "pending" },
    { label: "Delivered", date: "Expected Mar 27", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      <Navbar onOpenCart={onOpenCart} onOpenCategories={onOpenCategories} cartCount={cartCount} />
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-16 text-center">
          <span className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold">Real-time Logistics</span>
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Track Ritual</h2>
        </div>

        <div className="glass p-12 rounded-[60px] border border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 pb-10 border-b border-white/5 gap-6">
            <div>
              <h3 className="text-3xl font-bold tracking-tighter uppercase mb-2">Order #CF-9284</h3>
              <p className="text-cream/40 text-sm uppercase tracking-widest font-bold">Estimated Delivery: March 27, 2026</p>
            </div>
            <div className="px-6 py-3 rounded-full bg-caramel/10 text-caramel text-xs font-bold uppercase tracking-widest border border-caramel/20">
              In Progress
            </div>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute left-4 top-0 bottom-0 w-1 bg-white/5 rounded-full md:left-1/2 md:-translate-x-1/2" />
            
            <div className="space-y-12">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "relative flex items-center gap-8 md:gap-0",
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className="flex-1 hidden md:block" />
                  
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center z-10 relative shadow-[0_0_20px_rgba(0,0,0,0.5)]",
                    step.status === 'completed' ? "bg-caramel text-coffee-dark" : 
                    step.status === 'current' ? "bg-cream text-coffee-dark animate-pulse" : "bg-white/10 text-cream/20"
                  )}>
                    {step.status === 'completed' ? <Check className="w-5 h-5" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>

                  <div className={cn(
                    "flex-1 glass p-8 rounded-[32px] border border-white/5 hover:glow-border transition-all bg-white/5",
                    i % 2 === 0 ? "md:ml-12" : "md:mr-12"
                  )}>
                    <h4 className={cn(
                      "text-xl font-bold uppercase tracking-tight mb-1",
                      step.status === 'pending' ? "text-cream/20" : "text-cream"
                    )}>
                      {step.label}
                    </h4>
                    <p className="text-xs text-cream/40 uppercase tracking-widest font-bold">{step.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Loading Screen ---
export function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-coffee-dark flex flex-col items-center justify-center"
    >
      <div className="relative w-40 h-40 mb-8">
        {/* Steam Particles */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-2">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ 
                y: [-10, -40], 
                opacity: [0, 0.5, 0],
                scale: [0.5, 1.5]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                delay: i * 0.4,
                ease: "easeOut"
              }}
              className="w-2 h-8 bg-cream/20 rounded-full blur-sm"
            />
          ))}
        </div>

        {/* Cup Body */}
        <div className="absolute inset-0 border-4 border-caramel rounded-b-[40px] rounded-t-lg overflow-hidden">
          {/* Liquid Filling */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "20%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-espresso"
          >
            {/* Liquid Surface Waves */}
            <motion.div
              animate={{ x: ["-10%", "10%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatType: "mirror" }}
              className="absolute -top-2 left-0 w-[120%] h-4 bg-caramel/30 blur-sm"
            />
          </motion.div>
        </div>
        
        {/* Cup Handle */}
        <div className="absolute top-1/2 -right-8 -translate-y-1/2 w-10 h-16 border-4 border-caramel rounded-r-full" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold tracking-tighter text-cream mb-2 uppercase tracking-[0.3em]">Brewing Ritual</h2>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
              className="w-1.5 h-1.5 bg-caramel rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Category Page ---
export function CategoryPage({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  const categories = [
    { name: "Single Origin", icon: "🌍", count: 24, desc: "Pure essence from specific regions" },
    { name: "House Blends", icon: "🏠", count: 12, desc: "Our signature balanced creations" },
    { name: "Rare Finds", icon: "💎", count: 5, desc: "Limited edition micro-lots" },
    { name: "Brewing Gear", icon: "⚖️", count: 18, desc: "Tools for the perfect extraction" },
    { name: "Coffee Spaces", icon: "🏢", count: 8, desc: "Curated furniture for your ritual" },
    { name: "Workshops", icon: "🎓", count: 4, desc: "Master the art of the brew" },
  ];

  return (
    <div className="min-h-screen bg-coffee-dark pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <CoffeeDust />
          <LiquidBlob />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-caramel font-mono text-xs uppercase tracking-[0.4em] mb-6 block font-bold">Explore</span>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Categories</h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="glass p-12 rounded-[48px] text-left group hover:glow-border transition-all cursor-pointer bg-white/5 backdrop-blur-2xl border border-white/10 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-caramel/5 rounded-full blur-3xl group-hover:bg-caramel/20 transition-all" />
              
              <span className="text-7xl mb-10 block drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-500">
                {cat.icon}
              </span>
              <h3 className="text-3xl font-bold mb-4 group-hover:text-cream transition-colors tracking-tighter uppercase">
                {cat.name}
              </h3>
              <p className="text-cream/40 text-sm mb-8 leading-relaxed italic">
                {cat.desc}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-caramel uppercase tracking-[0.3em] font-bold">
                  {cat.count} Items
                </span>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-caramel group-hover:text-coffee-dark transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Scroll Story (About Page) ---
export function ScrollStory({ onOpenCart, onOpenCategories, cartCount }: { onOpenCart: () => void, onOpenCategories: () => void, cartCount: number }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    { title: "The Origin", desc: "Sourced from high-altitude volcanic soils where the air is thin and the flavor is dense.", icon: "🌱" },
    { title: "The Roast", desc: "Precision heat reveals hidden aromatic profiles, turning green beans into liquid gold.", icon: "🔥" },
    { title: "The Grind", desc: "Uniform particles for perfect extraction, ensuring every note is captured.", icon: "⚙️" },
    { title: "The Brew", desc: "92°C water meets the soul of the bean in a delicate dance of chemistry.", icon: "☕" },
    { title: "The Moment", desc: "A sensory journey in every single sip. Experience the pure essence of taste.", icon: "✨" },
  ];

  return (
    <section ref={containerRef} className="relative h-[600vh] bg-coffee-dark">
      <Navbar onOpenCart={onOpenCart} onOpenCategories={onOpenCategories} cartCount={cartCount} />
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute left-12 top-1/2 -translate-y-1/2 w-1 h-80 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            style={{ scaleY: scrollYProgress }}
            className="w-full h-full bg-caramel origin-top shadow-[0_0_20px_rgba(198,142,93,0.5)]"
          />
        </div>

        {/* Dynamic Visuals */}
        <div className="absolute inset-0 z-0 opacity-30">
           <Canvas gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
             <Suspense fallback={null}>
               <ambientLight intensity={0.5} />
               <pointLight position={[10, 10, 10]} intensity={1} color="#C68E5D" />
               <CoffeeDust count={400} />
               <LiquidBlob />
               <CoffeeBean position={[0, 0, 0]} rotation={[0, 0, 0]} scale={2} />
             </Suspense>
           </Canvas>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6">
          {steps.map((step, index) => {
            const start = index / steps.length;
            const end = (index + 1) / steps.length;
            
            return (
              <StoryStep 
                key={index} 
                step={step} 
                progress={scrollYProgress} 
                range={[start, end]} 
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StoryStep({ step, progress, range }: any) {
  const opacity = useTransform(progress, [range[0], range[0] + 0.05, range[1] - 0.05, range[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [100, -100]);
  const scale = useTransform(progress, [range[0], range[1]], [0.8, 1.2]);

  return (
    <motion.div 
      style={{ opacity, y, scale }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center"
    >
      <motion.span 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-8xl mb-12 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]"
      >
        {step.icon}
      </motion.span>
      <h2 className="text-6xl md:text-9xl font-bold mb-8 text-cream uppercase tracking-tighter text-glow">{step.title}</h2>
      <p className="text-xl md:text-3xl text-cream/60 max-w-2xl font-light leading-relaxed">
        {step.desc}
      </p>
    </motion.div>
  );
}
