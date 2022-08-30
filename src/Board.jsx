import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import RightArrow from './Assets/RightArrow.svg';
import Target from './Assets/Target.svg';
import Animator from "./Animator";
import djikstra from "./Algorithms/Djikstra";
const GlobalStyle = createGlobalStyle`
  body {
    margin : 0;
    padding : 0;
    box-sizing : border-box;
    overflow : hidden;
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
  flex-grow : 1;
  height : 100%;
`;
const GridCell = styled.div`
  aspect-ratio : 1;
  border : 1px solid #e7e7e7;
`;

const IconCell = styled(GridCell)`
  animation: ${creation} 0.5s forwards;
  background-size: cover;
  background-image:url(${props => props.image});
  color : gray;
  user-select:none;
`;
const VisitedCell = styled(GridCell)`
  animation: ${creation} 2s forwards;
  background-color : hsl(200, 70%, 60%);
`;
const NormalCell = styled(GridCell)`
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

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default class Board extends React.Component{
  constructor(){
    super();
    this.source = [0, 0];
    this.target = [0, 0];
    this.state = {cells : this.makeBoard(15, 30)};
    this.grid = React.createRef();
    this.frames = null;
    this.isMouseDown = false;
    this.isDragging = 0;
    
    this.resizeGrid = () => {
      // console.log(window.innerWidth, window.innerHeight)
      const containerWidth = this.grid.current.offsetWidth;
      const containerHeight = this.grid.current.offsetHeight;

      const cols = Math.floor((containerWidth * 29)/1200); /* 1600 * 0.75 = 1200 */
      const rows = Math.floor(containerHeight / (containerWidth / cols - 1));
      
      this.setState({cells:this.makeBoard(rows, cols)});
      this.forceUpdate();
    }

    this.animator = new Animator(60, (animatorRef) => {
    const nextFrame = this.frames.next();
      let board;
      if(nextFrame.done){
        if(nextFrame.value.value === null) alert("No pathh!!!");
        animatorRef.stop();
        this.frames = null;
        return;
      } 
      
      if(nextFrame.value.type === "visited"){
        board = [...this.state.cells];
        board.map((row, i) => row.map((item, j) => 
        {
          if(nextFrame.value.value[[i, j]].visited && board[i][j] === 0) board[i][j] = 5;
          return item;
        }));
      }
      else if(nextFrame.value.type === "path"){
        board = this.updateIndices([nextFrame.value.value], [4], this.state.cells);
      }
      this.setState({cells:board});
      this.forceUpdate();
    });
  }
  componentDidMount(){
    this.resizeGrid();
    window.addEventListener('resize', this.resizeGrid);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.resizeGrid);
  }
  makeBoard(rows, columns){
    const board = Array.from({length: rows},()=> Array.from({length: columns}, () => 0));
    this.source[0] = getRandomInt(0, rows);
    this.source[1] = getRandomInt(0, columns);
    while(this.target[0] === this.source[0] && this.target[1] === this.source[1]){
      this.target[0] = getRandomInt(0, rows);
      this.target[1] = getRandomInt(0, columns);
    }
    board[this.source[0]][this.source[1]] = 1;
    board[this.target[0]][this.target[1]] = 2;
    return board;
  }
  updateIndices(indices, values, array){
    const board = [...array];
    if(values.length === 1)
      indices.map( index => board[index[0]][index[1]] = values[0]);
    else if(values.length === indices.length)
      indices.map( (index, i) => board[index[0]][index[1]] = values[i]);
    else{
      console.error("Error in updateIndices function. The length of valuelist is incompatible.");
    }
    return board;
  }

  clickNormalCell(row, column){
    if(this.isDragging !== 0)
    {
      this.setState({cells: this.updateIndices([[row, column]], [this.isDragging], this.state.cells)});
      
      if(this.isDragging === 1){
        this.source = [row, column]
      }
      else if(this.isDragging === 2){
        this.target = [row, column];
      }
      else alert("Errorrrr");
      this.isDragging = 0;
    }
    else{
      this.setState({cells: this.updateIndices([[row, column]], [3], this.state.cells)});
    }
  }
  clickIconCell(row, column, id){
    if(this.frames === null){
      this.setState({cells: this.updateIndices([[row, column]], [0], this.state.cells)});
      this.isDragging = id;
    }
  }
  CellFactory(id, row, column){
    switch(id){
      case 0 : return <NormalCell 
                        key = {[row, column]} 
                        color='white' 
                        onMouseMove = {() => this.isMouseDown && this.setState({cells: this.updateIndices([[row, column]], [3], this.state.cells)})}
                        onClick = {() =>this.clickNormalCell(row, column)}
                        />; /*Normal Cell*/

      case 1 : return <IconCell 
                        key = {[row, column]} 
                        image = {RightArrow} 
                        draggable={false}
                        onClick = {() => this.clickIconCell(row, column, id)}
                        />
 
      case 2 : return <IconCell 
                        key = {[row, column]} 
                        image = {Target} 
                        draggable={false}
                        onClick = {() => this.clickIconCell(row, column, id)}
                        />

      case 3 : return <Wall key = {[row, column]} 
                        onClick = {() => this.setState({cells: this.updateIndices([[row, column]], [0], this.state.cells)})}
                        />; /* Wall */
      case 4 : return <Path key = {[row, column]}/>; /* Path */
 
      case 5 : return <VisitedCell key = {[row, column]}/>; /* Visisted cell */
 
      default : return null;
    }
  }
  render(){
    return(
    <React.Fragment>
      <GlobalStyle/>
        <Grid ref={this.grid} n={this.state.cells[0].length} 
              onMouseDown = {() => this.isMouseDown = true} 
              onMouseUp = {() => this.isMouseDown = false}>
          {
            this.state.cells && this.state.cells.map((item, row) => item.map((subItem, column) => this.CellFactory(subItem, row, column)))
          }
        </Grid>
        {/* <button onClick={() => {this.frames = djikstra(this.state.cells, this.source, this.target); this.animator.start();}}>Click please</button> */}
    </React.Fragment>
    )
  }
};

// export default function Board(props) {
  
  
//   const initBoard = (M, N, source, target) => {
//     const board = Array.from({length: M},()=> Array.from({length: N}, () => 0));
//     board[source[0]][source[1]] = 1;
//     board[target[0]][target[1]] = 2;
//     return board;
//   }
//   console.log("Board component : ", props.rows, props.columns);
//   const source = React.useRef([0, 0]);
//   const target = React.useRef([0, 1]); 
//   const [cells, setcells] = React.useState(initBoard(props.rows, props.columns, source.current, target.current));
//   const frames = React.useRef(null);
//   const isMouseDown = React.useRef(false);
//   const isDragging = React.useRef(0);
//   const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  
//   const updateFrame = (board) => {setcells(board); forceUpdate();}

//   const updateIndices = (indices, valueList, array) => {
//     const board = [...array];
//     if(valueList.length === 1)
//       indices.map( index => board[index[0]][index[1]] = valueList[0]);
//     else if(valueList.length === indices.length)
//       indices.map( (index, i) => board[index[0]][index[1]] = valueList[i]);
//     else{
//       console.error("Error in updateIndices function. The length of valuelist is incompatible.");
//     }
//     return board;
//   }
  
//   const animator = React.useRef(new Animator(60, (animatorRef) => {
//     const nextFrame = frames.current.next();
//     let board;
//     if(nextFrame.done){
//       if(nextFrame.value.value === null) alert("No pathh!!!");
//       animatorRef.stop();
//       frames.current = null;
//       return;
//     } 
    
//     if(nextFrame.value.type === "visited"){
//       board = [...cells];
//       board.map((row, i) => row.map((item, j) => 
//       {
//         if(nextFrame.value.value[[i, j]].visited && board[i][j] === 0) board[i][j] = 5;
//         return item;
//       }));
//     }
//     else if(nextFrame.value.type === "path"){
//       board = updateIndices([nextFrame.value.value], [4], cells);
//     }
//     updateFrame(board);
//   }));

//   const clickNormalCell = (row, column) => {
//     if(isDragging.current !== 0)
//     {
//       setcells(updateIndices([[row, column]], [isDragging.current], cells));
      
//       if(isDragging.current === 1){
//         source.current = [row, column]
//       }
//       else if(isDragging.current === 2){
//         target.current = [row, column];
//       }
//       else alert("Errorrrr");
//       isDragging.current = 0;
//     }
//     else{
//       setcells(updateIndices([[row, column]], [3], cells));
//     }
//   }

//   const clickIconCell = (row, column, id) => {
//     if(frames.current === null){
//       setcells(updateIndices([[row, column]], [0], cells));
//       isDragging.current = id;
//     }
//   }
  
//   const CellFactory = (id, row, column) => {
//     switch(id){
//       case 0 : return <NormalCell 
//                         key = {[row, column]} 
//                         color='white' 
//                         onMouseMove = {() => isMouseDown.current && setcells(updateIndices([[row, column]], [3], cells))}
//                         onClick = {() =>clickNormalCell(row, column)}
//                         />; /*Normal Cell*/

//       case 1 : return <IconCell 
//                         key = {[row, column]} 
//                         image = {RightArrow} 
//                         draggable={false}
//                         onClick = {() => clickIconCell(row, column, id)}
//                         />
 
//       case 2 : return <IconCell 
//                         key = {[row, column]} 
//                         image = {Target} 
//                         draggable={false}
//                         onClick = {() => clickIconCell(row, column, id)}
//                         />

//       case 3 : return <Wall key = {[row, column]} 
//                         onClick = {() => setcells(updateIndices([[row, column]], [0], cells))}
//                         />; /* Wall */
//       case 4 : return <Path key = {[row, column]}/>; /* Path */
 
//       case 5 : return <VisitedCell key = {[row, column]}/>; /* Visisted cell */
 
//       default : return null;
//     }
//   }
//   return (
//     <React.Fragment>
//       <GlobalStyle/>
//         <Grid n={props.columns} onMouseDown = {() => isMouseDown.current = true} onMouseUp = {() => isMouseDown.current = false}>
//           {
//             cells && cells.map((item, row) => item.map((subItem, column) => CellFactory(subItem, row, column)))
//           }
//         </Grid>
//         {/* <button onClick={() => {frames.current = djikstra(cells, source.current, target.current); animator.current.start();}}>Click please</button> */}
//     </React.Fragment>
//   );
// }