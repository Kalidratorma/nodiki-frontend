import React from "react";
import {
    Handle,
    NodeProps,
    Position,
    useReactFlow,
} from "reactflow";

const NodeComponent: React.FC<NodeProps> = ({
                                                id,
                                                data,
                                                selected,
                                                dragging,
                                                isConnectable,
                                            }) => {
    const { setNodes } = useReactFlow();

    const handleDoubleClick = () => {
        const newLabel = prompt("Edit node label:", data.label);
        if (newLabel !== null && newLabel !== data.label) {
            data.onEdit?.(id, newLabel);
        }
    };

    return (
        <div
            className={`node-default ${selected ? "selected" : ""} ${
                dragging ? "dragging" : ""
            }`}
            onDoubleClick={handleDoubleClick}
        >
            <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
            />
            <div>{data.label}</div>
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </div>
    );
};

export default NodeComponent;
