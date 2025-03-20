import { useState, useEffect, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, addEdge } from 'reactflow';
import 'reactflow/dist/style.css';

const API_URL = "http://localhost:8080/api";

function App() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/nodes`)
            .then((res) => res.json())
            .then((data) => {
                setNodes(data.map((node) => ({
                    id: node.id.toString(),
                    position: { x: node.x, y: node.y },
                    data: { label: node.label },
                })));
            });

        fetch(`${API_URL}/edges`)
            .then((res) => res.json())
            .then((data) => {
                setEdges(data.map((edge) => ({
                    id: edge.id.toString(),
                    source: edge.sourceId.toString(),
                    target: edge.targetId.toString(),
                })));
            });
    }, []);

    const addNode = () => {
        const newNode = {
            label: `Карточка ${nodes.length + 1}`,
            x: 50 * nodes.length,
            y: 50 * nodes.length,
        };

        fetch(`${API_URL}/nodes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newNode),
        })
            .then((res) => res.json())
            .then((savedNode) => {
                setNodes((nds) => [
                    ...nds,
                    {
                        id: savedNode.id.toString(),
                        position: { x: savedNode.x, y: savedNode.y },
                        data: { label: savedNode.label },
                    },
                ]);
            });
    };

    const onConnect = useCallback(
        (connection) => {
            fetch(`${API_URL}/edges`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sourceId: connection.source, targetId: connection.target }),
            })
                .then((res) => res.json())
                .then((savedEdge) => {
                    setEdges((eds) => [
                        ...eds,
                        { id: savedEdge.id.toString(), source: savedEdge.sourceId, target: savedEdge.targetId },
                    ]);
                });
        },
        [setEdges]
    );

    const onNodesDelete = (deletedNodes) => {
        deletedNodes.forEach((node) => {
            fetch(`${API_URL}/nodes/${node.id}`, { method: "DELETE" })
                .then(() => {
                    setNodes((nds) => nds.filter((n) => n.id !== node.id));
                    setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
                });
        });
    };

    const onEdgesDelete = (deletedEdges) => {
        deletedEdges.forEach((edge) => {
            fetch(`${API_URL}/edges/${edge.id}`, { method: "DELETE" })
                .then(() => {
                    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                });
        });
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <button
                onClick={addNode}
                className="absolute z-10 top-4 left-4 bg-red-500 text-white px-3 py-1 rounded"
            >
                Добавить карточку
            </button>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default App;
