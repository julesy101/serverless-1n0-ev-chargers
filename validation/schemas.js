let defaultSchemas = {
    addChargerModel: {
        "id": "/addChargerModel",
        "type": "object",
        "properties": {
            "name": { "type": "string" },
            "type": { "type": "string" },
            "power": { "type": "number" },
            "lat": { "type": "float" },
            "lng": { "type": "float" }
        },
        "required": ["name", "type", "power", "lat", "lng"]
    }
}
module.exports = defaultSchemas;