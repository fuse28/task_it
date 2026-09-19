import API from "@/lib/interceptor";

//get All Registered users
export const getAllUsers = async () => {
  const res = await API.get("/users/getAllUsers");
  return res.data;
};

export const createProject = async (project: {
  name: string;
  description: string;
  teamMemberIds: string[];
}) => {
  const response = await API.post("/projects/create", project);
  return response.data;
};

export const getProjects = async () => {
  const res = await API.get("/projects");
  return res.data;
};

export const deleteProject = async (projectId: number) => {
  const response = await API.delete(`/projects/${projectId}`);
  return response.data;
};
