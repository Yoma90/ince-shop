import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Upload } from "lucide-react";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    site_name: "",
    logo_url: "",
    banner_image: "",
    banner_title: "",
    banner_subtitle: "",
    contact_phone: "",
    contact_whatsapp: "",
    contact_email: "",
    contact_address: "",
    facebook_url: "",
    instagram_url: "",
    delivery_fee: 0,
    free_delivery_threshold: 0,
    about_text: "",
    cgv_text: "",
    shipping_policy: "",
    return_policy: "",
    primary_color: "#E8B4B8",
    secondary_color: "#D4AF37"
  });
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsList = await base44.entities.SiteSettings.list();
      if (settingsList.length > 0) {
        setSettings(settingsList[0]);
        setFormData(settingsList[0]);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settings) {
        await base44.entities.SiteSettings.update(settings.id, formData);
      } else {
        await base44.entities.SiteSettings.create(formData);
      }
      alert("Paramètres enregistrés avec succès");
      await loadSettings();
      queryClient.invalidateQueries();
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, [field]: result.file_url }));
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Erreur lors du téléchargement");
    } finally {
      setUploading(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Paramètres du Site</h1>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
            <TabsTrigger value="delivery">Livraison</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div>
                <Label htmlFor="site_name">Nom du site</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => setFormData({...formData, site_name: e.target.value})}
                  placeholder="Ince Shop"
                />
              </div>

              <div>
                <Label htmlFor="logo">Logo</Label>
                <div className="flex items-center gap-4">
                  {formData.logo_url && (
                    <img src={formData.logo_url} alt="Logo" className="h-16" />
                  )}
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo_url')}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="banner_image">Image bannière</Label>
                <div className="mb-2">
                  {formData.banner_image && (
                    <img src={formData.banner_image} alt="Banner" className="h-32 rounded-lg object-cover" />
                  )}
                </div>
                <Input
                  id="banner_image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'banner_image')}
                  disabled={uploading}
                />
              </div>

              <div>
                <Label htmlFor="banner_title">Titre bannière</Label>
                <Input
                  id="banner_title"
                  value={formData.banner_title}
                  onChange={(e) => setFormData({...formData, banner_title: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="banner_subtitle">Sous-titre bannière</Label>
                <Input
                  id="banner_subtitle"
                  value={formData.banner_subtitle}
                  onChange={(e) => setFormData({...formData, banner_subtitle: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary_color">Couleur principale</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      placeholder="#E8B4B8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondary_color">Couleur secondaire</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                      placeholder="#D4AF37"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div>
                <Label htmlFor="contact_phone">Téléphone</Label>
                <Input
                  id="contact_phone"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
                  placeholder="+237 655-669-407/658-288-757"
                />
              </div>

              <div>
                <Label htmlFor="contact_whatsapp">WhatsApp</Label>
                <Input
                  id="contact_whatsapp"
                  value={formData.contact_whatsapp}
                  onChange={(e) => setFormData({...formData, contact_whatsapp: e.target.value})}
                  placeholder="+237 655-669-407/654-764-207"
                />
              </div>

              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({...formData, contact_email: e.target.value})}
                  placeholder="jcnawe@gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="contact_address">Adresse</Label>
                <Textarea
                  id="contact_address"
                  value={formData.contact_address}
                  onChange={(e) => setFormData({...formData, contact_address: e.target.value})}
                  rows={3}
                  placeholder="Yaoundé, Cameroun"
                />
              </div>
            </div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div>
                <Label htmlFor="about_text">À propos</Label>
                <Textarea
                  id="about_text"
                  value={formData.about_text}
                  onChange={(e) => setFormData({...formData, about_text: e.target.value})}
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="cgv_text">Conditions générales de vente</Label>
                <Textarea
                  id="cgv_text"
                  value={formData.cgv_text}
                  onChange={(e) => setFormData({...formData, cgv_text: e.target.value})}
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="shipping_policy">Politique de livraison</Label>
                <Textarea
                  id="shipping_policy"
                  value={formData.shipping_policy}
                  onChange={(e) => setFormData({...formData, shipping_policy: e.target.value})}
                  rows={8}
                />
              </div>

              <div>
                <Label htmlFor="return_policy">Politique de retour</Label>
                <Textarea
                  id="return_policy"
                  value={formData.return_policy}
                  onChange={(e) => setFormData({...formData, return_policy: e.target.value})}
                  rows={8}
                />
              </div>
            </div>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery" className="space-y-6">
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div>
                <Label htmlFor="delivery_fee">Frais de livraison (FCFA)</Label>
                <Input
                  id="delivery_fee"
                  type="number"
                  value={formData.delivery_fee}
                  onChange={(e) => setFormData({...formData, delivery_fee: parseFloat(e.target.value)})}
                />
              </div>

              <div>
                <Label htmlFor="free_delivery_threshold">Livraison gratuite à partir de (FCFA)</Label>
                <Input
                  id="free_delivery_threshold"
                  type="number"
                  value={formData.free_delivery_threshold}
                  onChange={(e) => setFormData({...formData, free_delivery_threshold: parseFloat(e.target.value)})}
                />
                <p className="text-sm text-gray-500 mt-1">Mettre 0 pour désactiver</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}