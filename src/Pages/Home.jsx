import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import defaultCategoryImage from "@/assets/images/couverture esthétique.jfif";

export default function Home() {
  const [settings, setSettings] = useState(null);

  const { data: products = [] } = useQuery({
    queryKey: ['products-home'],
    queryFn: () => base44.entities.Product.filter({ is_available: true }, '-created_date', 8),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories-home'],
    queryFn: () => base44.entities.Category.list('order'),
  });

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

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity: 1
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const featuredProducts = products.filter(p => p.is_featured);
  const newProducts = products.filter(p => p.is_new);
  const promoProducts = products.filter(p => p.is_promo);

  const bannerImage = settings?.banner_image || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920";

  return (
    <div className="min-h-screen">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

      {/* Hero Banner */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-110"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4 text-[var(--secondary)]" />
              <span className="text-white text-sm font-medium">
                Collection Professionnelle 2025
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {settings?.banner_title || "L'Excellence en Équipement Beauté"}
            </h1>

            <p className="text-xl text-gray-200 leading-relaxed">
              {settings?.banner_subtitle || "Découvrez notre sélection d'équipements professionnels pour salons de beauté et coiffure"}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("Catalog")}>
                <Button size="lg" className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:shadow-2xl hover:scale-105 transition-all duration-300 text-white border-0 w-full sm:w-auto">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Découvrir le Catalogue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Floating Decoration */}
          <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 float-animation">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--secondary)]/20 backdrop-blur-xl border border-white/20" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos Catégories
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Explorez notre gamme complète d'équipements professionnels
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={createPageUrl(`Catalog?category=${category.id}`)}
                  className="group relative h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-500"
                    style={{ 
                      backgroundImage: `url(${category.image_url || defaultCategoryImage})` 
                    }}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-end p-4">
                    <h3 className="text-white font-bold text-lg group-hover:text-[var(--primary)] transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Produits Phares
                </h2>
                <p className="text-gray-600">Nos meilleures ventes du moment</p>
              </div>
              <Link to={createPageUrl("Catalog")}>
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Products */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full mb-3">
                  <Sparkles className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 text-sm font-medium">Nouveautés</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Dernières Arrivées
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotions */}
      {promoProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-red-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
                <TrendingUp className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">Offres Spéciales</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Promotions en Cours
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {promoProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] relative overflow-hidden">
        <div className="absolute inset-0 shimmer opacity-20" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Besoin d'aide pour choisir ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Notre équipe est là pour vous conseiller et vous accompagner dans votre projet
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-gray-100 hover:scale-105 transition-all duration-300">
              Contactez-nous
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}