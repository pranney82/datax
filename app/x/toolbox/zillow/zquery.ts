interface QueryParams1 {
    orgID?: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    cfName2?: string;
    value?: string;
    url?: string;
    locID?: string;
    zestimate?: string;
    zestimateField?: string;
    cfType?: string;
    zestimateURL?: string;
    zestimateUrlField?: string;
    zillowUrlField?: string;
  }
  
  export const zQuery1 = ({ orgID, value }: QueryParams1) => ({
        "organization": {
          "$": {
            "id": orgID
          },
          "id": {},
          "jobs": {
            "$": {
              "where": {
                "and": [
                  {
                    "and": [
                      {
                        "or": [
                          {
                            "like": [
                              {
                                "field": [
                                  "name"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          },
                          {
                            "like": [
                              {
                                "field": [
                                  "number"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          },
                          {
                            "like": [
                              {
                                "field": [
                                  "description"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          },
                          {
                            "like": [
                              {
                                "field": [
                                  "location",
                                  "name"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          },
                          {
                            "like": [
                              {
                                "field": [
                                  "location",
                                  "address"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          },
                          {
                            "like": [
                              {
                                "field": [
                                  "location",
                                  "account",
                                  "name"
                                ]
                              },
                              {
                                "value": `%${value}%`
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            },
            "nodes": {
              "id": {},
              "name": {},
              "location": {
                "id": {},
                "formattedAddress": {},
                "account": {
                    "name": {},
                    "id": {}
                  }
              }
            }
          }
        }
      });

export const searchWebhooks = ({ orgID }: QueryParams1) => ({
"organization": {
    "$": {
      "id": orgID
    },
    "id": {},
    "webhooks": {
      "nodes": {
        "id": {},
        "url": {}
      }
    }
  }
});

export const createWebhook = ({ orgID, url, zestimateField, zillowUrlField }: QueryParams1) => ({
  "createWebhook": {
    "$": {
      "organizationId": orgID,
      "url": url,
      "metadata": {
        "zestimateField": zestimateField,
        "zillowUrlField": zillowUrlField
      }
    }
  }
});

export const zQuery2 = ({ locID, orgID }: QueryParams1) => ({
  "location": {
    "$": {
      "id": locID,
      "organizationId": orgID
    },
    "id": {},
    "latitude": {},
    "longitude": {},
    "address": {},
    "city": {},
    "state": {},
    "street": {},
    "postalCode": {}
  }
});

export const updateLocJT = ({ locID, zestimateField, zestimate, zestimateUrlField, zestimateURL, orgID }: QueryParams1) => ({
    "updateLocation": {
      "$": {
        "id": locID,
        "organizationId": orgID,
        "customFieldValues": {
          [(zestimateField as string)]: zestimate,
          [(zestimateUrlField as string)]: zestimateURL
        }
      }
    }
  });

    export const searchLocCF = ({ orgID }: QueryParams1) => ({
        "organization": {
          "$": {
            "id": orgID
          },
          "id": {},
          "customFields": {
            "$": {
              "where": [
                [
                  "targetType"
                ],
                "location"
              ],
              "size": 50
            },
            "nodes": {
              "id": {},
              "name": {},
              "type": {},
              "targetType": {}
            }
          }
        }
      }
    );

    export const createCF = ({ orgID, cfName2, cfType }: QueryParams1) => ({
        "createCustomField": {
          "$": {
            "organizationId": orgID,
            "name": cfName2,
            "targetType": "location",
            "type": cfType,
            "minValuesRequired": 0,
            "maxValuesAllowed": 1
          },
          "createdCustomField": {
            "id": {},
            "name": {}
          }
        }
      }
    );