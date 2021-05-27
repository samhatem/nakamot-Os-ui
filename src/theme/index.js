import React from 'react'
import styled, { createGlobalStyle, ThemeProvider as StyledComponentsThemeProvider, keyframes } from 'styled-components'

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Domine:wght@400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Tomorrow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');

  body {    
    padding: 0px 0px 11vw;
    font-family: sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Tomorrow, sans-serif;
    background-image: url('cybertruck.png'), url('btc-flag.png'), url('moon-ground-overlay.png'), url("stars.png"); 
    background-repeat: no-repeat, no-repeat, repeat-x, repeat;
    background-position: 0% 60%, right bottom, center ;
    background-size: 30%, 20%, 25%, 100%;
    padding-right: 2%;

    @media not screen and (max-width: 480px) {
      overflow: hidden;
      height: 100vh;
      /* overflow-y: hidden; */
    }

    @media only screen and (max-width: 480px) {
      background-image: url("stars.png"); 
      background-repeat: repeat;    
      background-size: 100%;
      padding-bottom: 50px;
    }
  }
`

const theme = {
  primary: '#FE8700',
  secondary: '#F1F2F6',
  text: '#000',
  textDisabled: '#737373',
  orange: '#FE8700',
  green: '#66BB66',
  grey: '#F1F2F6',
  blue: '#2F80ED',
  white: '#FFF',
  black: '#000'
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`

export function ThemeProvider({ children }) {
  return <StyledComponentsThemeProvider theme={theme}>{children}</StyledComponentsThemeProvider>
}
