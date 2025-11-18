import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    loadCart();
    loadDeliveryFee();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  };

  const loadDeliveryFee = async () => {
    try {
      const settings = await base44.entities.SiteSettings.list();
      if (settings.length > 0) {
        setDeliveryFee(settings[0].delivery_fee || 0);
      }
    } catch (error) {
      console.error("Error loading delivery fee:", error);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Découvrez nos produits et commencez vos achats</p>
          <Link to={createPageUrl("Catalog")}>
            <Button size="lg" className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
              Voir le catalogue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Mon Panier</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-[var(--primary)] mb-4">
                        {item.price.toLocaleString()} FCFA
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 h-8 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Total for item */}
                    <div className="hidden md:block text-right">
                      <p className="text-sm text-gray-500 mb-1">Total</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-[var(--primary)]">{total.toLocaleString()} FCFA</span>
                </div>
              </div>

              <Link to={createPageUrl("Checkout")}>
                <Button size="lg" className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-xl transition-all">
                  Passer la commande
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link to={createPageUrl("Catalog")}>
                <Button variant="outline" size="lg" className="w-full mt-3">
                  Continuer mes achats
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t text-center text-sm text-gray-500">
                <p>💳 Paiement à la livraison</p>
                <p className="mt-2">🚚 Livraison sous 2-5 jours ouvrés</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}