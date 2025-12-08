

function generateCode() {
   const year = new Date().getFullYear();     // e.g. 2025
  const threeDigits = Math.floor(100 + Math.random() * 900); // 100–999
  return `${year}${threeDigits}`;            // → "2025147"
}
export { generateCode };