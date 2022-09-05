import React from 'react'

import { Box, ButtonBase, Drawer } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ClearIcon from '@mui/icons-material/Clear';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

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


export default function Controller({theme, algorithms, actions}) {
  const [open, setopen] = React.useState(false);
  console.log(actions);
  return (
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
        <CustomIconButton 
          sx = {{my:4}}
          onClick = {actions["Start"]}
          >
          <PlayArrowIcon fontSize = 'large' color = 'secondary'/>
        </CustomIconButton>
        <CustomIconButton 
          sx = {{my:4}}
          onClick = {actions["Stop"]}
          >
          <PauseIcon fontSize = 'large' color = 'tertiary'/>
        </CustomIconButton>
        <CustomIconButton 
          sx = {{my:4}}
          onClick = {actions["Clear"]}
          >
          <ClearIcon fontSize = 'large' color = 'primary'/>
        </CustomIconButton>
      </Box>
    </Box>
  )
}


/* The green #4ae7aa . Consider transitions between the green and the blue. */