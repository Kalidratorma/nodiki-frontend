import config from "../config/config";

export interface NodeData {
  id: string | number;
  label: string;
  x: number;
  y: number;
}

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

export const updateNodePosition = async (
    id: string,
    x: number,
    y: number
): Promise<void> => {
  await fetch(`${config.API_URL}/nodes/${id}/position`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ x, y }),
  });
};

// Методы для edges
export const fetchEdges = async (): Promise<EdgeData[]> => {
  const res = await fetch(`${config.API_URL}/edges`);
  return res.json();
};

export const createEdge = async (
    edge: Omit<EdgeData, "id">
): Promise<EdgeData> => {
  const res = await fetch(`${config.API_URL}/edges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(edge),
  });
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

export const deleteNode = async (id: string): Promise<void> => {
  await fetch(`${config.API_URL}/nodes/${id}`, {
    method: "DELETE",
  });
};

export const deleteEdge = async (id: string): Promise<void> => {
  await fetch(`${config.API_URL}/edges/${id}`, {
    method: "DELETE",
  });
};

