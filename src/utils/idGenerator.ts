export const LAST_SAVED_TASK_ID_KEY = "lastTaskId";

export const getNextId = (): number => {
  const lastId = localStorage.getItem(LAST_SAVED_TASK_ID_KEY);
  const parsedId = parseInt(lastId ?? "", 10);
  const nextId = isNaN(parsedId) ? 1 : parsedId + 1;
  localStorage.setItem(LAST_SAVED_TASK_ID_KEY, nextId.toString());
  return nextId;
};
