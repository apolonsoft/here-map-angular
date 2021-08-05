export interface HereMapLocality {
  "title": string;
  "id": string;
  "resultType": string;
  "localityType": string;
  "address": {
    "label": string;
    "countryCode": string;
    "countryName": string;
    "stateCode": string;
    "state": string;
    "postalCode": string
  };
  "highlights": {
    "title": [
      {
        "start": number;
        "end": number
      }
    ];
    "address": {
      "label": [
        {
          "start": number;
          "end": number
        }
      ];
      "postalCode": [
        {
          "start": number;
          "end": number
        }
      ]
    }
  }
}
