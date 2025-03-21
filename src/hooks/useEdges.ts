import { useState, useEffect } from "react";
import { fetchEdges, updateEdge as updateEdgeAPI } from "../services/api";
import { Edge } from "reactflow";

export const useEdges = () => {
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        fetchEdges().then((rawEdges) => {
            const converted: Edge[] = rawEdges.map((e) => ({
                id: e.id.toString(),
                source: e.sourceId.toString(),
                target: e.targetId.toString(),
                label: e.description,
                type: "default", // можно расширить при кастомизации
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

    return { edges, updateEdge };
};
