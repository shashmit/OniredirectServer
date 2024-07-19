export default function generateOTP() {
  const randNumber = Math.floor(Math.random() * 1000000);
  return randNumber.toString().padStart(6, '0');
}