interface QueryParams1 {
    orgID: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    cfName2?: string;
    value?: string;
    url?: string;
  }
  
  export const aiaQuery1 = ({ orgID, value }: QueryParams1) => ({
        "organization": {
          "$": {
            "id": orgID
          },
          "id": {},
          "jobs": {
            "$": {
              "first": 10,
              "where": {
                "and": [
                  {
                    "or": [
                      {
                        "like": [
                          {
                            "field": ["name"]
                          },
                          {
                            "value": `%${value}%`
                          }
                        ]
                      },
                      {
                        "like": [
                          {
                            "field": ["number"]
                          },
                          {
                            "value": `%${value}%`
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "in": [
                      {
                        "field": ["status"]
                      },
                      {
                        "value": ["active", "pending"]
                      }
                    ]
                  }
                ]
              }
            },
            "nodes": {
              "id": {},
              "name": {},
              "number": {},
              "total": {},
              "location": {
                "formattedAddress": {},
                "account": {
                  "name": {},
                  "id": {}
                }
              },
              "customer": {
                "name": {},
                "id": {}
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