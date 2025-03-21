import React from "react";

interface Props {
    onAddNode: () => void;
    onClear: () => void;
}

const Toolbar: React.FC<Props> = ({ onAddNode, onClear }) => {
    return (
        <div className="toolbar">
            <button className="button button-green" onClick={onAddNode}>
                Add Node
            </button>
            <button className="button button-red" onClick={onClear}>
                Clear Board
            </button>
        </div>
    );
};

export default Toolbar;
