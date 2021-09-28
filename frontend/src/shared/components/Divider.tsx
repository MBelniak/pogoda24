import React from "react";

interface DividerProps {
    style?: any;
}
export const Divider = (props: DividerProps) => <div className="is-divider" style={props.style || {}}/>
