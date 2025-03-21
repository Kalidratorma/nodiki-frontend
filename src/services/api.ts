import config from "../config/config";

// Тип для одной ноды, приходящей с сервера
export interface NodeData {
  id: string | number;
  label: string;
  x: number;
  y: number;
}

// Тип для связи, приходящей с сервера
export interface EdgeData {
  id: string | number;
  sourceId: string | number;
  targetId: string | number;
  description: string;
}

export const fetchNodes = async (): Promise<NodeData[]> => {
  const res = await fetch(`${config.API_URL}/nodes`);
  return res.json();
};

export const createNode = async (
    node: Omit<NodeData, "id">
): Promise<NodeData> => {
  const res = await fetch(`${config.API_URL}/nodes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(node),
  });
  return res.json();
};

export const deleteAllNodes = async (): Promise<void> => {
  await fetch(`${config.API_URL}/nodes/clear`, {
    method: "DELETE",
  });
};

export const fetchEdges = async (): Promise<EdgeData[]> => {
  const res = await fetch(`${config.API_URL}/edges`);
  return res.json();
};

export const updateEdge = async (
    id: string,
    newDescription: string
): Promise<void> => {
  await fetch(`${config.API_URL}/edges/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: newDescription }),
  });
};

export const updateNode = async (
    id: string,
    newLabel: string
): Promise<void> => {
  await fetch(`${config.API_URL}/nodes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ label: newLabel }),
  });
};
