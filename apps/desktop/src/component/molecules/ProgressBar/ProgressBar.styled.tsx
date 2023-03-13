import styled, {css} from "styled-components";
import { ReactNode } from "react";

export interface ProgressBarStylesProps {
    completed: number
}

export const ProgressBarStyles = styled.div<ProgressBarStylesProps>`

    height: 20px;
    width: '100%';
    margin: 50;
    border-radius: 10px 10px 10px 10px;
    border-width: 1.5px;
    border-style: solid;
    border-color: #B78D51;

    .filter {
        height: "100%";
        width: ${(props) => `${props.completed}%`};
        background: linear-gradient(90deg, #E9B873 0.19%, #FEDD8F 37.17%, #B78D51 100.19%);
        text-align: 'right';
        border-radius: 10px 0px 0px 10px;
    }

    .label {
        visibility: hidden;
        padding: 5;
        color: 'white';
        font-weight: 'bold';
    }

`