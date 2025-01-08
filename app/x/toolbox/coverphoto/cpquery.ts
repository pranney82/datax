interface QueryParams1 {
    orgID: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    cfName2?: string;
    value?: string;
    url?: string;
  }
  
  export const cpQuery1 = ({ orgID, value }: QueryParams1) => ({
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

export const createWebhook = ({ orgID, url }: QueryParams1) => ({
"createWebhook": {
    "$": {
      "eventTypes": [
        "jobCreated"
      ],
      "organizationId": orgID,
      "url": url
    }
  }
});