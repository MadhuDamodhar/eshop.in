import { encryptStorage } from "./encrypt-storage"; // Ensure correct import path

// Login function
export const login = (response, next) => {
  try {
    const data = response.data;
    console.log("Storing data:", data); // Debugging line
    encryptStorage.setItem("data", JSON.stringify(data)); // Store token securely
    next();
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

// Logout function (clear token explicitly)
export const logout = (next) => {
  try {
    encryptStorage.removeItem("data"); // Clear token and user data on logout
    next(); 
    
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Clear token function (use this only when you need to manually clear the token)
export const clearToken = () => {
  try {
    encryptStorage.removeItem("data");
    console.log("Token cleared.");
  } catch (error) {
    console.error("Error clearing token:", error);
  }
};

// Check login function
export const checkLogin = async () => {
  try {
    const data = encryptStorage.getItem("data");
    console.log("Data retrieved in checkLogin:", data);

    // Check if data is a string and parse it if needed
    let parsedData;
    if (typeof data === "string") {
      parsedData = JSON.parse(data);
    } else {
      parsedData = data;
    }

    // Ensure both token and user exist in the stored data
    if (parsedData && parsedData.token && parsedData.user) {
      return true;
    }
  } catch (error) {
    console.error("Error checking login:", error);
  }
  return false;
};

// Get token function
export const getToken = () => {
  try {
    if (checkLogin()) {
      const data = encryptStorage.getItem("data");
      const token = data
        ? typeof data === "string"
          ? JSON.parse(data).token
          : data.token
        : null;
      return token;
    }
  } catch (error) {
    console.error("Error getting token:", error);
  }
  return null;
};

// Get current user function
export const getCurrentUser = () => {
  try {
    if (checkLogin()) {
      const data = encryptStorage.getItem("data");
      const user = data
        ? typeof data === "string"
          ? JSON.parse(data).user
          : data.user
        : null;
      console.log("Current user retrieved:", user); // Debugging line
      return user;
    }
  } catch (error) {
    console.error("Error getting current user:", error);
  }
  return null;
};

// Admin login function
export const adminLogin = () => {
  let user = getCurrentUser();
  let flag = user && user.roles.find((r) => r.id === 5245);
  return flag ? true : false;
};
