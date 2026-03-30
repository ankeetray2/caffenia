import React from 'react';
import { Navbar } from '../components/CoffeeComponents';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { User, MapPin, HelpCircle, ChevronDown, LogOut, Package, Settings, Heart } from 'lucide-react';

const Account = ({ cartCount, onOpenCart, onOpenCategories }: { cartCount: number, onOpenCart: () => void, onOpenCategories: () => void }) => {
  const faqs = [
    { q: "How do you source your beans?", a: "We source our beans through direct trade with small-scale volcanic farmers in Ethiopia, Colombia, and Indonesia." },
    { q: "What is your roasting philosophy?", a: "We believe in precision. Each batch is roasted to highlight the unique cinematic profile of the origin." },
    { q: "Do you offer international shipping?", a: "Yes, we ship our cinematic coffee experiences to over 50 countries worldwide." }
  ];

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
            <span className="text-caramel font-mono text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Profile</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-glow uppercase">Your Account</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="glass rounded-[40px] p-8 space-y-8 border-white/5">
                <div className="flex flex-col items-center gap-6 pb-8 border-b border-white/5">
                  <div className="w-24 h-24 rounded-full glass flex items-center justify-center border-white/10 group">
                    <User className="w-12 h-12 text-cream group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold tracking-tighter uppercase">Elena Vance</h3>
                    <p className="text-[10px] text-cream/60 uppercase tracking-[0.2em] font-bold">Member since 2024</p>
                  </div>
                </div>
                
                <nav className="space-y-2">
                  {[
                    { icon: Package, label: "Orders" },
                    { icon: Heart, label: "Wishlist" },
                    { icon: Settings, label: "Settings" },
                    { icon: LogOut, label: "Sign Out", color: "text-red-500" }
                  ].map((item, i) => (
                    <button key={i} className={`w-full flex items-center gap-4 px-6 py-4 rounded-full glass border-white/5 hover:glow-border transition-all text-[10px] font-bold uppercase tracking-[0.4em] ${item.color || 'text-cream/60 hover:text-cream'}`}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Address Form */}
              <div className="glass rounded-[60px] p-12 space-y-12 border-white/5 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-caramel/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="flex items-center gap-4 text-cream relative z-10">
                  <MapPin className="w-6 h-6" />
                  <h3 className="text-2xl font-bold tracking-tighter uppercase">Ritual Delivery Address</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">Full Name</label>
                    <input type="text" placeholder="Elena Vance" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">Phone Number</label>
                    <input type="text" placeholder="+1 (555) 000-0000" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">Address</label>
                    <input type="text" placeholder="123 Ritual Lane, Apt 4B" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">City</label>
                    <input type="text" placeholder="Brooklyn" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">State</label>
                      <input type="text" placeholder="NY" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-[0.5em] text-cream/60">Pin Code</label>
                      <input type="text" placeholder="11201" className="w-full glass rounded-[30px] px-8 py-5 border-white/10 focus:border-cream/50 outline-none text-cream/80 placeholder:text-cream/10" />
                    </div>
                  </div>
                </div>
                
                <button className="group relative px-12 py-5 rounded-full overflow-hidden glass border-white/10 hover:glow-border transition-all duration-500 flex items-center justify-center gap-4 relative z-10">
                  <div className="absolute inset-0 bg-caramel/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="relative z-10 text-[10px] font-bold uppercase tracking-[0.4em] text-cream group-hover:text-cream transition-colors">
                    Update Address
                  </span>
                </button>
              </div>
              
              {/* FAQ Section */}
              <div className="glass rounded-[60px] p-12 space-y-12 border-white/5">
                <div className="flex items-center gap-4 text-cream">
                  <HelpCircle className="w-6 h-6" />
                  <h3 className="text-2xl font-bold tracking-tighter uppercase">Ritual FAQ</h3>
                </div>
                
                <div className="space-y-6">
                  {faqs.map((faq, i) => (
                    <div key={i} className="glass rounded-[40px] p-8 border-white/5 space-y-4 group cursor-pointer hover:bg-white/5 transition-all">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-bold tracking-tighter uppercase text-cream/80 group-hover:text-cream transition-colors">{faq.q}</h4>
                        <ChevronDown className="w-5 h-5 text-cream/20 group-hover:text-cream transition-colors" />
                      </div>
                      <p className="text-sm font-light text-cream/60 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
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

export default Account;
