import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/CoffeeComponents';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { ArrowLeft, CreditCard, ShieldCheck, Lock } from 'lucide-react';

const Payment = ({ cartCount, onOpenCart, onOpenCategories }: { cartCount: number, onOpenCart: () => void, onOpenCategories: () => void }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen bg-coffee-dark"
    >
      <div className="grain" />
      <Navbar 
        onOpenCart={onOpenCart} 
        onOpenCategories={onOpenCategories} 
        cartCount={cartCount}
      />
      
      <section className="section-padding pt-32">
        <div className="max-w-3xl mx-auto">
          <Link to="/cart" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-cream hover:text-cream transition-colors mb-12 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> Back to Ritual
          </Link>
          
          <div className="mb-16">
            <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Secure</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Payment Ritual</h1>
          </div>
          
          <div className="glass rounded-[60px] p-12 space-y-12 border-white/5 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-caramel/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4 text-cream">
                <CreditCard className="w-6 h-6" />
                <h3 className="text-2xl font-bold tracking-tighter uppercase">Card Details</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/40">Card Number</label>
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 transition-colors outline-none text-cream/80 font-mono tracking-widest placeholder:text-cream/10"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/40">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM / YY" 
                      className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 transition-colors outline-none text-cream/80 font-mono tracking-widest placeholder:text-cream/10"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/40">CVV</label>
                    <input 
                      type="text" 
                      placeholder="000" 
                      className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 transition-colors outline-none text-cream/80 font-mono tracking-widest placeholder:text-cream/10"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-12 border-t border-white/5 space-y-8 relative z-10">
              <div className="flex items-center justify-between text-xl font-bold text-cream">
                <span className="uppercase tracking-tighter">Total Ritual Value</span>
                <span className="text-cream">$110.00</span>
              </div>
              
              <button className="w-full group relative px-12 py-6 rounded-full overflow-hidden glass border-white/10 hover:glow-border transition-all duration-500 flex items-center justify-center gap-4">
                <div className="absolute inset-0 bg-caramel/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <Lock className="w-5 h-5 text-cream group-hover:text-cream transition-colors" />
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-cream group-hover:text-cream transition-colors">
                  Complete Transaction
                </span>
              </button>
              
              <div className="flex items-center justify-center gap-8 text-cream/20">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">SSL Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">PCI Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </motion.main>
  );
};

export default Payment;
