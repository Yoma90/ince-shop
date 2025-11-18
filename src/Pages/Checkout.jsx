import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, User, Phone, Mail, MapPin, FileText } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    client_phone: "",
    client_email: "",
    client_address: "",
    notes: ""
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (savedCart.length === 0) {
      navigate(createPageUrl("Cart"));
      return;
    }
    setCart(savedCart);
    loadDeliveryFee();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const total = subtotal + deliveryFee;
      const orderNumber = `CMD-${Date.now()}`;

      const orderData = {
        order_number: orderNumber,
        ...formData,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          product_image: item.image,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: "pending"
      };

      await base44.entities.Order.create(orderData);

      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      // Navigate to confirmation
      navigate(createPageUrl(`OrderConfirmation?order=${orderNumber}`));
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Finaliser ma commande</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Client Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Informations client</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="client_name">Nom complet *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => handleChange("client_name", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client_phone">Téléphone *</Label>
                    <Input
                      id="client_phone"
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) => handleChange("client_phone", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client_email">Email (optionnel)</Label>
                    <Input
                      id="client_email"
                      type="email"
                      value={formData.client_email}
                      onChange={(e) => handleChange("client_email", e.target.value)}
                      className="mt-1"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="client_address">Adresse de livraison *</Label>
                    <Textarea
                      id="client_address"
                      value={formData.client_address}
                      onChange={(e) => handleChange("client_address", e.target.value)}
                      required
                      className="mt-1"
                      placeholder="Adresse complète de livraison"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      className="mt-1"
                      placeholder="Informations complémentaires..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Paiement à la livraison</h3>
                    <p className="text-sm text-gray-600">
                      Vous paierez en espèces au moment de la réception de votre commande. 
                      Notre livreur vous contactera avant la livraison.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Votre commande</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-gray-500">Qté: {item.quantity}</p>
                        <p className="text-sm font-semibold text-[var(--primary)]">
                          {(item.price * item.quantity).toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium">{subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium">{deliveryFee.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                    <span>Total</span>
                    <span className="text-[var(--primary)]">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-xl transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Traitement..." : "Confirmer la commande"}
                </Button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  En confirmant, vous acceptez nos conditions générales de vente
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}