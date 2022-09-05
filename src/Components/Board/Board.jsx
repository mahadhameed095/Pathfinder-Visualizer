import React from "react";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import RightArrow from '../../Assets/RightArrow.svg';
import Target from '../../Assets/Target.svg';
import Animator from "../../Animator";
import djikstra from "../../Algorithms/Djikstra";

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
  background-color : white;
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
    this.state = {cells : this.makeBoard(15, 29)};
    this.grid = React.createRef();
    this.frames = null;
    this.isMouseDown = false;
    this.isDragging = 0;
    this.algorithmChoice = "djikstra";
    this.algorithms = {
      "djikstra" : () => djikstra(this.state.cells, this.source, this.target),
      "A* Search" : () => null
    }
    
    this.resizeGrid = () => {
      const containerWidth = this.grid.current.offsetWidth;
      const containerHeight = this.grid.current.offsetHeight;

      const cols = Math.floor((containerWidth * 29)/1200);
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
        board = this.state.cells.map((row, i) => row.map((item, j) => nextFrame.value.value[[i, j]].visited && item === 0 ? 5 : item))
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

  isPlaying(){
    return this.animator.playing;
  }
  makeBoard(rows, columns){
    const board = Array.from({length: rows},()=> Array.from({length: columns}, () => 0));
    this.source[0] = getRandomInt(0, rows);
    this.source[1] = getRandomInt(0, columns);
    do{
      this.target[0] = getRandomInt(0, rows);
      this.target[1] = getRandomInt(0, columns);
    }
    while(this.target[0] === this.source[0] && this.target[1] === this.source[1]);
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
  setAlgorithm(algorithm){
    this.choice = algorithm;
  }
  start(){
    if(this.frames === null)
    {
      this.frames = this.algorithms[this.algorithmChoice]();
    }
    this.animator.start();
  }
  stop(){
    this.animator.stop();
  }
  clear(){
    this.frames = null;
    this.animator.stop();
    this.setState({
      cells : this.state.cells.map(row => row.map(cell => (cell === 1 || cell === 2) ? cell : 0))
      });
  }
  clickIconCell(row, column, id){
    if(!this.isPlaying()){
      this.setState({cells: this.updateIndices([[row, column]], [0], this.state.cells)});
      this.isDragging = id;
    }
  }
  CellFactory(id, row, column){
    switch(id){
      case 0 : return <NormalCell 
                        key = {[row, column]} 
                        color='white' 
                        onMouseMove = {() => this.frames === null && this.isMouseDown && this.setState({cells: this.updateIndices([[row, column]], [3], this.state.cells)})}
                        onClick = {() =>this.frames === null && this.clickNormalCell(row, column)}
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
                        onClick = {() => this.frames === null && this.setState({cells: this.updateIndices([[row, column]], [0], this.state.cells)})}
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
    </React.Fragment>
    )
  }
};