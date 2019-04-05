class MockOcmResults {
    get standardResponse(){
        return `[
            {
              "ID": 121519,
              "UUID": "229030C0-FC1B-4A0F-8B01-B401B3F0ADD9",
              "DataProviderID": 1,
              "DataProvider": {
                "WebsiteURL": "http://openchargemap.org",
                "DataProviderStatusType": {
                  "IsProviderEnabled": true,
                  "ID": 1,
                  "Title": "Manual Data Entry"
                },
                "IsRestrictedEdit": false,
                "IsOpenDataLicensed": true,
                "IsApprovedImport": true,
                "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
                "ID": 1,
                "Title": "Open Charge Map Contributors"
              },
              "OperatorID": 20,
              "OperatorInfo": {
                "WebsiteURL": "http://www.chargeyourcar.org.uk/",
                "PhonePrimaryContact": "0191 26 50 500",
                "IsPrivateIndividual": false,
                "ContactEmail": "admin@chargeyourcar.org.uk",
                "FaultReportEmail": "admin@chargeyourcar.org.uk",
                "IsRestrictedEdit": false,
                "ID": 20,
                "Title": "Charge Your Car"
              },
              "OperatorsReference": "80917",
              "UsageTypeID": 4,
              "UsageType": {
                "IsPayAtLocation": false,
                "IsMembershipRequired": true,
                "IsAccessKeyRequired": true,
                "ID": 4,
                "Title": "Public - Membership Required"
              },
              "UsageCost": "£1.50+£0.20/kWh",
              "AddressInfo": {
                "ID": 121865,
                "Title": "Hambalt Road, Lambeth",
                "AddressLine1": "Hambalt Road",
                "Town": "Lambeth",
                "StateOrProvince": "Greater London",
                "Postcode": "SW4 8QG",
                "CountryID": 1,
                "Country": {
                  "ISOCode": "GB",
                  "ContinentCode": "EU",
                  "ID": 1,
                  "Title": "United Kingdom"
                },
                "Latitude": 51.45378,
                "Longitude": -0.137,
                "DistanceUnit": 0
              },
              "NumberOfPoints": 2,
              "StatusTypeID": 50,
              "StatusType": {
                "IsOperational": true,
                "IsUserSelectable": true,
                "ID": 50,
                "Title": "Operational"
              },
              "DateLastStatusUpdate": "2019-04-04T05:16:00Z",
              "DataQualityLevel": 1,
              "DateCreated": "2019-04-04T05:16:00Z",
              "SubmissionStatusTypeID": 200,
              "SubmissionStatus": {
                "IsLive": true,
                "ID": 200,
                "Title": "Submission Published"
              },
              "Connections": [
                {
                  "ID": 171227,
                  "ConnectionTypeID": 25,
                  "ConnectionType": {
                    "FormalName": "IEC 62196-2 Type 2",
                    "IsDiscontinued": false,
                    "IsObsolete": false,
                    "ID": 25,
                    "Title": "Mennekes (Type 2)"
                  },
                  "StatusTypeID": 50,
                  "StatusType": {
                    "IsOperational": true,
                    "IsUserSelectable": true,
                    "ID": 50,
                    "Title": "Operational"
                  },
                  "LevelID": 2,
                  "Level": {
                    "Comments": "Over 2 kW, usually non-domestic socket type",
                    "IsFastChargeCapable": false,
                    "ID": 2,
                    "Title": "Level 2 : Medium (Over 2kW)"
                  },
                  "Amps": 32,
                  "Voltage": 230,
                  "PowerKW": 7.0,
                  "CurrentTypeID": 10,
                  "CurrentType": {
                    "Description": "Alternating Current - Single Phase",
                    "ID": 10,
                    "Title": "AC (Single-Phase)"
                  },
                  "Quantity": 2
                }
              ],
              "IsRecentlyVerified": true,
              "DateLastVerified": "2019-04-04T05:16:00Z"
            },
            {
              "ID": 121520,
              "UUID": "564024BB-BAC2-43E1-8188-1BF8DA4C1FB6",
              "DataProviderID": 1,
              "DataProvider": {
                "WebsiteURL": "http://openchargemap.org",
                "DataProviderStatusType": {
                  "IsProviderEnabled": true,
                  "ID": 1,
                  "Title": "Manual Data Entry"
                },
                "IsRestrictedEdit": false,
                "IsOpenDataLicensed": true,
                "IsApprovedImport": true,
                "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
                "ID": 1,
                "Title": "Open Charge Map Contributors"
              },
              "OperatorID": 32,
              "OperatorInfo": {
                "WebsiteURL": "http://www.polarnetwork.com/",
                "Comments": "Owned by Chargemaster in the UK. Monthly post-billed membership fee gets an RFID card and charged per kWh Most points available on pre-pay via app at different per-hour tariffs. Some are also available pay-as-you-go /kWh with contactless bank card payment.",
                "PhonePrimaryContact": "01582 400331",
                "IsPrivateIndividual": false,
                "ContactEmail": "polarenquiries@chargemasterplc.com",
                "FaultReportEmail": "polarenquiries@chargemasterplc.com",
                "IsRestrictedEdit": false,
                "ID": 32,
                "Title": "POLAR (UK)"
              },
              "OperatorsReference": "11781,11782",
              "UsageTypeID": 4,
              "UsageType": {
                "IsPayAtLocation": false,
                "IsMembershipRequired": true,
                "IsAccessKeyRequired": true,
                "ID": 4,
                "Title": "Public - Membership Required"
              },
              "UsageCost": "Inclusive; for Polar Plus subscription members only",
              "AddressInfo": {
                "ID": 121866,
                "Title": "Palé Hall Hotel",
                "AddressLine1": "Palé Hall Hotel",
                "Postcode": "LL23 7PS",
                "CountryID": 1,
                "Country": {
                  "ISOCode": "GB",
                  "ContinentCode": "EU",
                  "ID": 1,
                  "Title": "United Kingdom"
                },
                "Latitude": 52.912594,
                "Longitude": -3.513098,
                "DistanceUnit": 0
              },
              "NumberOfPoints": 2,
              "GeneralComments": "The unit is located in the main car park.",
              "StatusTypeID": 50,
              "StatusType": {
                "IsOperational": true,
                "IsUserSelectable": true,
                "ID": 50,
                "Title": "Operational"
              },
              "DateLastStatusUpdate": "2019-04-04T05:16:00Z",
              "DataQualityLevel": 1,
              "DateCreated": "2019-04-04T05:16:00Z",
              "SubmissionStatusTypeID": 200,
              "SubmissionStatus": {
                "IsLive": true,
                "ID": 200,
                "Title": "Submission Published"
              },
              "Connections": [
                {
                  "ID": 171228,
                  "ConnectionTypeID": 25,
                  "ConnectionType": {
                    "FormalName": "IEC 62196-2 Type 2",
                    "IsDiscontinued": false,
                    "IsObsolete": false,
                    "ID": 25,
                    "Title": "Mennekes (Type 2)"
                  },
                  "StatusTypeID": 50,
                  "StatusType": {
                    "IsOperational": true,
                    "IsUserSelectable": true,
                    "ID": 50,
                    "Title": "Operational"
                  },
                  "LevelID": 2,
                  "Level": {
                    "Comments": "Over 2 kW, usually non-domestic socket type",
                    "IsFastChargeCapable": false,
                    "ID": 2,
                    "Title": "Level 2 : Medium (Over 2kW)"
                  },
                  "Amps": 32,
                  "Voltage": 230,
                  "PowerKW": 7.0,
                  "CurrentTypeID": 10,
                  "CurrentType": {
                    "Description": "Alternating Current - Single Phase",
                    "ID": 10,
                    "Title": "AC (Single-Phase)"
                  },
                  "Quantity": 2
                }
              ],
              "IsRecentlyVerified": true,
              "DateLastVerified": "2019-04-04T05:16:00Z"
            },
            {
              "ID": 121518,
              "UUID": "113FA856-5056-4C8C-B074-32705458B828",
              "DataProviderID": 1,
              "DataProvider": {
                "WebsiteURL": "http://openchargemap.org",
                "DataProviderStatusType": {
                  "IsProviderEnabled": true,
                  "ID": 1,
                  "Title": "Manual Data Entry"
                },
                "IsRestrictedEdit": false,
                "IsOpenDataLicensed": true,
                "IsApprovedImport": true,
                "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
                "ID": 1,
                "Title": "Open Charge Map Contributors"
              },
              "OperatorID": 20,
              "OperatorInfo": {
                "WebsiteURL": "http://www.chargeyourcar.org.uk/",
                "PhonePrimaryContact": "0191 26 50 500",
                "IsPrivateIndividual": false,
                "ContactEmail": "admin@chargeyourcar.org.uk",
                "FaultReportEmail": "admin@chargeyourcar.org.uk",
                "IsRestrictedEdit": false,
                "ID": 20,
                "Title": "Charge Your Car"
              },
              "OperatorsReference": "CM11527,CM11528,CM11529,CM11530",
              "UsageTypeID": 4,
              "UsageType": {
                "IsPayAtLocation": false,
                "IsMembershipRequired": true,
                "IsAccessKeyRequired": true,
                "ID": 4,
                "Title": "Public - Membership Required"
              },
              "UsageCost": "£0.20/kWh;min £1.00",
              "AddressInfo": {
                "ID": 121864,
                "Title": "12 Victoria Street Car-Park, Nottingham",
                "AddressLine1": "12 Victoria Street Car",
                "Postcode": "NG16 3AW",
                "CountryID": 1,
                "Country": {
                  "ISOCode": "GB",
                  "ContinentCode": "EU",
                  "ID": 1,
                  "Title": "United Kingdom"
                },
                "Latitude": 53.0185,
                "Longitude": -1.3058,
                "DistanceUnit": 0
              },
              "NumberOfPoints": 2,
              "StatusTypeID": 50,
              "StatusType": {
                "IsOperational": true,
                "IsUserSelectable": true,
                "ID": 50,
                "Title": "Operational"
              },
              "DateLastStatusUpdate": "2019-04-04T05:15:00Z",
              "DataQualityLevel": 1,
              "DateCreated": "2019-04-04T05:15:00Z",
              "SubmissionStatusTypeID": 200,
              "SubmissionStatus": {
                "IsLive": true,
                "ID": 200,
                "Title": "Submission Published"
              },
              "Connections": [
                {
                  "ID": 171226,
                  "ConnectionTypeID": 25,
                  "ConnectionType": {
                    "FormalName": "IEC 62196-2 Type 2",
                    "IsDiscontinued": false,
                    "IsObsolete": false,
                    "ID": 25,
                    "Title": "Mennekes (Type 2)"
                  },
                  "StatusTypeID": 50,
                  "StatusType": {
                    "IsOperational": true,
                    "IsUserSelectable": true,
                    "ID": 50,
                    "Title": "Operational"
                  },
                  "LevelID": 2,
                  "Level": {
                    "Comments": "Over 2 kW, usually non-domestic socket type",
                    "IsFastChargeCapable": false,
                    "ID": 2,
                    "Title": "Level 2 : Medium (Over 2kW)"
                  },
                  "Amps": 32,
                  "Voltage": 230,
                  "PowerKW": 7.0,
                  "CurrentTypeID": 10,
                  "CurrentType": {
                    "Description": "Alternating Current - Single Phase",
                    "ID": 10,
                    "Title": "AC (Single-Phase)"
                  },
                  "Quantity": 2
                }
              ],
              "IsRecentlyVerified": true,
              "DateLastVerified": "2019-04-04T05:15:00Z"
            }
          ]`;
    }

    get malformedConnectionChargerResponse(){
      return `[            {
        "ID": 121518,
        "UUID": "113FA856-5056-4C8C-B074-32705458B828",
        "DataProviderID": 1,
        "DataProvider": {
          "WebsiteURL": "http://openchargemap.org",
          "DataProviderStatusType": {
            "IsProviderEnabled": true,
            "ID": 1,
            "Title": "Manual Data Entry"
          },
          "IsRestrictedEdit": false,
          "IsOpenDataLicensed": true,
          "IsApprovedImport": true,
          "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
          "ID": 1,
          "Title": "Open Charge Map Contributors"
        },
        "OperatorID": 20,
        "OperatorInfo": {
          "WebsiteURL": "http://www.chargeyourcar.org.uk/",
          "PhonePrimaryContact": "0191 26 50 500",
          "IsPrivateIndividual": false,
          "ContactEmail": "admin@chargeyourcar.org.uk",
          "FaultReportEmail": "admin@chargeyourcar.org.uk",
          "IsRestrictedEdit": false,
          "ID": 20,
          "Title": "Charge Your Car"
        },
        "OperatorsReference": "CM11527,CM11528,CM11529,CM11530",
        "UsageTypeID": 4,
        "UsageType": {
          "IsPayAtLocation": false,
          "IsMembershipRequired": true,
          "IsAccessKeyRequired": true,
          "ID": 4,
          "Title": "Public - Membership Required"
        },
        "UsageCost": "£0.20/kWh;min £1.00",
        "AddressInfo": {
          "ID": 121864,
          "Title": "12 Victoria Street Car-Park, Nottingham",
          "AddressLine1": "12 Victoria Street Car",
          "Postcode": "NG16 3AW",
          "CountryID": 1,
          "Country": {
            "ISOCode": "GB",
            "ContinentCode": "EU",
            "ID": 1,
            "Title": "United Kingdom"
          },
          "Latitude": 53.0185,
          "Longitude": -1.3058,
          "DistanceUnit": 0
        },
        "NumberOfPoints": 2,
        "StatusTypeID": 50,
        "StatusType": {
          "IsOperational": true,
          "IsUserSelectable": true,
          "ID": 50,
          "Title": "Operational"
        },
        "DateLastStatusUpdate": "2019-04-04T05:15:00Z",
        "DataQualityLevel": 1,
        "DateCreated": "2019-04-04T05:15:00Z",
        "SubmissionStatusTypeID": 200,
        "SubmissionStatus": {
          "IsLive": true,
          "ID": 200,
          "Title": "Submission Published"
        },
        "Connections": [
          {
            "ID": 171226,
            "ConnectionTypeID": 25,
            "ConnectionType": {
              "FormalName": "IEC 62196-2 Type 2",
              "IsDiscontinued": false,
              "IsObsolete": false,
              "ID": 25,
              "Title": "Mennekes (Type 2)"
            },
            "StatusTypeID": 50,
            "StatusType": {
              "IsOperational": true,
              "IsUserSelectable": true,
              "ID": 50,
              "Title": "Operational"
            },
            "LevelID": 2,
            "Level": {
              "Comments": "Over 2 kW, usually non-domestic socket type",
              "IsFastChargeCapable": false,
              "ID": 2,
              "Title": "Level 2 : Medium (Over 2kW)"
            },
            "Amps": 32,
            "Voltage": 230,
            "PowerKW": 7.0,
            "CurrentTypeID": 10,
            "CurrentType": {
              "Description": "Alternating Current - Single Phase",
              "ID": 10,
              "Title": "AC (Single-Phase)"
            },
            "Quantity": 2
          },
          {
            "ID": 171226,
            "ConnectionTypeID": 25,
            "ConnectionType": {

            },
            "StatusTypeID": 50,
            "StatusType": {
              "IsOperational": true,
              "IsUserSelectable": true,
              "ID": 50,
              "Title": "Operational"
            },
            "LevelID": 2,
            "Level": {
              "Comments": "Over 2 kW, usually non-domestic socket type",
              "IsFastChargeCapable": false,
              "ID": 2,
              "Title": "Level 2 : Medium (Over 2kW)"
            },
            "Amps": 32,
            "Voltage": 230,
            "PowerKW": 7.0,
            "CurrentTypeID": 10,
            "CurrentType": {
              "Description": "Alternating Current - Single Phase",
              "ID": 10
            },
            "Quantity": 2
          }
        ],
        "IsRecentlyVerified": true,
        "DateLastVerified": "2019-04-04T05:15:00Z"
      }]`;
    }

    get noConnectionChargerResponse(){
      return `[{
        "ID": 121520,
        "UUID": "564024BB-BAC2-43E1-8188-1BF8DA4C1FB6",
        "DataProviderID": 1,
        "DataProvider": {
          "WebsiteURL": "http://openchargemap.org",
          "DataProviderStatusType": {
            "IsProviderEnabled": true,
            "ID": 1,
            "Title": "Manual Data Entry"
          },
          "IsRestrictedEdit": false,
          "IsOpenDataLicensed": true,
          "IsApprovedImport": true,
          "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
          "ID": 1,
          "Title": "Open Charge Map Contributors"
        },
        "OperatorID": 32,
        "OperatorInfo": {
          "WebsiteURL": "http://www.polarnetwork.com/",
          "Comments": "Owned by Chargemaster in the UK. Monthly post-billed membership fee gets an RFID card and charged per kWh Most points available on pre-pay via app at different per-hour tariffs. Some are also available pay-as-you-go /kWh with contactless bank card payment.",
          "PhonePrimaryContact": "01582 400331",
          "IsPrivateIndividual": false,
          "ContactEmail": "polarenquiries@chargemasterplc.com",
          "FaultReportEmail": "polarenquiries@chargemasterplc.com",
          "IsRestrictedEdit": false,
          "ID": 32,
          "Title": "POLAR (UK)"
        },
        "OperatorsReference": "11781,11782",
        "UsageTypeID": 4,
        "UsageType": {
          "IsPayAtLocation": false,
          "IsMembershipRequired": true,
          "IsAccessKeyRequired": true,
          "ID": 4,
          "Title": "Public - Membership Required"
        },
        "UsageCost": "Inclusive; for Polar Plus subscription members only",
        "AddressInfo": {
          "ID": 121866,
          "Title": "Palé Hall Hotel",
          "AddressLine1": "Palé Hall Hotel",
          "Postcode": "LL23 7PS",
          "CountryID": 1,
          "Country": {
            "ISOCode": "GB",
            "ContinentCode": "EU",
            "ID": 1,
            "Title": "United Kingdom"
          },
          "Latitude": 52.912594,
          "Longitude": -3.513098,
          "DistanceUnit": 0
        },
        "GeneralComments": "The unit is located in the main car park.",
        "StatusTypeID": 50,
        "StatusType": {
          "IsOperational": true,
          "IsUserSelectable": true,
          "ID": 50,
          "Title": "Operational"
        },
        "DateLastStatusUpdate": "2019-04-04T05:16:00Z",
        "DataQualityLevel": 1,
        "DateCreated": "2019-04-04T05:16:00Z",
        "SubmissionStatusTypeID": 200,
        "SubmissionStatus": {
          "IsLive": true,
          "ID": 200,
          "Title": "Submission Published"
        },
        "IsRecentlyVerified": true,
        "DateLastVerified": "2019-04-04T05:16:00Z"
      }]`;
  }
  
  get noOperatorResponse(){
    return `[{
      "ID": 121520,
      "UUID": "564024BB-BAC2-43E1-8188-1BF8DA4C1FB6",
      "DataProviderID": 1,
      "DataProvider": {
        "WebsiteURL": "http://openchargemap.org",
        "DataProviderStatusType": {
          "IsProviderEnabled": true,
          "ID": 1,
          "Title": "Manual Data Entry"
        },
        "IsRestrictedEdit": false,
        "IsOpenDataLicensed": true,
        "IsApprovedImport": true,
        "License": "Licensed under Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)",
        "ID": 1,
        "Title": "Open Charge Map Contributors"
      },
      "Connections": [
        {
          "ID": 171226,
          "ConnectionTypeID": 25,
          "ConnectionType": {
            "FormalName": "IEC 62196-2 Type 2",
            "IsDiscontinued": false,
            "IsObsolete": false,
            "ID": 25,
            "Title": "Mennekes (Type 2)"
          },
          "StatusTypeID": 50,
          "StatusType": {
            "IsOperational": true,
            "IsUserSelectable": true,
            "ID": 50,
            "Title": "Operational"
          },
          "LevelID": 2,
          "Level": {
            "Comments": "Over 2 kW, usually non-domestic socket type",
            "IsFastChargeCapable": false,
            "ID": 2,
            "Title": "Level 2 : Medium (Over 2kW)"
          },
          "Amps": 32,
          "Voltage": 230,
          "PowerKW": 7.0,
          "CurrentTypeID": 10,
          "CurrentType": {
            "Description": "Alternating Current - Single Phase",
            "ID": 10,
            "Title": "AC (Single-Phase)"
          },
          "Quantity": 2
        }
      ],
      "OperatorsReference": "11781,11782",
      "UsageTypeID": 4,
      "UsageType": {
        "IsPayAtLocation": false,
        "IsMembershipRequired": true,
        "IsAccessKeyRequired": true,
        "ID": 4,
        "Title": "Public - Membership Required"
      },
      "UsageCost": "Inclusive; for Polar Plus subscription members only",
      "AddressInfo": {
        "ID": 121866,
        "Title": "Palé Hall Hotel",
        "AddressLine1": "Palé Hall Hotel",
        "Postcode": "LL23 7PS",
        "CountryID": 1,
        "Country": {
          "ISOCode": "GB",
          "ContinentCode": "EU",
          "ID": 1,
          "Title": "United Kingdom"
        },
        "Latitude": 52.912594,
        "Longitude": -3.513098,
        "DistanceUnit": 0
      },
      "NumberOfPoints": 2,
      "GeneralComments": "The unit is located in the main car park.",
      "StatusTypeID": 50,
      "StatusType": {
        "IsOperational": true,
        "IsUserSelectable": true,
        "ID": 50,
        "Title": "Operational"
      },
      "DateLastStatusUpdate": "2019-04-04T05:16:00Z",
      "DataQualityLevel": 1,
      "DateCreated": "2019-04-04T05:16:00Z",
      "SubmissionStatusTypeID": 200,
      "SubmissionStatus": {
        "IsLive": true,
        "ID": 200,
        "Title": "Submission Published"
      },
      "IsRecentlyVerified": true,
      "DateLastVerified": "2019-04-04T05:16:00Z"
    }]`;
}
}

module.exports = new MockOcmResults();