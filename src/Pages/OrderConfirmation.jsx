import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Phone, Mail, Home } from "lucide-react";
import confetti from "canvas-confetti";

export default function OrderConfirmation() {
  const urlParams = new URLSearchParams(window.location.search);
  const orderNumber = urlParams.get('order');

  useEffect(() => {
    // Confetti celebration
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!orderNumber) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h2>
          <Link to={createPageUrl("Home")}>
            <Button>Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Commande confirmée !
          </h1>
          <p className="text-xl text-gray-600">
            Merci pour votre confiance
          </p>
        </div>

        {/* Order Number */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center pb-6 border-b">
            <p className="text-sm text-gray-600 mb-2">Numéro de commande</p>
            <p className="text-2xl font-bold text-[var(--primary)]">{orderNumber}</p>
          </div>

          {/* Next Steps */}
          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Prochaines étapes</h2>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Préparation de votre commande</h3>
                  <p className="text-sm text-gray-600">
                    Nous préparons soigneusement vos articles et les emballons pour l'expédition.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Confirmation téléphonique</h3>
                  <p className="text-sm text-gray-600">
                    Notre équipe vous contactera sous 24h pour confirmer votre commande et l'adresse de livraison.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Livraison sous 2-5 jours</h3>
                  <p className="text-sm text-gray-600">
                    Votre commande sera livrée à l'adresse indiquée. Paiement en espèces à la réception.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">💡 Bon à savoir</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Conservez votre numéro de commande pour le suivi</li>
            <li>• Le paiement s'effectue en espèces à la livraison</li>
            <li>• Vous pouvez nous contacter à tout moment pour toute question</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to={createPageUrl("Home")} className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              <Home className="w-5 h-5 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>
          <Link to={createPageUrl("Catalog")} className="flex-1">
            <Button size="lg" className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white">
              Continuer mes achats
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}