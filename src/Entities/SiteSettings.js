{
    "name": "SiteSettings",
        "type": "object",
            "properties": {
        "site_name": {
            "type": "string",
                "description": "Nom du site"
        },
        "logo_url": {
            "type": "string",
                "description": "URL du logo"
        },
        "banner_image": {
            "type": "string",
                "description": "Image banni\u00e8re accueil"
        },
        "banner_title": {
            "type": "string",
                "description": "Titre banni\u00e8re"
        },
        "banner_subtitle": {
            "type": "string",
                "description": "Sous-titre banni\u00e8re"
        },
        "contact_phone": {
            "type": "string",
                "description": "T\u00e9l\u00e9phone de contact"
        },
        "contact_whatsapp": {
            "type": "string",
                "description": "WhatsApp"
        },
        "contact_email": {
            "type": "string",
                "description": "Email de contact"
        },
        "contact_address": {
            "type": "string",
                "description": "Adresse physique"
        },
        "facebook_url": {
            "type": "string",
                "description": "Lien Facebook"
        },
        "instagram_url": {
            "type": "string",
                "description": "Lien Instagram"
        },
        "delivery_fee": {
            "type": "number",
                "default": 0,
                    "description": "Frais de livraison"
        },
        "free_delivery_threshold": {
            "type": "number",
                "default": 0,
                    "description": "Seuil de livraison gratuite"
        },
        "about_text": {
            "type": "string",
                "description": "Texte \u00c0 propos"
        },
        "cgv_text": {
            "type": "string",
                "description": "Conditions g\u00e9n\u00e9rales de vente"
        },
        "shipping_policy": {
            "type": "string",
                "description": "Politique de livraison"
        },
        "return_policy": {
            "type": "string",
                "description": "Politique de retour"
        },
        "primary_color": {
            "type": "string",
                "default": "#E8B4B8",
                    "description": "Couleur principale (ros\u00e9)"
        },
        "secondary_color": {
            "type": "string",
                "default": "#D4AF37",
                    "description": "Couleur secondaire (dor\u00e9)"
        }
    },
    "required": []
}