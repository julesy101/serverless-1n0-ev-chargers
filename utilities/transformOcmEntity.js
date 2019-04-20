module.exports = ocmCharger => {
    const connections = [];
    if (!ocmCharger.ID || !ocmCharger.Connections) return null;
    ocmCharger.Connections.forEach(conn => {
        if (!conn.CurrentType || !conn.ConnectionType) return;

        if (conn.CurrentType.Title && conn.ConnectionType.Title) {
            connections.push({
                type: conn.ConnectionType.Title,
                kw: conn.PowerKW,
                currentType: conn.CurrentType.Title
            });
        }
    });

    let network = null;
    if (ocmCharger.OperatorInfo) {
        network = {
            websiteURL: ocmCharger.OperatorInfo.WebsiteURL,
            isPrivateIndividual: ocmCharger.OperatorInfo.IsPrivateIndividual,
            contactEmail: ocmCharger.OperatorInfo.ContactEmail,
            title: ocmCharger.OperatorInfo.Title
        };
    } else {
        return null;
    }

    return {
        ocmId: ocmCharger.ID,
        connections,
        network,
        address: {
            title: ocmCharger.AddressInfo.Title,
            addressLine1: ocmCharger.AddressInfo.AddressLine1,
            addressLine2: ocmCharger.AddressInfo.AddressLine2,
            town: ocmCharger.AddressInfo.Town,
            stateOrProvince: ocmCharger.AddressInfo.StateOrProvince,
            postcode: ocmCharger.AddressInfo.Postcode,
            country: ocmCharger.AddressInfo.Country.ISOCode,
            latitude: ocmCharger.AddressInfo.Latitude,
            longitude: ocmCharger.AddressInfo.Longitude
        },
        ocm: {
            id: ocmCharger.ID,
            uuid: ocmCharger.UUID,
            dateCreated: ocmCharger.DateCreated,
            dateLastStatusUpdate: ocmCharger.DateLastStatusUpdate
        }
    };
};
