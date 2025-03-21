import React from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    Edge,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    applyNodeChanges,
    applyEdgeChanges,
    Connection,
    NodeDragHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import Toolbar from "./components/Toolbar";
import NodeComponent from "./components/NodeComponent";
import { useNodes } from "./hooks/useNodes";
import { useEdges } from "./hooks/useEdges";
import "./styles/styles.css";
import {deleteEdge, deleteNode} from "./services/api";

const nodeTypes = {
    default: NodeComponent,
};

const App: React.FC = () => {
    const { nodes, setNodes, addNode, clearNodes, saveNodePosition } = useNodes();
    const { edges, setEdges, updateEdge, createEdge } = useEdges();

    const onEdgeDoubleClick = (
        event: React.MouseEvent,
        edge: Edge
    ): void => {
        const newDescription = prompt(
            "Update connection description:",
            edge.label?.toString()
        );
        if (newDescription !== null) {
            updateEdge(edge.id.toString(), newDescription);
        }
    };

    const onNodesChange: OnNodesChange = (changes) => {
        changes.forEach((change) => {
            if (change.type === "remove") {
                deleteNode(change.id); // прямой вызов
            }
        });
        setNodes((nds) => applyNodeChanges(changes, nds));
    };

    const onEdgesChange: OnEdgesChange = (changes) => {
        changes.forEach((change) => {
            if (change.type === "remove") {
                deleteEdge(change.id); // прямой вызов
            }
        });
        setEdges((eds) => applyEdgeChanges(changes, eds));
    };


    const onConnect: OnConnect = (connection: Connection) => {
        createEdge(connection);
    };

    // 👇 Важнейший обработчик, чтобы сохранить позиции после перетаскивания
    const onNodeDragStop: NodeDragHandler = (event, node) => {
        saveNodePosition(node.id, node.position.x, node.position.y);
    };

    return (
        <div className="fullscreen">
            <Toolbar onAddNode={addNode} onClear={clearNodes} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onEdgeDoubleClick={onEdgeDoubleClick}
                onNodeDragStop={onNodeDragStop}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>

        </div>
    );
};

export default App;
