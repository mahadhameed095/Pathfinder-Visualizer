import React from 'react'
import { Controller, Board } from './Components'
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
   typography: {
    "fontFamily": `'Ubuntu', sans-serif`,
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
        "A* Search" : () => board.current?.setAlgorithm(null)
    }
    return (
        <ThemeProvider theme={theme}>
            <Box display='flex' width='100vw' height='100vh'>
                <Controller actions = {actions} algorithms = {algorithms}/>
                <Board ref={board}/>
            </Box>
        </ThemeProvider>
        // </Box>
    )
}