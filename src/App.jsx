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
                    label: edge.description,
                })));
            });
    }, []);

    // 🚀 Добавление нового узла
    const addNode = () => {
        const newNode = {
            label: `Node ${nodes.length + 1}`,
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

    // 🚀 Очистка всей доски
    const clearBoard = () => {
        fetch(`${API_URL}/nodes/clear`, { method: "DELETE" })
            .then(() => {
                setNodes([]);
                setEdges([]);
            });
    };

    // 🚀 Добавление связи (edges)
    const onConnect = useCallback(
        (connection) => {
            const description = prompt("Enter a description for this connection:", "Default description");
            if (description !== null) {
                fetch(`${API_URL}/edges`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sourceId: connection.source, targetId: connection.target, description }),
                })
                    .then((res) => res.json())
                    .then((savedEdge) => {
                        setEdges((eds) => [
                            ...eds,
                            { id: savedEdge.id.toString(), source: savedEdge.sourceId, target: savedEdge.targetId, label: savedEdge.description },
                        ]);
                    });
            }
        },
        [setEdges]
    );

    // 🚀 Удаление узлов
    const onNodesDelete = (deletedNodes) => {
        deletedNodes.forEach((node) => {
            fetch(`${API_URL}/nodes/${node.id}`, { method: "DELETE" })
                .then(() => {
                    setNodes((nds) => nds.filter((n) => n.id !== node.id));
                    setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
                });
        });
    };

    // 🚀 Удаление связей
    const onEdgesDelete = (deletedEdges) => {
        deletedEdges.forEach((edge) => {
            fetch(`${API_URL}/edges/${edge.id}`, { method: "DELETE" })
                .then(() => {
                    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
                });
        });
    };

    // 🚀 Перемещение узлов
    const onNodeDragStop = (event, node) => {
        fetch(`${API_URL}/nodes/${node.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: node.data.label, x: node.position.x, y: node.position.y }),
        }).then(() => {
            setNodes((nds) =>
                nds.map((n) =>
                    n.id === node.id ? { ...n, position: { x: node.position.x, y: node.position.y } } : n
                )
            );
        });
    };

    // 🚀 Редактирование текста узла
    const onNodeDoubleClick = (event, node) => {
        const newLabel = prompt("Enter new text:", node.data.label);
        if (newLabel !== null) {
            fetch(`${API_URL}/nodes/${node.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ label: newLabel, x: node.position.x, y: node.position.y }),
            }).then(() => {
                setNodes((nds) =>
                    nds.map((n) =>
                        n.id === node.id ? { ...n, data: { label: newLabel } } : n
                    )
                );
            });
        }
    };

    // 🚀 Редактирование описания связи (edges)
    const onEdgesDoubleClick = (event, edge) => {
        const newDescription = prompt("Update connection description:", edge.label);
        if (newDescription !== null) {
            fetch(`${API_URL}/edges/${edge.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description: newDescription }),
            }).then(() => {
                setEdges((eds) =>
                    eds.map((e) =>
                        e.id === edge.id ? { ...e, label: newDescription } : e
                    )
                );
            });
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <div className="absolute z-10 top-4 left-4 flex gap-2">
                <button
                    onClick={addNode}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                >
                    Add Node
                </button>
                <button
                    onClick={clearBoard}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                >
                    Clear Board
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onConnect={onConnect}
                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                onNodeDragStop={onNodeDragStop}
                onNodeDoubleClick={onNodeDoubleClick}
                onEdgesDoubleClick={onEdgesDoubleClick}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default App;
