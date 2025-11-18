import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Package, Truck, Shield, ArrowLeft } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const products = await base44.entities.Product.filter({ id: productId });
      if (products.length > 0) {
        // Increment views
        await base44.entities.Product.update(productId, {
          views: (products[0].views || 0) + 1
        });
        return products[0];
      }
      return null;
    },
    enabled: !!productId
  });

  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.category_id],
    queryFn: () => {
      if (!product) return [];
      return base44.entities.Product.filter({
        category_id: product.category_id,
        is_available: true
      }, '-created_date', 4);
    },
    enabled: !!product
  });

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity
      });
    }
    
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <Skeleton className="aspect-square w-full rounded-2xl mb-4" />
              <div className="grid grid-cols-4 gap-4">
                {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-xl" />)}
              </div>
            </div>
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <Link to={createPageUrl("Catalog")}>
            <Button>Retour au catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to={createPageUrl("Home")} className="text-gray-500 hover:text-[var(--primary)]">Accueil</Link>
            <span className="text-gray-400">/</span>
            <Link to={createPageUrl("Catalog")} className="text-gray-500 hover:text-[var(--primary)]">Catalogue</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={createPageUrl("Catalog")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au catalogue
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4 relative">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-[var(--secondary)] to-yellow-500 text-white border-0">
                  Nouveau
                </Badge>
              )}
              {product.is_promo && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
                  Promo
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-[var(--primary)] scale-95' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

            {product.short_description && (
              <p className="text-lg text-gray-600 mb-6">{product.short_description}</p>
            )}

            {/* Price */}
            <div className="mb-8">
              {product.is_promo && product.original_price ? (
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-[var(--primary)]">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-2xl text-gray-400 line-through">
                    {product.original_price.toLocaleString()} FCFA
                  </span>
                  <Badge className="bg-red-500 text-white">
                    -{Math.round((1 - product.price / product.original_price) * 100)}%
                  </Badge>
                </div>
              ) : (
                <span className="text-4xl font-bold text-gray-900">
                  {product.price.toLocaleString()} FCFA
                </span>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b">
              {product.is_available ? (
                <>
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">En stock</span>
                  </div>
                  {product.stock <= 5 && (
                    <span className="text-orange-600 text-sm">
                      Plus que {product.stock} disponibles
                    </span>
                  )}
                </>
              ) : (
                <div className="text-red-600 font-medium">Rupture de stock</div>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            {product.is_available && (
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <label className="font-medium text-gray-900">Quantité:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border rounded-lg py-2"
                      min="1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-xl transition-all"
                  onClick={addToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Ajouté au panier
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Ajouter au panier
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Features */}
            <div className="grid gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Livraison rapide</h4>
                  <p className="text-sm text-gray-600">Sous 2-5 jours ouvrés</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Package className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Paiement à la livraison</h4>
                  <p className="text-sm text-gray-600">Payez en espèces à la réception</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <Shield className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Garantie qualité</h4>
                  <p className="text-sm text-gray-600">Produits authentiques certifiés</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}

            {/* Technical Details */}
            {product.technical_details && (
              <div className="border-t pt-8 mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Détails techniques</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.technical_details}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.filter(p => p.id !== product.id).length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts
                .filter(p => p.id !== product.id)
                .slice(0, 4)
                .map((relatedProduct) => (
                  <ProductCard
                    key={relatedProduct.id}
                    product={relatedProduct}
                    onAddToCart={() => {}}
                  />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}