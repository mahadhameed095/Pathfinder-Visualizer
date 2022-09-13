import React from "react";
import Source from '../../Assets/Source.svg';
import Target from '../../Assets/Target.svg';
import Animator from "../../Utility/Animator";
import { djikstraGen, djikstra} from "../../Algorithms/Djikstra";
import { astarGen, astar} from "../../Algorithms/Astar";
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
    this.done = false;
    this.isMouseDown = false;
    this.isDragging = null;
    this.algorithmChoice = "djikstra";
    this.algorithms = {
      "djikstra" : [() => djikstraGen(this.state.cells, this.source, this.target),() => djikstra(this.state.cells, this.source, this.target)],
      "astar" : [ () => astarGen(this.state.cells, this.source, this.target), () => astar(this.state.cells, this.source, this.target)]
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
        this.frames = null;
        this.done = true;
        if(nextFrame.value === null) alert("No pathh!!!");
        return;
      } 
      
      if(nextFrame.value.type === "visited"){
        board = this.state.cells.map((row, i) => row.map((item, j) => nextFrame.value.value[[i, j]].visited && item === CONSTANTS.NORMAL ? CONSTANTS.VISITED : item))
      }
      else if(nextFrame.value.type === "path"){
        board = this.updateIndices([...nextFrame.value.value], [CONSTANTS.PATH], this.state.cells);
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
    return this.isDragging === null;
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
  start(){
    if(this.frames === null && this.canPlay())
    {
      this.done = false;
      this.frames = this.algorithms[this.algorithmChoice][0]();
      this.setState({
        cells : this.state.cells.map(row => row.map( cell => cell === CONSTANTS.VISITED || 
                                                             cell === CONSTANTS.PATH ? CONSTANTS.NORMAL : cell))
      })
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
  redoWithoutAnimation(board){
    const results = this.algorithms[this.algorithmChoice][1]();
    if(results !== null){
      board.forEach((row, i) => row.map((item, j) => (item === CONSTANTS.PATH || item === CONSTANTS.VISITED) && (board[i][j] = CONSTANTS.NORMAL))); /* Clear board of previously visited cells and paths */
      board.forEach((row, i) => row.map((item, j) => results.nodes[[i, j]].visited && board[i][j] === CONSTANTS.NORMAL &&  (board[i][j] = CONSTANTS.VISITED)));
      results.path.forEach(index => board[index[0]][index[1]] = CONSTANTS.PATH);
      return board;
    } else{
      // alert("No path!");
      return board;
    }
  }

  normalAndWallDrag(row, column, val){
    if(this.isInteractable() && this.isMouseDown){
      let board = null;
      
      if(this.isDragging !== null){
        const endRef = this.isDragging === CONSTANTS.SOURCE ? this.source : this.target;
        board = [...this.state.cells];
        board[endRef[0]][endRef[1]] = CONSTANTS.NORMAL;
        endRef[0] = row ; endRef[1] = column;
        board[endRef[0]][endRef[1]] = this.isDragging;
      }
      
      else{
        board = this.updateIndices([[row, column]], [val === CONSTANTS.WALL ? CONSTANTS.NORMAL : CONSTANTS.WALL], this.state.cells);
      }
      if(this.done) board = this.redoWithoutAnimation(board);
      this.setState({ cells : board });
    }
  }
  normalAndWallClick(row, column, val){
    if(this.isInteractable()){
      let board = this.updateIndices([[row, column]], [val === CONSTANTS.WALL ? CONSTANTS.NORMAL : CONSTANTS.WALL], this.state.cells);
      if(this.done) board = this.redoWithoutAnimation(board);
      this.setState({ cells : board });
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
                                        />
 
      case CONSTANTS.TARGET : return <IconCell 
                                        key = {[row, column]} 
                                        image = {Target} 
                                        draggable={false}
                                        onMouseMove = {() => this.isMouseDown && (this.isDragging = CONSTANTS.TARGET)}
                                        />

      case CONSTANTS.WALL : return <Wall  
                                        key = {[row, column]} 
                                        onMouseMove = {() => this.normalAndWallDrag(row, column, CONSTANTS.WALL)}
                                        onClick = {() => this.normalAndWallClick(row, column, CONSTANTS.WALL)}
                                      />; /* Wall */
      case CONSTANTS.PATH : return <Path 
                                        key = {[row, column]}
                                        onMouseMove = {() => this.normalAndWallDrag(row, column, CONSTANTS.PATH)}
                                        onClick = {() => this.normalAndWallClick(row, column, CONSTANTS.PATH)}                                        
                                        shouldAnimate = {!this.done}
                                      />; /* Path */
 
      case CONSTANTS.VISITED : return <VisitedCell 
                                        key = {[row, column]}
                                        onMouseMove = {() => this.normalAndWallDrag(row, column, CONSTANTS.VISITED)}
                                        onClick = {() => this.normalAndWallClick(row, column, CONSTANTS.VISITED)}
                                        shouldAnimate = {!this.done}
                                      />; /* Visisted cell */
 
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