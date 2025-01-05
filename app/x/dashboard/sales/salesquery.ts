interface QueryParams2 {
    orgID: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    cfID?: string;
    cfName3?: string;
  }

export const querySales = ({orgID, cfName3, cfID, startDate, endDate}: QueryParams2) => ({
    "scope": {
    "_type": {},
    "_": "organization",
    "$": {
      "id": orgID
    },
    "id": {},
    "connection": {
      "_type": {},
      "_": "documents",
      "$": {
        "with": {
          "id": {},
          "documentRecipients": {
            "lastViewedAt": {
              "_": "max",
              "$": {
                "field": [
                  "documentLastViewedAt"
                ]
              }
            }
          },
          "job": {
            "location": {
              "account": {
                "cfv2": {
                  "_": "customFieldValues",
                  "$": {
                    "where": [
                      [
                        "customField",
                        "id"
                      ],
                      "=",
                      cfID
                    ],
                    "size": 1
                  },
                  "values": {
                    "$": {
                      "field": "value"
                    }
                  }
                }
              }
            }
          }
        },
        "where": {
          "and": [
            {
              "and": [
                {
                  "=": [
                    {
                      "field": [
                        "type"
                      ]
                    },
                    {
                      "value": "customerInvoice"
                    }
                  ]
                },
                {
                  "=": [
                    {
                      "field": [
                        "status"
                      ]
                    },
                    {
                      "value": "approved"
                    }
                  ]
                },
                {
                  "=": [
                    {
                      "field": [
                        "job",
                        "location",
                        "account",
                        "cfv2",
                        "values"
                      ]
                    },
                    {
                      "value": cfName3
                    }
                  ]
                },
                {
                  "<": [
                    {
                      "field": [
                        "closedAt"
                      ]
                    },
                    {
                      "value": endDate
                    }
                  ]
                },
                {
                  ">": [
                    {
                      "field": [
                        "closedAt"
                      ]
                    },
                    {
                      "value": startDate
                    }
                  ]
                }
              ]
            }
          ]
        },
        "sortBy": [
          {
            "field": [
              "createdAt"
            ],
            "order": "desc"
          }
        ],
        "expressions": {
          "amount": {
            "if": [
              {
                "in": [
                  {
                    "field": "type"
                  },
                  [
                    "customerOrder",
                    "customerInvoice"
                  ]
                ]
              },
              {
                "field": [
                  "priceWithTax"
                ]
              },
              {
                "+": [
                  {
                    "field": [
                      "cost"
                    ]
                  },
                  {
                    "field": [
                      "tax"
                    ]
                  }
                ]
              }
            ]
          }
        }
      },
      "count": {},
      "Amount:sum": {
        "_": "sum",
        "$": {
          "field": [
            "amount"
          ]
        }
      }
    }
    }
  });

  export const queryCustomFieldOptions = ({orgID, cfID}: QueryParams2) => ({
    "organization": {
      "$": {
        "id": orgID
      },
      "id": {},
      "customFields": {
        "$": {
          "where": [
            [
              "id"
            ],
            cfID
          ]
        },
        "nodes": {
          "id": {},
          "name": {},
          "type": {},
          "targetType": {},
          "options": {}
        }
      }
    }
  });