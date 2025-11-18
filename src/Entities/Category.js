{
    "name": "Category",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Nom de la cat\u00e9gorie"
      },
      "description": {
        "type": "string",
        "description": "Description de la cat\u00e9gorie"
      },
      "image_url": {
        "type": "string",
        "description": "Image de la cat\u00e9gorie"
      },
      "order": {
        "type": "number",
        "description": "Ordre d'affichage",
        "default": 0
      }
    },
    "required": [
      "name"
    ]
  }