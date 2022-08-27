import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
// import FlagCircleIcon from '@mui/icons-material/FlagCircle';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import RightArrow from './Assets/RightArrow.svg';
import Target from './Assets/Target.svg';
import Animator from "./Animator";
import djikstra from "./Algorithms/Djikstra";

const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
    box-sizing : border-box;
  }
`;

const creation = keyframes`
  from {
    transform : scale(0.1);
    border-radius : 50%;
  }

  to {
    transform : scale(1.0);
    border-radius : 0%;
  }
`;

const Grid = styled.div`
  background-color : #e9e9e9;
  display: grid;
  grid-template-columns: repeat(${ props => props.n }, 1fr);
  grid-gap : 1px;
`;
const GridCell = styled.div`
  aspect-ratio : 1;
  border : 1px solid #e7e7e7;
`;

const IconCell = styled(GridCell)`
  background-size: cover;
  background-image:url(${props => props.image});
  color : gray;
`;
const VisitedCell = styled(GridCell)`
  animation: ${creation} 2s forwards;
  background-color : hsl(200, 70%, 60%);
`;
const Cell = styled(GridCell)`
  background-color: ${props => props.color};
`;

const Wall = styled(GridCell)`
  animation: ${creation} 0.5s forwards;
  background-color : gray;
`;
const Path = styled(GridCell)`
  animation: ${creation} 0.5s forwards;
  background-color : #f15757;
`;
export default function Board() {
  
  
  const initBoard = (M, N, source, target) => {
    const board = Array.from({length: M},()=> Array.from({length: N}, () => 0));
    board[source[0]][source[1]] = 1;
    board[target[0]][target[1]] = 2;
    return board;
  }
  const [M, N] = [20, 40];
  const source = [10, 10];
  const target = [10, 20];
  const [cells, setcells] = React.useState(initBoard(M, N, source, target));
  const frames = React.useRef(null);
  const isMouseDown = React.useRef(false);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
  const updateFrame = (board) => {setcells(board); forceUpdate();}

  const updateIndices = (indices, valueList, array) => {
    const board = [...array];
    if(valueList.length === 1)
      indices.map( index => board[index[0]][index[1]] = valueList[0]);
    else if(valueList.length === indices.length)
      indices.map( (index, i) => board[index[0]][index[1]] = valueList[i]);
    else{
      console.error("Error in updateIndices function. The length of valuelist is incompatible.");
    }
    return board;
  }
  
  const animator = React.useRef(new Animator(60, (animatorRef) => {
    const nextFrame = frames.current.next();
    let board;
    if(nextFrame.done){
      animatorRef.stop();
      return;
    } 
    
    if(nextFrame.value.type === "visited"){
      board = [...cells];
      board.map((row, i) => row.map((item, j) => 
      {
        if(nextFrame.value.value[[i, j]].visited && board[i][j] === 0) board[i][j] = 5;
        return item;
      }));
    }
    else if(nextFrame.value.type === "path"){
      if(nextFrame.value.value === null) alert("No pathh!!!");
      board = updateIndices([nextFrame.value.value], [4], cells);
    }
    updateFrame(board);
  }));

  const CellFactory = (id, row, column) => {
    switch(id){
      case 0 : return <Cell key = {[row, column]} 
                            color='white' 
                            onMouseMove = {() => isMouseDown.current && setcells(updateIndices([[row, column]], [3], cells))}
                            onClick = {() => setcells(updateIndices([[row, column]], [3], cells))}
                            />; /*Normal Cell*/

      case 1 : return <IconCell key = {[row, column]} image = {RightArrow} draggable={false}/>
      case 2 : return <IconCell key = {[row, column]} image = {Target} draggable={false}/>
      case 3 : return <Wall key = {[row, column]} 
                            onMouseMove = {() => isMouseDown.current && setcells(updateIndices([[row, column]], [0], cells))}
                            onClick = {() => setcells(updateIndices([[row, column]], [0], cells))}
                            />; /* Wall */
      case 4 : return <Path key = {[row, column]}/>; /* Path */
      case 5 : return <VisitedCell key = {[row, column]}/>; /* Visisted cell */
      default : return null;
    }
  }
  return (
    <React.Fragment>
      <GlobalStyle/>
      <div>
        <Grid n={N} onMouseDown = {() => isMouseDown.current = true} onMouseUp = {() => isMouseDown.current = false}>
          {
            cells && cells.map((item, row) => item.map((subItem, column) => CellFactory(subItem, row, column)))
          }
        </Grid>
        <button onClick={() => {frames.current = djikstra(cells, source, target); animator.current.start();}}>Click please</button>
      </div>
    </React.Fragment>
  );
}