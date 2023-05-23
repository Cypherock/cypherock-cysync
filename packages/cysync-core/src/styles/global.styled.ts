import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    *{
        box-sizing: border-box;
        margin: 0px;
        padding: 0px; 
        font-family: 'Poppins';
    }
        

::-webkit-scrollbar {
  width: 4px;
}

/* Track */
::-webkit-scrollbar-track {
    background-color: transparent;
  border-radius: 6px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #46403C; 
  border-radius: 6px;
}`;
