import { Product, Event, Review } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Assava Noir',
    price: 42.00,
    oldPrice: 55.00,
    description: 'A deep, mysterious roast with notes of dark chocolate and midnight jasmine.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800',
    category: 'Espresso',
    details: ['Pure Arabica', 'Sun-Kissed Robusta', 'Honey Processed Blend', 'Shade-Grown Specialty'],
    label: 'ETHIOPIA / DARK / SINGLE ORIGIN',
    location: 'Sidamo Highlands',
    rating: 4.9,
    reviews: 128,
    tag: 'Espresso',
    profile: {
      origin: 'Ethiopia',
      roast: 'Dark',
      type: 'Single Origin',
      body: 'Full',
      acidity: 'Bright'
    },
    flavorNotes: ['Dark Chocolate', 'Midnight Jasmine', 'Black Cherry'],
    brewingMethods: ['Espresso', 'V60', 'Moka Pot']
  },
  {
    id: '2',
    name: 'Velvet Ethereal',
    price: 38.00,
    oldPrice: 45.00,
    description: 'Silky smooth texture with a lingering sweetness of toasted hazelnuts.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
    category: 'Brew',
    details: ['Pure Arabica', 'Sun-Kissed Robusta', 'Honey Processed Blend', 'Shade-Grown Specialty'],
    label: 'BRAZIL / MEDIUM / BLEND',
    location: 'Milan, Italy',
    rating: 4.8,
    reviews: 256,
    tag: 'Brew',
    profile: {
      origin: 'Brazil',
      roast: 'Medium',
      type: 'Blend',
      body: 'Medium',
      acidity: 'Balanced'
    },
    flavorNotes: ['Hazelnut', 'Caramel', 'Milk Chocolate'],
    brewingMethods: ['V60', 'Chemex', 'Aeropress']
  },
  {
    id: '3',
    name: 'Golden Geisha',
    price: 120.00,
    oldPrice: 150.00,
    description: 'The crown jewel of ASSAVA. Sparkling acidity with peach blossom notes.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800',
    category: 'Special Reserve',
    details: ['Pure Arabica', 'Sun-Kissed Robusta', 'Honey Processed Blend', 'Shade-Grown Specialty'],
    label: 'PANAMA / LIGHT / SPECIAL RESERVE',
    location: 'Panama Valley',
    rating: 5.0,
    reviews: 64,
    tag: 'Brew',
    profile: {
      origin: 'Panama',
      roast: 'Light',
      type: 'Special Reserve',
      body: 'Light',
      acidity: 'High'
    },
    flavorNotes: ['Peach Blossom', 'Bergamot', 'Honey'],
    brewingMethods: ['V60', 'Chemex', 'Siphon']
  },
  {
    id: '4',
    name: 'Obsidian Mist',
    price: 45.00,
    oldPrice: 52.00,
    description: 'Clean, precise, and uncompromising. A masterclass in minimalist roasting.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    category: 'Artisan',
    details: ['Pure Arabica', 'Sun-Kissed Robusta', 'Honey Processed Blend', 'Shade-Grown Specialty'],
    label: 'COLOMBIA / MEDIUM / ARTISAN',
    location: 'Tokyo, Japan',
    rating: 4.7,
    reviews: 89,
    tag: 'Instant',
    profile: {
      origin: 'Guatemala',
      roast: 'Medium',
      type: 'Artisan',
      body: 'Medium',
      acidity: 'Balanced'
    },
    flavorNotes: ['Green Apple', 'Almond', 'Cane Sugar'],
    brewingMethods: ['Aeropress', 'V60', 'French Press']
  },
  {
    id: '5',
    name: 'Volcanic Ember',
    price: 48.00,
    oldPrice: 58.00,
    description: 'A robust blend with a smoky finish, reminiscent of a volcanic sunrise.',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=800',
    category: 'Dark Roast',
    details: ['Volcanic Soil Grown', 'Slow Roasted', 'Rich Body', 'Smoky Undertones'],
    label: 'INDONESIA / EXTRA DARK / SINGLE ORIGIN',
    location: 'Brooklyn, NY',
    rating: 4.6,
    reviews: 112,
    tag: 'Brew',
    profile: {
      origin: 'Colombia',
      roast: 'Medium-Dark',
      type: 'Cold Brew',
      body: 'Heavy',
      acidity: 'Low'
    },
    flavorNotes: ['Cocoa', 'Molasses', 'Walnut'],
    brewingMethods: ['Cold Brew', 'French Press', 'Aeropress']
  },
  {
    id: '6',
    name: 'Celestial Bloom',
    price: 52.00,
    oldPrice: 65.00,
    description: 'Light and airy with floral notes that dance on the palate.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800',
    category: 'Light Roast',
    details: ['High Altitude', 'Washed Process', 'Floral Aroma', 'Crisp Finish'],
    label: 'KENYA / LIGHT / SINGLE ORIGIN',
    location: 'London, UK',
    rating: 4.9,
    reviews: 76,
    tag: 'Espresso',
    profile: {
      origin: 'Costa Rica',
      roast: 'Light-Medium',
      type: 'Experimental'
    },
    flavorNotes: ['Strawberry', 'Floral', 'Honey'],
    brewingMethods: ['Espresso', 'V60']
  }
];

export const EVENTS: Event[] = [
  {
    id: '1',
    name: 'Midnight Cupping Session',
    date: 'April 12, 2026',
    description: 'An immersive sensory journey through our rarest single-origin beans.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    name: 'The Art of the Pour',
    date: 'May 05, 2026',
    description: 'Master the precision of V60 and Chemex brewing with our head roaster.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800'
  }
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Elena Vance',
    userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    text: 'The Golden Geisha is unlike anything I have ever tasted. Truly a cinematic experience in a cup.',
    rating: 5
  },
  {
    id: '2',
    userName: 'Marcus Thorne',
    userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    text: 'The Obsidian Mist is my daily ritual. The precision of the roast is unmatched.',
    rating: 5
  }
];

export const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=400'
];
