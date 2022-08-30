import React from 'react'
import Board from './Board'
import {Grid, AppBar, Button, Toolbar, Typography, IconButton, Box, Paper, Drawer, List, ListItemButton, ListItem, ListItemText, ListItemIcon } from '@mui/material'

// import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const theme = createTheme({
   typography: {
    "fontFamily": `'Ubuntu', sans-serif`,
   }
});



export default function App() {
    const board = React.useRef(null);
    const actions = [
        {name:"Start", action: () => board.current?.start()},
        {name:"Stop", action: () => board.current?.stop()},
        {name:"Clear", action: () => board.current?.clear()},
    ]
    const algorithms = [
        {name:"Djikstra", setter: () => board.current?.setAlgorithm("djikstra")},
        {name:"A* Search", setter : () => board.current?.setAlgorithm(null)}
    ]
    const [open, setopen] = React.useState(true);
    return (
        <ThemeProvider theme={theme}>
            <Box display='flex' width='100vw' height='100vh'>
                <Drawer 
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: 240,
                            boxSizing: 'border-box'
                        }
                        }}
                    variant='permanent' 
                    anchor='left'>
                    <Toolbar />
                    <List>
                         <ListItemButton onClick={()=>setopen(!open)}>
                            <ListItemIcon>
                            <ScienceIcon />
                            </ListItemIcon>
                            <ListItemText primary="Algorithms" />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {
                                    algorithms.map((item, key) => 
                                        <ListItem key = {key} >
                                            <ListItemButton onClick = {item.setter}>
                                                <ListItemIcon>
                                                <ArrowRightIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={item.name} />
                                            </ListItemButton>
                                        </ListItem>   
                                    )
                                }
                            </List>
                        </Collapse>
                        <Grid marginTop={3} display={'flex'} alignItems='center' flexDirection={'column'} gap={2}>
                            {
                                actions.map((item, key) =>
                                    <Grid item key = {key}>
                                        <Button variant = "outlined" size = 'large' onClick = {item.action}>{item.name}</Button>
                                    </Grid>
                                )
                            }
                            {/* <Button variant="contained">Start</Button>
                            <Button variant="contained">Stop</Button>
                            <Button variant="contained">Clear</Button> */}
                        </Grid>
                    </List>
                </Drawer>
                
                <Board ref={board}/>
            </Box>
        </ThemeProvider>
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