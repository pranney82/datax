interface QueryParams1 {
    orgID: string;
    startDate?: string;
    endDate?: string;
    page?: string;
    cfName2?: string;
    value?: string;
    url?: string;
  }
  
  export const calQuery1 = ({ orgID, cfName2, startDate, endDate }: QueryParams1) => ({
    "organization": {
      "$": {
        "id": orgID
      },
      "id": {},
      "tasks": {
        "$": {
          "where": {
            "and": [
              [
                [
                  "taskType",
                  "id"
                ],
                cfName2
              ],
              [
                "startDate",
                ">=",
                startDate
              ],
              [
                "startDate",
                "<=",
                endDate
              ]
            ]
          },
          "sortBy": [
            {
              "field": "startDate"
            }
          ],
          "page": "",
          "size": 50
        },
        "nodes": {
          "id": {},
          "name": {},
          "startDate": {},
          "description": {},
          "job": {
            "id": {},
            "name": {}
          }
        },
      "nextPage": {},
      "previousPage": {}
      }
    }
  });