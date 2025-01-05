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

  export const querySalesData = ({orgID, cfID, cfName3, startDate, endDate}: QueryParams2) => ({
    "scope": {
    "_type": {},
    "_": "organization",
    "$": {
      "id": orgID
    },
    "id": {},
    "connection": {
      "_type": {},
      "$": {
        "with": {
          "id": {},
          "cfv:22NMPgvPNpFk": {
            "_": "customFieldValues",
            "$": {
              "where": [
                [
                  "customField",
                  "id"
                ],
                "=",
                "22NMPgvPNpFk"
              ],
              "size": 1
            },
            "values": {
              "$": {
                "field": "value"
              }
            }
          },
          "pendingCustomerOrders": {
            "_": "documents",
            "$": {
              "where": {
                "and": [
                  [
                    "type",
                    "customerOrder"
                  ],
                  [
                    "status",
                    "pending"
                  ],
                  [
                    "includeInBudget",
                    true
                  ]
                ]
              }
            },
            "sum": {
              "_": "sum",
              "$": "priceWithTax"
            }
          },
          "approvedCustomerOrders": {
            "_": "documents",
            "$": {
              "with": {
                "approvedHourCostItems": {
                  "_": "costItems",
                  "$": {
                    "where": {
                      "and": [
                        [
                          "isSelected"
                        ],
                        [
                          [
                            "unit",
                            "name"
                          ],
                          "in",
                          [
                            "hour",
                            "hours",
                            "hr",
                            "hrs"
                          ]
                        ]
                      ]
                    }
                  },
                  "quantity": {
                    "_": "sum",
                    "$": "quantity"
                  }
                }
              },
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
                    "includeInBudget",
                    true
                  ]
                ]
              }
            },
            "priceWithTaxSum": {
              "_": "sum",
              "$": "priceWithTax"
            }
          },
          "cfv1": {
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
        },
        "where": {
          "and": [
            {
              "and": [
                {
                  "=": [
                    {
                      "field": [
                        "cfv1",
                        "values"
                      ]
                    },
                    {
                      "value": cfName3
                    }
                  ]
                },
                {
                  ">": [
                    {
                      "field": [
                        "createdAt"
                      ]
                    },
                    {
                      "value": startDate
                    }
                  ]
                },
                {
                  "<": [
                    {
                      "field": [
                        "createdAt"
                      ]
                    },
                    {
                      "value": endDate
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
        "expressions": {}
      },
      "nodes": {
        "_type": {},
        "id": {},
        "name": {},
        "location": {
          "_type": {},
          "id": {},
          "account": {
            "_type": {},
            "id": {},
            "name": {}
          },
          "name": {}
        },
        "createdAt": {}
      },
      "_": "jobs",
      "nextPage": {},
      "withValues": {}
    }
  }
});

export const querySalesReps = ({orgID, cfID, cfName3, startDate, endDate}: QueryParams2) => ({
    "scope": {
        "_type": {},
        "_": "organization",
        "$": {
            "id": orgID
        },
        "connection": {
            "_type": {},
            "_": "jobs",
            "$": {
                "with": {
                    "id": {},
                    "approvedCustomerOrders": {
                        "_": "documents",
                        "$": {
                            "where": {
                                "and": [
                                    ["type", "customerOrder"],
                                    ["status", "approved"]
                                ]
                            }
                        },
                        "priceWithTax": {
                            "_": "sum",
                            "$": "priceWithTax"
                        }
                    },
                    "pendingCustomerOrders": {
                        "_": "documents",
                        "$": {
                            "where": {
                                "and": [
                                    ["type", "customerOrder"],
                                    ["status", "pending"]
                                ]
                            }
                        },
                        "priceWithTax": {
                            "_": "sum",
                            "$": "priceWithTax"
                        }
                    },
                    "cfv2": {
                        "_": "customFieldValues",
                        "$": {
                            "where": [
                                ["customField", "id"],
                                "=",
                                cfID
                            ]
                        },
                        "values": {
                            "$": {
                                "field": "value"
                            }
                        }
                    }
                },
                "where": {
                    "and": [
                        {
                            "=": [
                                {"field": ["cfv2", "values"]},
                                {"value": cfName3}
                            ]
                        },
                        {
                            ">=": [
                                {"field": ["createdAt"]},
                                {"value": startDate}
                            ]
                        },
                        {
                            "<=": [
                                {"field": ["createdAt"]},
                                {"value": endDate}
                            ]
                        }
                    ]
                }
            },
            "count": {},
            "withValues": {}
        }
    }
});