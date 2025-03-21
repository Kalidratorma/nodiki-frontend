import { useState, useEffect, useCallback } from "react";
import {
    fetchNodes,
    createNode,
    deleteAllNodes,
    updateNode as updateNodeAPI,
    updateNodePosition,
    deleteNode,
    NodeData,
} from "../services/api";
import { Node, NodeChange, applyNodeChanges } from "reactflow";

export const useNodes = () => {
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        fetchNodes().then((fetched: NodeData[]) => {
            const converted: Node[] = fetched.map((n) => ({
                id: n.id.toString(),
                position: { x: n.x, y: n.y },
                data: { label: n.label, onEdit: handleEdit },
                type: "default",
            }));
            setNodes(converted);
        });
    }, []);

    const addNode = async () => {
        const newNode: Omit<NodeData, "id"> = {
            label: `Node ${nodes.length + 1}`,
            x: 50 * nodes.length,
            y: 50 * nodes.length,
        };
        const savedNode = await createNode(newNode);

        const reactflowNode: Node = {
            id: savedNode.id.toString(),
            position: { x: savedNode.x, y: savedNode.y },
            data: { label: savedNode.label, onEdit: handleEdit },
            type: "default",
        };

        setNodes((prev) => [...prev, reactflowNode]);
    };

    const handleEdit = async (id: string, newLabel: string) => {
        await updateNodeAPI(id, newLabel);
        setNodes((prev) =>
            prev.map((node) =>
                node.id === id
                    ? { ...node, data: { label: newLabel, onEdit: handleEdit } }
                    : node
            )
        );
    };

    const clearNodes = async () => {
        await deleteAllNodes();
        setNodes([]);
    };

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        changes.forEach((change) => {
            if (change.type === "remove") {
                deleteNode(change.id);
            } else if (change.type === "position" && change.dragging === false) {
                const node = nodes.find((n) => n.id === change.id);
                if (node) {
                    updateNodePosition(node.id, node.position.x, node.position.y);
                }
            }
        });

        setNodes((nds) => applyNodeChanges(changes, nds));
    }, [nodes]);

    return { nodes, addNode, clearNodes, onNodesChange, setNodes };
};
