import config from '../../config/temp.js';

export default async function findCareContext(data) {
  const matchingPatient = config.OTPDATABASE.find(c => c.transactionId === data.transactionId);
  if (!matchingPatient) {
    throw new Error("No Care Context Found");
  }
  
  const requestedReferenceNumbers = data.patient[0].careContexts.map(cc => cc.referenceNumber);
  let filteredCareContexts;
  console.log("findCare",requestedReferenceNumbers);
  
  try{
    filteredCareContexts = matchingPatient.patient.careContexts;
    console.log("findCareContex",JSON.stringify(filteredCareContexts));
  } catch (e) {
    throw new Error(e);
  }

  if (filteredCareContexts.length === 0) {
    throw new Error("No Care Context Found");
  }
  
  return {
    ...matchingPatient,
    careContexts: filteredCareContexts
  };
}