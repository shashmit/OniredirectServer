import config from '../../config/temp.js';


export default async function findCareContext(data) {
  const matchingPatients = config.OTPDATABASE.find(c => c.transactionId === data.transactionId);
  console.log("findCareContext",JSON.stringify(matchingPatients));
  if(!careContext){
    throw new Error("No Care Context Found");
  }
  if(careContext){
    const requestedReferenceNumbers = data.patient[0].careContexts.map(cc => cc.referenceNumber);
    
    const filteredCareContexts = matchingPatient.careContexts.filter(cc => 
      requestedReferenceNumbers.includes(cc.referenceNumber)
    );
    if(filteredCareContexts.length === 0){
      throw new Error("No Care Context Found");
    }
    return {
      ...matchingPatients,
      careContexts: filteredCareContexts
    }
  }
}