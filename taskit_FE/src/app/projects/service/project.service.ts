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

export const createProject = async (project: {
  name: string;
  description: string;
  teamMemberIds: string[];
}) => {
  const response = await API.post("/project/create", project);
  return response.data;
};

export const getProjects = async () => {
  try {
    const res = await API.get("/project/getAllProjects");
    if (res) {
      return res.data;
    }
  } catch (error) {
    console.error("Failed to get projects", error);
  }
};
