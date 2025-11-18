import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCard({ product, onAddToCart }) {
  const imageUrl = product.images?.[0] || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500";

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_new && (
              <Badge className="bg-gradient-to-r from-[var(--secondary)] to-yellow-500 text-white border-0 shadow-lg">
                Nouveau
              </Badge>
            )}
            {product.is_promo && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg">
                Promo
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 text-[var(--primary)]" />
            </Button>
          </div>

          {/* View Counter */}
          {product.views > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
              <Eye className="w-3 h-3" />
              {product.views}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold px-4 py-2 bg-red-500 rounded-full">
                Rupture de stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[var(--primary)] transition-colors">
            {product.name}
          </h3>
          
          {product.short_description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}

          <div className="mt-auto">
            <div className="flex items-center gap-2">
              {product.is_promo && product.original_price ? (
                <>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {product.price.toLocaleString()} FCFA
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    {product.original_price.toLocaleString()} FCFA
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {product.price.toLocaleString()} FCFA
                </span>
              )}
            </div>
            
            {product.stock <= 5 && product.stock > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Plus que {product.stock} en stock
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}