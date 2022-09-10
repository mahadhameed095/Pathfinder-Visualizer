import React from "react";
import Source from '../../Assets/Source.svg';
import Target from '../../Assets/Target.svg';
import Animator from "../../Utility/Animator";
import djikstra from "../../Algorithms/Djikstra";
import astar from "../../Algorithms/Astar";
import * as CONSTANTS from "../../Utility/constants";
import recurDiv  from "../../Algorithms/RecursiveDivision";
import { Grid, IconCell, VisitedCell, NormalCell, Wall, Path } from './Styles'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default class Board extends React.Component{
  constructor(){
    super();
    this.source = null;
    this.target = null;
    this.state = {cells : this.makeBoard(15, 29)};
    this.grid = React.createRef();
    this.frames = null;
    this.isMouseDown = false;
    this.isDragging = null;
    this.isClicked = null;
    this.algorithmChoice = "djikstra";
    this.algorithms = {
      "djikstra" : () => djikstra(this.state.cells, this.source, this.target),
      "astar" : () => astar(this.state.cells, this.source, this.target)
    }
    
    this.resizeGrid = () => {
      this.clear();
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
        animatorRef.stop();
        if(nextFrame.value === null) alert("No pathh!!!");
        return;
      } 
      
      if(nextFrame.value.type === "visited"){
        board = this.state.cells.map((row, i) => row.map((item, j) => nextFrame.value.value[[i, j]].visited && item === CONSTANTS.NORMAL ? CONSTANTS.VISITED : item))
      }
      else if(nextFrame.value.type === "path"){
        board = this.updateIndices([nextFrame.value.value], [CONSTANTS.PATH], this.state.cells);
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
  canPlay(){
    return this.isClicked === null;
  }
  isPlaying(){
    return this.animator.playing;
  }
  isInteractable(){
    return this.frames === null;
  }
  makeBoard(rows, columns){
    
    const board = Array.from({length: rows},()=> Array.from({length: columns}, () => CONSTANTS.NORMAL));
    this.source = [getRandomInt(0, rows), getRandomInt(0, columns / 2)]
    do{
      this.target = [getRandomInt(0, rows), getRandomInt(columns / 2 + 1, columns)]
    }
    while(this.target[0] === this.source[0] && this.target[1] === this.source[1]);
    board[this.source[0]][this.source[1]] = CONSTANTS.SOURCE;
    board[this.target[0]][this.target[1]] = CONSTANTS.TARGET;
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
  setAlgorithm(algorithm){
    this.algorithmChoice = algorithm;
  }
  getAlgorithm(){
    return this.algorithmChoice;
  }
  start(){
    // const board = recurDiv(this.state.cells.length, this.state.cells[0].length);
    // board[this.source[0]][this.source[1]] = CONSTANTS.SOURCE;
    // board[this.target[0]][this.target[1]] = CONSTANTS.TARGET;
    // this.setState({
    //   cells : board
    // })
    if(this.frames === null && this.canPlay())
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
      cells : this.state.cells.map(row => row.map(cell => (cell === CONSTANTS.SOURCE || cell === CONSTANTS.TARGET) ? cell : CONSTANTS.NORMAL))
      });
  }
  clickIconCell(row, column, id){
    if(!this.isPlaying()){
      this.setState({cells: this.updateIndices([[row, column]], [CONSTANTS.NORMAL], this.state.cells)});
      this.isClicked = id;
    }
  }
  normalAndWallDrag(row, column, val){
    if(this.isInteractable() && this.isMouseDown){
      if(this.isDragging !== null){
        const board = [...this.state.cells];
        const endRef = this.isDragging === CONSTANTS.SOURCE ? this.source : this.target;
        board[endRef[0]][endRef[1]] = CONSTANTS.NORMAL;
        endRef[0] = row ; endRef[1] = column;
        board[endRef[0]][endRef[1]] = this.isDragging;
        this.setState({ cells : board });
      }
      else{
        this.setState({ cells : this.updateIndices([[row, column]], [val === 0 ? 1 : 0], this.state.cells) });
      }
    }
  }
  normalAndWallClick(row, column, val){
    if(this.isInteractable()){
      if(this.isClicked !== null){
        const board = [...this.state.cells];
        const endRef = this.isClicked === CONSTANTS.SOURCE ? this.source : this.target;
        board[endRef[0]][endRef[1]] = CONSTANTS.NORMAL;
        endRef[0] = row ; endRef[1] = column;
        board[endRef[0]][endRef[1]] = this.isClicked;
        this.setState({ cells : board }, () => this.isClicked = null);
      }
      else{
        this.setState({ cells : this.updateIndices([[row, column]], [val === 0 ? 1 : 0], this.state.cells) });
      }
    }
  }
  CellFactory(id, row, column){
    switch(id){
      case CONSTANTS.NORMAL : return <NormalCell 
                                        key = {[row, column]} 
                                        onMouseMove = {() => this.normalAndWallDrag(row, column, CONSTANTS.NORMAL)}
                                        onClick = {() => this.normalAndWallClick(row, column, CONSTANTS.NORMAL)}
                                        />; /*Normal Cell*/

      case CONSTANTS.SOURCE : return <IconCell 
                                        key = {[row, column]} 
                                        image = {Source} 
                                        draggable={false}
                                        onMouseMove = {() => this.isMouseDown && (this.isDragging = CONSTANTS.SOURCE)}
                                        onClick = {() => this.clickIconCell(row, column, CONSTANTS.SOURCE)}
                                        />
 
      case CONSTANTS.TARGET : return <IconCell 
                                        key = {[row, column]} 
                                        image = {Target} 
                                        draggable={false}
                                        onMouseMove = {() => this.isMouseDown && (this.isDragging = CONSTANTS.TARGET)}
                                        onClick = {() => this.clickIconCell(row, column, CONSTANTS.TARGET)}
                                        />

      case CONSTANTS.WALL : return <Wall key = {[row, column]} 
                                        onMouseMove = {() => this.normalAndWallDrag(row, column, this.state.cells[row][column])}
                                        onClick = {() => this.normalAndWallClick(row, column, CONSTANTS.WALL)}
                                      />; /* Wall */
      case CONSTANTS.PATH : return <Path key = {[row, column]}/>; /* Path */
 
      case CONSTANTS.VISITED : return <VisitedCell key = {[row, column]}/>; /* Visisted cell */
 
      default : return null;
    }
  }
  render(){
    return(
    <React.Fragment>
        <Grid ref={this.grid} n={this.state.cells[0].length} 
              onMouseDown = {() => this.isMouseDown = true} 
              onMouseUp = {() => { this.isMouseDown = false; this.isDragging = null;}}
            >
          {
            this.state.cells && this.state.cells.map((item, row) => item.map((subItem, column) => this.CellFactory(subItem, row, column)))
          }
        </Grid>
    </React.Fragment>
    )
  }
};