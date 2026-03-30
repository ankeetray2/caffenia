import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Account from './pages/Account';
import { ShoppingPage, CategoryPage, ThankYouPage, OrderHistoryPage, TrackingPage, SearchPage, ScrollStory } from './components/CoffeeComponents';
import Lenis from '@studio-freight/lenis';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  const [cart, setCart] = React.useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = React.useState(false);

  const handleAddToCart = (item: any) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  useEffect(() => {
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home cartCount={cart.length} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/home" element={<Home cartCount={cart.length} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/shop" element={<Shop cartCount={cart.length} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/shopping" element={<Shop cartCount={cart.length} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/category" element={<CategoryPage cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/coffeeDetail/:id" element={<ProductDetail cartCount={cart.length} onAddToCart={handleAddToCart} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/cart" element={<Cart cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/payment" element={<Payment cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/account" element={<Account cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/orderHistory" element={<OrderHistoryPage cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/tracking" element={<TrackingPage cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/thankyou" element={<ThankYouPage cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/search" element={<SearchPage cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
        <Route path="/about" element={<ScrollStory cartCount={cart.length} onOpenCart={() => setIsCartOpen(true)} onOpenCategories={() => setIsCategoriesOpen(true)} />} />
      </Routes>
    </Router>
  );
}

export default App;
