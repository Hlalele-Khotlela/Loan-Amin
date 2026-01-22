const bcrypt = require("bcryptjs");

async function run() {
  const hash = await bcrypt.hash("Admin123!", 10);
  console.log("Hashed password:", hash);
}

run();
