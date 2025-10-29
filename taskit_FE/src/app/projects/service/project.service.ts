import API from "@/lib/interceptor";

//get All Registered users
export const getAllUsers = async () => {
  try {
    const res = await API.get("/users/getAllUsers");
    if (res) {
      return res.data;
    }
  } catch (error) {
    console.error("Failed to get all users", error);
  }
};
