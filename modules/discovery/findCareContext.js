import config from '../../config/temp.js';

export default async function findCareContext(data) {
  const matchingPatients = config.OTPDATABASE.filter(c => c.transactionId === data.transactionId);
  
  if (matchingPatients.length === 0 || !matchingPatients[0].patient) {
    throw new Error("No Patient Found");
  }
  const matchingPatient = matchingPatients[0];
  
  const requestedReferenceNumbers = data.patient.careContexts.map(cc => cc.referenceNumber);
  let filteredCareContexts;
  try {
    filteredCareContexts = matchingPatient.patient.careContexts.filter(cc =>
      requestedReferenceNumbers.includes(cc.referenceNumber)
    );
  } catch (e) {
    console.error("Error filtering care contexts:", e);
    throw new Error("Error processing Care Contexts");
  }

  if (!filteredCareContexts || filteredCareContexts.length === 0) {
    throw new Error("No matching Care Contexts Found");
  }
  
  return {
    ...matchingPatient.patient,
    careContexts: filteredCareContexts
  };

}