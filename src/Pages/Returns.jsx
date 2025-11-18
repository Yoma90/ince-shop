import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Returns() {
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

  const defaultPolicy = `POLITIQUE DE RETOUR ET REMBOURSEMENT

Votre satisfaction est notre priorité. Si vous n'êtes pas entièrement satisfait de votre achat, nous acceptons les retours dans les conditions suivantes :

DÉLAI DE RETOUR
Vous disposez de 7 jours à compter de la réception de votre commande pour nous retourner un produit.

CONDITIONS DE RETOUR
Pour être accepté, le retour doit respecter les conditions suivantes :
• Le produit doit être dans son emballage d'origine
• Le produit ne doit pas avoir été utilisé ou endommagé
• Tous les accessoires et documents doivent être présents
• Le produit ne doit présenter aucune trace d'installation ou d'utilisation

PROCÉDURE DE RETOUR
1. Contactez notre service client par téléphone ou email
2. Indiquez votre numéro de commande et le motif du retour
3. Notre équipe vous communiquera les instructions de retour
4. Emballez soigneusement le produit
5. Envoyez le colis à l'adresse indiquée

REMBOURSEMENT
Une fois le produit retourné et vérifié :
• Si le produit est conforme aux conditions, nous procédons au remboursement sous 5-7 jours ouvrés
• Les frais de livraison initiaux ne sont pas remboursables
• Les frais de retour sont à la charge du client

ÉCHANGE
Si vous souhaitez échanger un produit contre un autre modèle :
• Contactez-nous avant de retourner le produit
• Nous vous guiderons dans la procédure d'échange
• La différence de prix éventuelle sera régularisée

PRODUITS NON RETOURNABLES
Certains produits ne peuvent être retournés pour des raisons d'hygiène ou de sécurité :
• Produits personnalisés ou sur-mesure
• Produits endommagés par le client
• Produits dont l'emballage a été ouvert (pour certains articles)

EXCEPTIONS
Les retours pour produits défectueux ou erreur de notre part sont pris en charge intégralement (frais de retour inclus).

CONTACT
Pour toute question concernant les retours, n'hésitez pas à nous contacter :
• Par téléphone
• Par email
• Via WhatsApp

Notre équipe est là pour vous accompagner et trouver la meilleure solution.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Politique de Retour
          </h1>
          <p className="text-white/90">Modalités de retour et remboursement</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">7 Jours</h3>
            <p className="text-gray-600">Pour retourner un produit</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Conditions</h3>
            <p className="text-gray-600">Produit neuf et emballé</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remboursement</h3>
            <p className="text-gray-600">Sous 5-7 jours ouvrés</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {settings?.return_policy || defaultPolicy}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}