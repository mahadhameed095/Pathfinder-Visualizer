import React from 'react'
import { Controller, Board } from './Components'
import { Box, AppBar, Toolbar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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



export default function App() {
    const board = React.useRef(null);
    const actions = {
        "Start" : () => board.current?.start(),
        "Stop" : () => board.current?.stop(),
        "Clear" : () => board.current?.clear(),
    }
    const algorithms = {
        "Djikstra" : () => board.current?.setAlgorithm("djikstra"),
        "A* Search" : () => board.current?.setAlgorithm("djikstra"),
        "Swarm" : () => board.current?.setAlgorithm("djikstra")
    }
    return (
        <ThemeProvider theme={theme}>
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