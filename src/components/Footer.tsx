import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Instagram, Twitter, Facebook, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-coffee-dark border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-caramel rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(198,142,93,0.3)] group-hover:scale-110 transition-transform">
                <Coffee className="text-coffee-dark w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-cream uppercase">ASSAVA</span>
            </Link>
            <p className="text-cream/40 text-sm font-light leading-relaxed max-w-xs">
              Igniting the soul through cinematic coffee experiences. Crafted with precision, roasted for the modern ritual.
            </p>
            <div className="flex items-center gap-6">
              <Instagram className="w-5 h-5 text-cream/20 hover:text-cream transition-colors cursor-pointer" />
              <Twitter className="w-5 h-5 text-cream/20 hover:text-cream transition-colors cursor-pointer" />
              <Facebook className="w-5 h-5 text-cream/20 hover:text-cream transition-colors cursor-pointer" />
            </div>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-caramel">Experience</h4>
            <ul className="space-y-4 text-sm font-light text-cream/40">
              <li><Link to="/about" className="hover:text-cream transition-colors">Our Story</Link></li>
              <li><Link to="/about" className="hover:text-cream transition-colors">Roasting Process</Link></li>
              <li><Link to="/about" className="hover:text-cream transition-colors">Brewing Guides</Link></li>
              <li><Link to="/category" className="hover:text-cream transition-colors">Locations</Link></li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-caramel">Collection</h4>
            <ul className="space-y-4 text-sm font-light text-cream/40">
              <li><Link to="/shopping" className="hover:text-cream transition-colors">The Roastery</Link></li>
              <li><Link to="/category" className="hover:text-cream transition-colors">Global Spaces</Link></li>
              <li><Link to="/shopping" className="hover:text-cream transition-colors">Special Reserve</Link></li>
              <li><Link to="/account" className="hover:text-cream transition-colors">Membership</Link></li>
            </ul>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.5em] text-caramel">Contact</h4>
            <ul className="space-y-4 text-sm font-light text-cream/40">
              <li>ritual@assava.coffee</li>
              <li><Link to="/about" className="hover:text-cream transition-colors">Contact Us</Link></li>
              <li>Brooklyn, NY 11201</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
          <span className="text-[10px] text-cream/20 uppercase tracking-[0.5em] font-bold">© 2026 ASSAVA COFFEE PLATFORM</span>
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full glass border-white/5 flex items-center justify-center hover:bg-caramel/90 hover:text-coffee-dark transition-all duration-300 group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
