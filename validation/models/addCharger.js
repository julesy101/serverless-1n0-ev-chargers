module.exports = {
    "id": "/addChargerModel",
    "type": "object",
    "properties": {
        "connections": { 
            "type": "array",
            "items": {
                "$ref": "#/definitions/connections"
            }
        },
        "network": { "$ref": "#/definitions/network"},
        "address": { "$ref": "#/definitions/address"},
        "ocm": { "$ref": "#/definitions/ocm"},
        "ocmId": { "type": "number" }, 
    },
    "required": ["connections", "network", "address", "ocm", "ocmId"],
    "definitions": {
        "connections": {
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "kw": { "type": "float" },
                "currentType": { "type": "string" }
            },
            "required": ["type", "kw", "currentType"]
        },
        "network": {
            "type": "object",
            "properties": {
                "websiteURL": { "type": "string" },
                "isPrivateIndividual": { "type": "bool" },
                "contactEmail": { "type": "string" },
                "title": { "type": "string" }
            },
            "required": ["title", "contactEmail", "isPrivateIndividual"]
        },
        "address":{
            "type": "object",
            "properties": {
                "title": { "type": "string" },
                "addressLine1": { "type": "string" },
                "addressLine2": { "type": "string" },
                "town": { "type": "string" },
                "stateOrProvince": { "type": "string" },
                "postcode": { "type": "string" },
                "country": { "type": "string" },
                "latitude": { "type": "float" },
                "longitude": { "type": "float" }
            },
            "required": ["addressLine1", "town", "postcode", "country", "latitude", "longitude"]
        },
        "ocm": {
            "type": "object",
            "properties": {
                "id": { "type": "number" },                
                "uuid": { "type": "string" },
                "dateCreated": { "type": "string" },
                "dateLastStatusUpdate": { "type": "string" }
            },
            "required": ["id", "uuid", "dateCreated"]
        }
    }
}