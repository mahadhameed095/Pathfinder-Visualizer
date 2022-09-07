import React from 'react'

import { Box, ButtonBase, Drawer, Paper, Avatar, Typography, Button, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';

const CustomIconButton = (props) => {
  const {sx, children, ...forwardProps} = props;
  return (
    <ButtonBase
      sx = {{
        p : 2,
        boxShadow : 4,
        width : 'fit-content',
        borderRadius : 5,
        ...sx
      }}
      {...forwardProps}
    >
      {children}
    </ButtonBase>
  )
}

const colors = ['primary.main', 'secondary.main', 'tertiary.main'];
const actionIcons = 
[ 
  <PlayArrowIcon fontSize = 'large' color = 'secondary'/>,
  <PauseIcon fontSize = 'large' color = 'tertiary'/>,
  <ClearIcon fontSize = 'large' color = 'primary'/>
]
export default function Controller({theme, algorithms, actions}) {
  const [open, setopen] = React.useState(false);
  const [choice, setchoice] = React.useState("Djikstra")
  return (
    <>
      <Drawer
        anchor="left"
        open={open}
        // variant = 'permanent'
        onClose={() => setopen(false)}
      >
        <Box height = '100%' sx = {{display : 'flex', justifyContent: 'space-between', flexDirection : 'column'}}>
          <Paper component={ButtonBase}  sx = {{display : "flex", px : 3, py : 2, m:3, mt:4, boxShadow : 3, borderRadius : 4}}>
            <Avatar sx = {{mr: 3}}>M</Avatar>
            <Box>
              <Typography fontWeight='bold'>Mahad Hameed</Typography>
              <Typography color='textSecondary' textAlign='initial'>Creator</Typography>
            </Box>
          </Paper>
          <Box>
            <Typography textAlign = 'center' color='textSecondary' fontWeight='bold'>{"Algorithm : " + choice}</Typography>
          </Box>
          <Box 
            >
            <Typography textAlign = 'center' color='textSecondary' fontWeight='bold'>Choose an algorithm!</Typography>
            <Box 
              display = 'flex' 
              flexDirection = 'column' 
              width = 'fit-content' 
              mx='auto'
            >
              {
                Object.keys(algorithms).map( 
                  (key, index) => <Button 
                                    variant="contained" 
                                    sx={{my: 3, px:4, py: 2, borderRadius : 4, color : 'white', fontWeight : 'bold', bgcolor : colors[index]}} 
                                    key={key}
                                    onClick = {() => { algorithms[key]() ; setchoice(key)}}
                                    >
                                    {key}
                                  </Button>)
              }
            </Box>
          </Box>
          <Box display = 'flex' justifyContent='space-evenly' my={2}>
            <IconButton>
              <EmailIcon fontSize='large'/>
            </IconButton>
            <IconButton>
              <GitHubIcon fontSize='large'/>
            </IconButton>
            <IconButton>
              <LinkedInIcon fontSize='large'/>
            </IconButton>
          </Box>
        </Box>
      </Drawer>
      <Box 
        display = "flex"
        flexDirection = "column"
        width = "100px"
        >
        
        <CustomIconButton 
          sx={{mx:"auto", mt: 2}}
          onClick = {()=>setopen(true)}
          >
          <MenuOpenIcon fontSize = 'large'  sx={{color:'darkgray'}}/>
        </CustomIconButton>
        <Box 
          display="flex"
          flexDirection='column'
          alignItems='center'
          my='auto'
        >
          {
            Object.keys(actions).map(
              (key, index) => <CustomIconButton
                                sx = {{my : 4}} 
                                key = {index}
                                onClick = {actions[key]}>
                                  {
                                    actionIcons[index]
                                  }
                                </CustomIconButton>)
          }
        </Box>
      </Box>
    </>
  )
}


/* The green #4ae7aa . Consider transitions between the green and the blue. */