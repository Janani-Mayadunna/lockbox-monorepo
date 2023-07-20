import { SHA256 } from "crypto-js";

export function hashPassword(password: string) {
  // (`${email}:${password}`)
  return SHA256(password).toString();
}

//to generate the vault key original passowrd, email and the salt stored on server is needed
// to get the salt original password and email is needed
