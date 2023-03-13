import React from "react";
import { ProgressBarStyles, ProgressBarStylesProps } from "./ProgressBar.styled";



export const ProgressBar = (props: ProgressBarStylesProps) => {
  const { completed } = props;
  return (
    <ProgressBarStyles completed={completed}>
      <div className="filter">
        <span className="label">{`${completed}%`}</span>
      </div>
    </ProgressBarStyles>
  );
};


