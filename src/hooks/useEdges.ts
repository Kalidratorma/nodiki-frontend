import { useState, useEffect, useCallback } from "react";
import {
    fetchEdges,
    updateEdge as updateEdgeAPI,
    createEdge as createEdgeAPI,
    deleteEdge,
    EdgeData,
} from "../services/api";
import { Edge, addEdge, Connection, EdgeChange, applyEdgeChanges } from "reactflow";

export const useEdges = () => {
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        fetchEdges().then((rawEdges: EdgeData[]) => {
            const converted: Edge[] = rawEdges.map((e) => ({
                id: e.id.toString(),
                source: e.sourceId.toString(),
                target: e.targetId.toString(),
                label: e.description,
                type: "default",
            }));
            setEdges(converted);
        });
    }, []);

    const updateEdge = async (id: string, newDescription: string) => {
        await updateEdgeAPI(id, newDescription);
        setEdges((prev) =>
            prev.map((e) =>
                e.id === id ? { ...e, label: newDescription } : e
            )
        );
    };

    const createEdge = async (connection: Connection) => {
        if (!connection.source || !connection.target) return;

        const newEdgeData: Omit<EdgeData, "id"> = {
            sourceId: parseInt(connection.source, 10),
            targetId: parseInt(connection.target, 10),
            description: "New connection",
        };

        const savedEdge = await createEdgeAPI(newEdgeData);

        const newEdge: Edge = {
            id: savedEdge.id.toString(),
            source: savedEdge.sourceId.toString(),
            target: savedEdge.targetId.toString(),
            label: savedEdge.description,
            type: "default",
        };

        setEdges((eds) => addEdge(newEdge, eds));
    };

    const onEdgesChange = useCallback((changes: EdgeChange[]) => {
        changes.forEach((change) => {
            if (change.type === "remove") {
                deleteEdge(change.id);
            }
        });

        setEdges((eds) => applyEdgeChanges(changes, eds));
    }, []);

    return { edges, setEdges, updateEdge, createEdge, onEdgesChange };
};
