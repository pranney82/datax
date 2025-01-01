interface QueryParams1 {
  orgID: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  cfName2?: string;
}

export const docsDataQuery = ({ orgID, startDate, endDate, page }: QueryParams1) => ({
        "organization": {
          "$": {
            "id": orgID
          },
          "id": {},
          "documents": {
            "$": {
              "page": page || "",
              "where": {
                "and": [
                  [
                    "type",
                    "customerOrder"
                  ],
                  [
                    "status",
                    "approved"
                  ],
                  [
                    "price",
                    ">",
                    0
                  ],
                  [
                    "createdAt",
                    ">=",
                    startDate
                  ],
                  [
                    "createdAt",
                    "<=",
                    endDate
                  ]
                ]
              },
              "sortBy": [
                {
                  "field": "price",
                  "order": "desc"
                }
              ],
              "size": 25
            },
            "nodes": {
              "id": {},
              "createdAt": {},
              "closedAt": {}
            },
            "nextPage": {},
            "previousPage": {}
          }
        }
      }); 

export const queryDocsStatus = ({ orgID, startDate, endDate }: QueryParams1) => ({
    "organization": {
      "$": {
        "id": orgID
      },
      "id": {},
      "documents": {
        "$": {
          "where": {
            "and": [
              [
                "type",
                "=",
                "customerOrder"
              ],
              [
                "createdAt",
                ">=",
                startDate
              ],
              [
                "createdAt",
                "<=",
                endDate
              ]
            ]
          },
          "group": {
            "by": [
              "status"
            ],
            "aggs": {
              "count": {
                "count": []
              }
            }
          }
        },
        "withValues": {}
      }
    }
  });

// Now update fetchQueryGraphTwo to use cfName2
export const queryCFLeads = ({orgID, startDate, endDate, cfName2, page}: QueryParams1) => ({
  "organization": {
    "$": {
      "id": orgID
    },
    "id": {},
    "customFields": {
      "$": {
        "where": [
          "id",
          "=",
          cfName2
        ]
      },
      "nodes": {
        "id": {},
        "name": {},
        "targetType": {},
        "customFieldValues": {
          "nodes": {
            "id": {},
            "value": {},
            "createdAt": {}
          },
          "$": {
            "where": {
              "and": [
                [
                  "createdAt",
                  ">=",
                  startDate
                ],
                [
                  "createdAt",
                  "<=",
                  endDate
                ]
              ]
            },
            "page": page || "",
            "size": 25
          },
          "nextPage": {},
          "previousPage": {}
        }
      }
    }
  }
});


export const queryCFFields = ({orgID, page}: QueryParams1) => ({
  "organization": {
    "$": {
      "id": orgID
    },
    "id": {},
    "customFields": {
      "$": {
        "where": {
          "or": [
            [
              [
                "targetType"
              ],
              "customer"
            ],
            [
              [
                "targetType"
              ],
              "job"
            ]
          ]
        },
        "page": page || "",
        "size": 25
      },
      "nodes": {
        "id": {},
        "name": {},
        "type": {},
        "targetType": {}
      },
      "nextPage": {},
      "previousPage": {}
    }
  }
});