{
    "name": "Product",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Nom du produit"
      },
      "description": {
        "type": "string",
        "description": "Description d\u00e9taill\u00e9e"
      },
      "short_description": {
        "type": "string",
        "description": "Description courte"
      },
      "price": {
        "type": "number",
        "description": "Prix en FCFA"
      },
      "original_price": {
        "type": "number",
        "description": "Prix original (si promo)"
      },
      "category_id": {
        "type": "string",
        "description": "ID de la cat\u00e9gorie"
      },
      "images": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "URLs des images"
      },
      "is_new": {
        "type": "boolean",
        "default": false,
        "description": "Nouveau produit"
      },
      "is_promo": {
        "type": "boolean",
        "default": false,
        "description": "En promotion"
      },
      "is_featured": {
        "type": "boolean",
        "default": false,
        "description": "Produit phare"
      },
      "stock": {
        "type": "number",
        "default": 0,
        "description": "Quantit\u00e9 en stock"
      },
      "is_available": {
        "type": "boolean",
        "default": true,
        "description": "Disponible \u00e0 la vente"
      },
      "technical_details": {
        "type": "string",
        "description": "D\u00e9tails techniques"
      },
      "views": {
        "type": "number",
        "default": 0,
        "description": "Nombre de vues"
      }
    },
    "required": [
      "name",
      "price",
      "category_id"
    ]
  }