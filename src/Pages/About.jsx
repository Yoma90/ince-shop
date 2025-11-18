import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Award, Heart, Users, Sparkles } from "lucide-react";

export default function About() {
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

  const defaultText = `Bienvenue dans notre univers beauté !

Nous sommes une entreprise spécialisée dans la fourniture d'équipements professionnels de haute qualité pour les salons de beauté, coiffure et instituts de soins.

Notre mission est de vous accompagner dans la réussite de votre activité en vous proposant des produits innovants, durables et esthétiques qui subliment vos espaces professionnels.

Forte d'une expérience reconnue dans le secteur, notre équipe sélectionne avec soin chaque produit pour garantir confort, élégance et performance.

Que vous soyez coiffeur, esthéticienne ou gérant d'un spa, nous avons la solution adaptée à vos besoins.`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            À Propos de Nous
          </h1>
          <p className="text-xl text-white/90">
            Votre partenaire de confiance pour l'équipement professionnel beauté
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {settings?.about_text || defaultText}
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Qualité Premium</h3>
            <p className="text-gray-600">
              Nous sélectionnons uniquement des équipements de haute qualité répondant aux standards professionnels les plus exigeants.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-100 to-pink-200 flex items-center justify-center mb-4">
              <Heart className="w-7 h-7 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Service Client</h3>
            <p className="text-gray-600">
              Notre équipe dévouée est à votre écoute pour vous conseiller et vous accompagner dans tous vos projets.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expertise</h3>
            <p className="text-gray-600">
              Des années d'expérience dans le secteur nous permettent de comprendre parfaitement vos besoins spécifiques.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center mb-4">
              <Sparkles className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation</h3>
            <p className="text-gray-600">
              Nous restons à l'affût des dernières tendances pour vous proposer des produits toujours plus innovants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}