import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass px-6 py-4 md:px-12 lg:px-24 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-10 h-10 bg-caramel rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(198,142,93,0.3)] group-hover:scale-110 transition-transform">
          <Coffee className="text-coffee-dark w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tighter text-cream uppercase">ASSAVA</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.3em] text-cream/70">
        <Link to="/" className="hover:text-cream transition-colors">Experience</Link>
        <Link to="/shop" className="hover:text-cream transition-colors">Collection</Link>
        <Link to="/" className="hover:text-cream transition-colors">Events</Link>
      </div>
      
      <div className="flex items-center gap-6">
        <Link to="/cart" className="relative p-2 hover:bg-white/10 rounded-full transition-colors group">
          <ShoppingCart className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-caramel text-coffee-dark text-[10px] font-bold rounded-full flex items-center justify-center">0</span>
        </Link>
        <Link to="/account" className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm font-semibold hover:glow-border transition-all">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Account</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
