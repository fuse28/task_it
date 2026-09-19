import API from "@/lib/interceptor";

export async function getSections(projectId: number) {
  const res = await API.get(`/sections/project/${projectId}`);
  return res.data;
}

export async function createSection(projectId: number, title: string) {
  const res = await API.post(`/sections/project/${projectId}`, { title });
  return res.data;
}

export async function createStage(sectionId: number, title: string) {
  const res = await API.post(`/stages/section/${sectionId}`, { title });
  return res.data;
}

export async function createTask(stageId: number, title: string) {
  const res = await API.post(`/tasks/stage/${stageId}`, { title });
  return res.data;
}

export async function getTask(taskId: number) {
  const res = await API.get(`/tasks/${taskId}`);
  return res.data;
}

export async function updateTask(
  taskId: number,
  data: { title?: string; description?: string; assigneeIds?: number[] }
) {
  const res = await API.put(`/tasks/${taskId}`, data);
  return res.data;
}

export async function createComment(
  taskId: number,
  content: string,
  mentionedUserIds: number[]
) {
  const res = await API.post(`/tasks/${taskId}/comments`, {
    content,
    mentionedUserIds,
  });
  return res.data;
}

export async function updateComment(
  commentId: number,
  content: string,
  mentionedUserIds: number[]
) {
  const res = await API.put(`/comments/${commentId}`, {
    content,
    mentionedUserIds,
  });
  return res.data;
}

export async function deleteComment(commentId: number) {
  const res = await API.delete(`/comments/${commentId}`);
  return res.data;
}
