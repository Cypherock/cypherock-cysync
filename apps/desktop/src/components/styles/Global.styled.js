import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
/* @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap'); */
    *{
        box-sizing: border-box;
        margin: 0px;
        padding: 0px;
    }
    body{
        font-family: 'Poppins', sans-serif;

    }

    h1{
        font-size: 40px;
    }
    h2{
        font-size: 32px;
    }
    h3{
        font-size: 28px;
    }
    h4{
        font-size: 24px;
    }
    h5{
        font-size: 20px;
    }
    h6{
        font-size: 16px;
    }
    `;
