let accessToken = null;
let gwApiConfig = null;
let transactionId = null;
const tempDatabase = {};


const patients = [
  { 
    id: '91126110345082@sbx',
    verifiedIdentifiers: [
      { type: 'MOBILE', value: '9255037647' },
      { type: 'ABHA_NUMBER', value: '91-1261-1034-5082' },
      { type: 'abhaAddress', value: '91126110345082@sbx' }
    ],
    unverifiedIdentifiers: [
      { type: 'MR', value: '8747f415-0aed-4034-b086-8a25c41a9823' }
    ],
    name: 'Raj Kumar',
    gender: 'M',
    yearOfBirth: 1973,
    careContexts: [
      {
        referenceNumber: "visit-12345678-1234-1234-1234-123456789012",
        display: "Consultation on 14th July"
      },
      {
        referenceNumber: "visit-87654321-4321-4321-4321-210987654321",
        display: "Follow-up on 28th July"
      }
    ]
  },
  { 
    id: '91343432822736@sbx',
    verifiedIdentifiers: [
      { type: 'MOBILE', value: '9142748962' },
      { type: 'ABHA_NUMBER', value: '91-3434-3282-2736' },
      { type: 'abhaAddress', value: '91343432822736@sbx' }
    ],
    unverifiedIdentifiers:[
      {type:"MR", value:"6b6ad980-d957-46b1-b024-fb232bd62149"}
    ],
    name: 'Shashmit Kumar',
    gender: 'M',
    yearOfBirth: 2003,
    careContexts: [
      {
        referenceNumber: "visit-12345678-1234-1234-1234-123456789012",
        display: "Consultation on 14th July"
      },
      {
        referenceNumber: "visit-87654321-4321-4321-4321-210987654321",
        display: "Follow-up on 28th July"
      }
    ]
  },
];

const OTPDATABASE =[];

const TEMP_PATIENTS_SEARCH_RESULT = []

export default {
  OTPDATABASE,
  patients,
  accessToken,
  gwApiConfig,
  transactionId,
  tempDatabase,
  TEMP_PATIENTS_SEARCH_RESULT
};