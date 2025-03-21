import React from "react";
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    Edge,
    Node,
} from "reactflow";
import "reactflow/dist/style.css";

import Toolbar from "./components/Toolbar";
import NodeComponent from "./components/NodeComponent";
import { useNodes } from "./hooks/useNodes";
import { useEdges } from "./hooks/useEdges";
import "./styles/styles.css";

// Регистрируем кастомный компонент для узлов
const nodeTypes = {
    default: NodeComponent,
};

const App: React.FC = () => {
    const { nodes, addNode, clearNodes } = useNodes();
    const { edges, updateEdge } = useEdges();

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

    return (
        <div className="fullscreen">
            <Toolbar onAddNode={addNode} onClear={clearNodes} />
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onEdgeDoubleClick={onEdgeDoubleClick}
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default App;
