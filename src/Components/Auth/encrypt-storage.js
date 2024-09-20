import { EncryptStorage } from "encrypt-storage";

// Create an instance of EncryptStorage
export const encryptStorage = new EncryptStorage("secret-key-value", {
  storageType: "sessionStorage", // or "localStorage"
});
