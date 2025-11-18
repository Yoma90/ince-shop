import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Package, AlertCircle, TrendingUp, Settings, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 100),
    enabled: user?.role === 'admin'
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => base44.entities.Product.list(),
    enabled: user?.role === 'admin'
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès refusé</h2>
            <p className="text-gray-600 mb-6">Vous devez être administrateur pour accéder à cette page.</p>
            <Link to={createPageUrl("Home")}>
              <Button>Retour à l'accueil</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const lowStockProducts = products.filter(p => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter(p => p.stock === 0);
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-sm text-gray-600">Bienvenue, {user.full_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to={createPageUrl("Home")}>
                <Button variant="outline">Voir le site</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link to={createPageUrl("AdminProducts")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Produits</CardTitle>
                <Package className="w-5 h-5 text-[var(--primary)]" />
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{products.length}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">Gérer les produits</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminOrders")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Commandes</CardTitle>
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {pendingOrders.length} en attente
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("AdminSettings")}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Paramètres</CardTitle>
                <Settings className="w-5 h-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">⚙️</div>
                <p className="text-xs text-gray-500 mt-1">Configuration du site</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenu Total</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalRevenue.toLocaleString()} FCFA
                  </div>
                  <div className="flex items-center text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Toutes commandes
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En attente</CardTitle>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-orange-600">{pendingOrders.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Commandes à traiter</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Stock Faible</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Produits à réapprovisionner</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Rupture</CardTitle>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Produits en rupture</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {pendingOrders.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {pendingOrders.length} commande{pendingOrders.length > 1 ? 's' : ''} en attente
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Vous avez des commandes qui nécessitent votre attention
                    </p>
                    <Link to={createPageUrl("AdminOrders")}>
                      <Button size="sm" variant="outline" className="bg-white">
                        Voir les commandes
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {lowStockProducts.length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Package className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Stock faible détecté
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {lowStockProducts.length} produit{lowStockProducts.length > 1 ? 's ont' : ' a'} un stock inférieur à 5 unités
                    </p>
                    <Link to={createPageUrl("AdminProducts")}>
                      <Button size="sm" variant="outline" className="bg-white">
                        Gérer les stocks
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}