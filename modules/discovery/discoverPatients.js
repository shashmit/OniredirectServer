// import {soundex }from 'soundex-code';

// // Mock database (replace with actual database queries)
// const recordsDb = [
//     { abhaAddress: "user1@abdm", mobile: "1234567890", mrn: "MRN001", gender: "M", age: 30, name: "John Doe" },
//     // Add more mock records as needed
// ];

// function findMatchingRecords(query) {
//     return recordsDb.filter(record => {
//         if (query.abhaAddress && record.abhaAddress === query.abhaAddress) {
//             return true;
//         }
//         if (query.mobile && record.mobile === query.mobile) {
//             return true;
//         }
//         if (query.mrn && record.mrn === query.mrn) {
//             return true;
//         }
//         return false;
//     });
// }

// function isNamePhoneticallySimilar(name1, name2) {
//     return soundex(name1) === soundex(name2);
// }

// export default function discoverPatients(query) {
//     let matchingRecords = findMatchingRecords(query);
    
//     if (matchingRecords.length === 0) {
//         return { status: 404, message: "No matching records found" };
//     }
    
//     const filteredRecords = matchingRecords.filter(record => {
//         if (query.gender && record.gender !== query.gender) {
//             return false;
//         }
        
//         if (query.age && Math.abs(record.age - query.age) > 5) {
//             return false;
//         }
        
//         if (query.name && !isNamePhoneticallySimilar(record.name, query.name)) {
//             return false;
//         }
        
//         return true;
//     });
    
//     if (filteredRecords.length > 0) {
//         return {
//             status: 200,
//             data: filteredRecords.map(record => ({
//                 referenceNumber: record.mrn,
//                 display: record.name,
//                 careContexts: [] // Add care contexts if available
//             }))
//         };
//     } else {
//         return { status: 404, message: "No matching records found after filtering" };
//     }
// }

import { soundex } from 'soundex-code';

const patients = [
  { 
    id: '91335732415401@sbx',
    verifiedIdentifiers: [
      { type: 'MOBILE', value: '8086080981' },
      { type: 'ABHA_NUMBER', value: '91-3357-3241-5401' },
      { type: 'abhaAddress', value: '91335732415401@sbx' }
    ],
    unverifiedIdentifiers: [
      { type: 'MR', value: '8747f415-0aed-4034-b086-8a25c41a9823' }
    ],
    name: 'Nihal Abdul Khader M P',
    gender: 'M',
    yearOfBirth: 2000,
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


export default function discoverPatients(query) {
  const patient = query.patient;
  let matchedBy = [];
  
  // Check ABHA Address
  const abhaAddress = patient.verifiedIdentifiers.find(id => id.type === 'abhaAddress')?.value;
  if (abhaAddress) {
    const abhaMatch = patients.find(p => 
      p.verifiedIdentifiers.find(id => id.type === 'abhaAddress' && id.value === abhaAddress)
    );
    if (abhaMatch) {
      matchedBy.push('ABHA_ADDRESS');
      return formatResponse(abhaMatch, matchedBy);
    }
  }
  
  // Check Mobile Number
  const mobileNumber = patient.verifiedIdentifiers.find(id => id.type === 'MOBILE')?.value;
  if (mobileNumber) {
    const mobileMatches = patients.filter(p => 
      p.verifiedIdentifiers.find(id => id.type === 'MOBILE' && id.value === mobileNumber)
    );
    if (mobileMatches.length > 0) {
      matchedBy.push('MOBILE');
      return checkGender(mobileMatches, patient, matchedBy);
    }
  }
  
  // Check Medical Record Number
  const mrNumber = patient.unverifiedIdentifiers.find(id => id.type === 'MR')?.value;
  if (mrNumber) {
    const mrnMatches = patients.filter(p => 
      p.unverifiedIdentifiers.find(id => id.type === 'MR' && id.value === mrNumber)
    );
    if (mrnMatches.length > 0) {
      matchedBy.push('MR');
      return checkGender(mrnMatches, patient, matchedBy);
    }
  }
  
  return { match: false };
}

function checkGender(matches, patient, matchedBy) {
  const genderMatches = matches.filter(p => p.gender === patient.gender);
  if (genderMatches.length === 0) {
    return { match: false };
  }
  return checkYearOfBirth(genderMatches, patient, matchedBy);
}

function checkYearOfBirth(matches, patient, matchedBy) {
  const yearMatches = matches.filter(p => Math.abs(p.yearOfBirth - patient.yearOfBirth) <= 5);
  if (yearMatches.length === 0) {
    return { match: false };
  }
  return checkName(yearMatches, patient, matchedBy);
}

function checkName(matches, patient, matchedBy) {
  const querySoundex = soundex(patient.name);
  const nameMatch = matches.find(p => soundex(p.name) === querySoundex);
  if (nameMatch) {
    return formatResponse(nameMatch, matchedBy);
  }
  return { match: false };
}
function generatePUID() {
  const randNumber = Math.floor(Math.random() * 10000000);
  return 'PUID-' + randNumber.toString().padStart(7, '0');
}


function formatResponse(matchedPatient, matchedBy) {
  return {
    patient: {
      referenceNumber: generatePUID(), //Generate a unique 7digit PUID for each patient and use it as the reference number
      display: matchedPatient.name,
      careContexts: matchedPatient.careContexts,
      matchedBy: matchedBy
    }
  };
}