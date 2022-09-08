import React from 'react'
import { Controller, Board } from './Components'
import { Box, AppBar, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { createGlobalStyle } from 'styled-components';

const theme = createTheme({
   typography: {
    'font-family': `'Inter', sans-serif`
   },
   palette: {
    primary : {
        main : '#52b1e0'
    },
    secondary : {
        main : '#4ae7aa'
    },
    tertiary : {
        main : '#f15757'
    },
   }
});

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
    box-sizing : border-box;
    overflow : hidden;
  }
`;


export default function App() {
    const board = React.useRef(null);
    const actions = {
        "Start" : () => board.current?.start(),
        "Stop" : () => board.current?.stop(),
        "Clear" : () => board.current?.clear(),
    }
    const algorithms = {
        "Djikstra" : () => board.current?.setAlgorithm("djikstra"),
        "A* Search" : () => board.current?.setAlgorithm("astar"),
        "Swarm" : () => board.current?.setAlgorithm("djikstra")
    }
    return (
        <ThemeProvider theme={theme}>
            <GlobalStyle/>
            {/* <AppBar position = 'static'>
                <Toolbar>
                        
                </Toolbar>
            </AppBar> */}
            <Box display='flex' width='100vw' height='100vh'>
                <Controller actions = {actions} algorithms = {algorithms}/>
                <Board ref={board}/>
            </Box>
        </ThemeProvider>
        // <ThemeProvider theme={theme}>
        //     <Box display='flex' width='100vw' height='100vh'>
        //         <Controller actions = {actions} algorithms = {algorithms}/>
        //         <Box width = '100%' height = '100%'>
        //             <AppBar position = 'static'>
        //                 <Toolbar>
                                
        //                 </Toolbar>
        //             </AppBar>
        //             <Board ref={board}/>
        //         </Box>
        //     </Box>
        // </ThemeProvider>
        // </Box>
    )
}