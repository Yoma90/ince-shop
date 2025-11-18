import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, Download } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      setSelectedOrder(null);
    },
  });

  const filteredOrders = filterStatus === "all" 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const statusColors = {
    pending: "bg-orange-100 text-orange-800",
    confirmed: "bg-blue-100 text-blue-800",
    preparing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    pending: "En attente",
    confirmed: "Confirmée",
    preparing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée"
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Numéro", "Client", "Téléphone", "Total", "Statut", "Date"].join(","),
      ...filteredOrders.map(order => [
        order.order_number,
        order.client_name,
        order.client_phone,
        order.total,
        statusLabels[order.status],
        format(new Date(order.created_date), "dd/MM/yyyy")
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commandes_${Date.now()}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("AdminDashboard")}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
            </div>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 flex gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les commandes</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="confirmed">Confirmées</SelectItem>
              <SelectItem value="preparing">En préparation</SelectItem>
              <SelectItem value="shipped">Expédiées</SelectItem>
              <SelectItem value="delivered">Livrées</SelectItem>
              <SelectItem value="cancelled">Annulées</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Orders Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg overflow-hidden">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="p-4 border-b">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600">Les commandes apparaîtront ici</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{order.client_name}</div>
                        {order.client_email && (
                          <div className="text-sm text-gray-500">{order.client_email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {order.client_phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">
                          {order.total?.toLocaleString()} FCFA
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={statusColors[order.status]}>
                          {statusLabels[order.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {format(new Date(order.created_date), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Number & Status */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-500">Numéro de commande</p>
                  <p className="font-mono font-bold text-lg">{selectedOrder.order_number}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(new Date(selectedOrder.created_date), "dd MMMM yyyy 'à' HH:mm")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Changer le statut</p>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(status) => updateStatusMutation.mutate({ id: selectedOrder.id, status })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="preparing">En préparation</SelectItem>
                      <SelectItem value="shipped">Expédiée</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Informations client</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-600">Nom:</span> <span className="font-medium">{selectedOrder.client_name}</span></p>
                  <p><span className="text-gray-600">Téléphone:</span> <span className="font-medium">{selectedOrder.client_phone}</span></p>
                  {selectedOrder.client_email && (
                    <p><span className="text-gray-600">Email:</span> <span className="font-medium">{selectedOrder.client_email}</span></p>
                  )}
                  <p><span className="text-gray-600">Adresse:</span> <span className="font-medium">{selectedOrder.client_address}</span></p>
                  {selectedOrder.notes && (
                    <p><span className="text-gray-600">Notes:</span> <span className="font-medium">{selectedOrder.notes}</span></p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Produits commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex gap-4 bg-gray-50 rounded-lg p-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={item.product_image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=100"}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} x {item.price?.toLocaleString()} FCFA
                        </p>
                        <p className="text-sm font-semibold text-gray-900 mt-1">
                          Total: {item.total?.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-medium">{selectedOrder.subtotal?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span className="font-medium">{selectedOrder.delivery_fee?.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                    <span>Total</span>
                    <span className="text-[var(--primary)]">{selectedOrder.total?.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}