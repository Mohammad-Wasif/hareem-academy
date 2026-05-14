import bcrypt from "bcrypt";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node hash-password.mjs <password>");
  process.exit(1);
}

const saltRounds = 10;
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("\nYour ADMIN_PASSWORD_HASH is:");
  console.log("============================");
  console.log(hash);
  console.log("============================\n");
  console.log("Add this to your .env file as ADMIN_PASSWORD_HASH and remove the plain ADMIN_PASSWORD.");
});
