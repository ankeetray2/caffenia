export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  description: string;
  image: string;
  category: string;
  details: string[];
  label: string;
  location?: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  profile?: {
    origin: string;
    roast: string;
    type: string;
    body?: string;
    acidity?: string;
  };
  flavorNotes?: string[];
  brewingMethods?: string[];
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  image: string;
}

export interface Review {
  id: string;
  userName: string;
  userImage: string;
  text: string;
  rating: number;
}

export interface CartItem extends Product {
  quantity: number;
}
