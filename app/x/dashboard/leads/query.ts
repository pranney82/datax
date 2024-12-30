interface QueryParams {
  orgID: string;
  startDate: string;
  endDate: string;
  page?: string;
}

export const docsDataQuery = ({ orgID, startDate, endDate, page }: QueryParams) => ({
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

