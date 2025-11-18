{
    "name": "Order",
    "type": "object",
    "properties": {
      "order_number": {
        "type": "string",
        "description": "Num\u00e9ro de commande unique"
      },
      "client_name": {
        "type": "string",
        "description": "Nom du client"
      },
      "client_phone": {
        "type": "string",
        "description": "T\u00e9l\u00e9phone du client"
      },
      "client_email": {
        "type": "string",
        "description": "Email du client (optionnel)"
      },
      "client_address": {
        "type": "string",
        "description": "Adresse de livraison"
      },
      "items": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "product_id": {
              "type": "string"
            },
            "product_name": {
              "type": "string"
            },
            "product_image": {
              "type": "string"
            },
            "quantity": {
              "type": "number"
            },
            "price": {
              "type": "number"
            },
            "total": {
              "type": "number"
            }
          }
        },
        "description": "Produits command\u00e9s"
      },
      "subtotal": {
        "type": "number",
        "description": "Sous-total"
      },
      "delivery_fee": {
        "type": "number",
        "description": "Frais de livraison"
      },
      "total": {
        "type": "number",
        "description": "Total de la commande"
      },
      "status": {
        "type": "string",
        "enum": [
          "pending",
          "confirmed",
          "preparing",
          "shipped",
          "delivered",
          "cancelled"
        ],
        "default": "pending",
        "description": "Statut de la commande"
      },
      "notes": {
        "type": "string",
        "description": "Notes du client"
      },
      "admin_notes": {
        "type": "string",
        "description": "Notes administrateur"
      }
    },
    "required": [
      "order_number",
      "client_name",
      "client_phone",
      "client_address",
      "items",
      "total"
    ]
  }