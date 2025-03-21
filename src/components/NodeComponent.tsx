import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

const NodeComponent: React.FC<NodeProps> = ({
                                                id,
                                                data,
                                                selected,
                                                dragging,
                                                isConnectable,
                                            }) => {
    const handleDoubleClick = () => {
        const newLabel = prompt("Edit node label:", data.label);
        if (newLabel !== null && newLabel !== data.label) {
            data.onEdit?.(id, newLabel);
        }
    };

    const handleDragStart = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation();
    };

    return (
        <div
            className={`node-default ${selected ? "selected" : ""} ${
                dragging ? "dragging" : ""
            }`}
            onDoubleClick={handleDoubleClick}
            onDragStart={handleDragStart}
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
