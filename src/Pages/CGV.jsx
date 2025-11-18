import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { FileText } from "lucide-react";

export default function CGV() {
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

  const defaultCGV = `CONDITIONS GÉNÉRALES DE VENTE

1. OBJET
Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre notre entreprise et ses clients dans le cadre de la vente d'équipements professionnels.

2. COMMANDES
Toute commande implique l'acceptation sans réserve des présentes CGV. La confirmation de commande est effective après validation téléphonique.

3. PRIX
Les prix sont indiqués en FCFA et sont valables au jour de la commande. Ils incluent la TVA mais excluent les frais de livraison sauf mention contraire.

4. PAIEMENT
Le paiement s'effectue en espèces à la livraison. Le client doit s'assurer de disposer du montant exact lors de la réception.

5. LIVRAISON
Les délais de livraison sont de 2 à 5 jours ouvrés. Notre équipe vous contactera pour confirmer la livraison. La livraison s'effectue à l'adresse indiquée lors de la commande.

6. GARANTIE
Tous nos produits bénéficient d'une garantie constructeur. Les conditions de garantie varient selon les produits.

7. RETOURS
Les produits peuvent être retournés dans un délai de 7 jours suivant la livraison, dans leur emballage d'origine et en parfait état.

8. RÉCLAMATIONS
Toute réclamation doit être formulée dans les 48 heures suivant la livraison par téléphone ou email.

9. DONNÉES PERSONNELLES
Vos données personnelles sont collectées uniquement dans le cadre du traitement de votre commande et ne seront jamais cédées à des tiers.

10. DROIT APPLICABLE
Ces CGV sont régies par le droit ivoirien. Tout litige relève de la compétence des tribunaux d'Abidjan.`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Conditions Générales de Vente
          </h1>
          <p className="text-white/90">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {settings?.cgv_text || defaultCGV}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}