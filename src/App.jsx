import React from 'react'
import Board from './Board'
import { AppBar, Toolbar, Typography, IconButton, Box, Paper } from '@mui/material'
// import MenuIcon from '@mui/icons-material/Menu';
export default function App() {
    // const board = React.useRef(null);
    return (

        <Box display='flex' width='100vw' height='100vh'>
            <Paper style={{width:'30%'}}>

            </Paper>
            <Board/>
        </Box>
        // </Box>
    )
}
    // <Box sx={{ flexGrow: 1 }}>
    {/* <AppBar position="static">
        <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
            WizFind
            </Typography>
        </Toolbar>
    </AppBar> */}