import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/CoffeeComponents';
import Footer from '../components/Footer';
import { PRODUCTS } from '../constants';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = ({ cartCount, onOpenCart, onOpenCategories }: { cartCount: number, onOpenCart: () => void, onOpenCategories: () => void }) => {
  // Mock cart items
  const cartItems = [
    { ...PRODUCTS[0], quantity: 1 },
    { ...PRODUCTS[1], quantity: 2 }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 15.00;
  const total = subtotal + shipping;

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
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Checkout</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Your Ritual</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2 space-y-8">
              {cartItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.8 }}
                  className="group relative glass rounded-[40px] p-8 hover:glow-border transition-all duration-500 flex flex-col sm:flex-row items-center gap-10 overflow-hidden"
                >
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-caramel/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-caramel/20 transition-colors" />
                  
                  <div className="w-32 h-32 rounded-[30px] overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold tracking-tighter uppercase group-hover:text-cream transition-colors">{item.name}</h3>
                      <span className="text-cream font-bold">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-cream/40 text-sm font-light leading-relaxed line-clamp-1">{item.description}</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-6 glass rounded-full px-4 py-2 border-white/5">
                        <button className="text-cream/40 hover:text-cream transition-colors"><Minus className="w-4 h-4" /></button>
                        <span className="text-sm font-bold text-cream/80">{item.quantity}</span>
                        <button className="text-cream/40 hover:text-cream transition-colors"><Plus className="w-4 h-4" /></button>
                      </div>
                      <button className="text-cream/20 hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-8">
              <div className="glass rounded-[40px] p-10 space-y-10 sticky top-32 border-white/5">
                <h3 className="text-2xl font-bold tracking-tighter uppercase">Summary</h3>
                
                <div className="space-y-6 text-sm font-light text-cream/60">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-cream/80 font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Shipping</span>
                    <span className="text-cream/80 font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="pt-6 border-t border-white/5 flex justify-between items-center text-xl font-bold text-cream">
                    <span>Total</span>
                    <span className="text-cream">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                <Link to="/payment" className="block">
                  <button className="w-full group relative px-12 py-5 rounded-full overflow-hidden glass border-white/10 hover:glow-border transition-all duration-500 flex items-center justify-center gap-4">
                    <div className="absolute inset-0 bg-caramel/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <ShoppingBag className="w-5 h-5 text-cream group-hover:text-cream transition-colors" />
                    <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-cream group-hover:text-cream transition-colors">
                      Proceed to Ritual
                    </span>
                  </button>
                </Link>
                
                <p className="text-[10px] text-center text-cream/20 uppercase tracking-[0.2em] font-bold">
                  Free shipping on orders over $150
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </motion.main>
  );
};

export default Cart;
