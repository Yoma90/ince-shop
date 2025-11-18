import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Truck, Package, MapPin, Clock } from "lucide-react";

export default function Shipping() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsList = await base44.entities.SiteSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const defaultPolicy = `POLITIQUE DE LIVRAISON

Nous nous engageons à vous livrer vos produits dans les meilleures conditions.

ZONES DE LIVRAISON
Nous livrons sur l'ensemble du territoire national. Des frais de livraison s'appliquent selon la zone.

DÉLAIS DE LIVRAISON
• Zone urbaine d'Abidjan : 2-3 jours ouvrés
• Autres villes : 3-5 jours ouvrés
• Zones éloignées : sur devis

FRAIS DE LIVRAISON
${settings?.delivery_fee ? `Les frais de livraison sont de ${settings.delivery_fee.toLocaleString()} FCFA.` : 'Les frais de livraison varient selon la zone.'}
${settings?.free_delivery_threshold ? `Livraison gratuite pour toute commande supérieure à ${settings.free_delivery_threshold.toLocaleString()} FCFA.` : ''}

SUIVI DE COMMANDE
Après la confirmation de votre commande, notre équipe vous contactera pour :
• Confirmer l'adresse de livraison
• Vous informer de la date de livraison prévue
• Coordonner le rendez-vous de livraison

RÉCEPTION DE LA COMMANDE
À la réception :
• Vérifiez l'état de l'emballage
• Contrôlez le contenu de votre commande
• Signalez immédiatement toute anomalie au livreur

PROBLÈME DE LIVRAISON
En cas de problème (retard, colis endommagé, erreur), contactez-nous immédiatement :
• Par téléphone
• Par email
• Via WhatsApp

Nous nous engageons à résoudre rapidement tout problème de livraison.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Politique de Livraison
          </h1>
          <p className="text-white/90">Tout ce qu'il faut savoir sur nos livraisons</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Livraison Rapide</h3>
            <p className="text-gray-600">Délai de 2 à 5 jours ouvrés selon votre zone</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Colis Sécurisé</h3>
            <p className="text-gray-600">Emballage soigné pour protéger vos produits</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Couverture Nationale</h3>
            <p className="text-gray-600">Nous livrons partout en Côte d'Ivoire</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center mb-4">
              <Truck className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Suivi Personnalisé</h3>
            <p className="text-gray-600">Contact avant livraison pour coordonner</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {settings?.shipping_policy || defaultPolicy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}