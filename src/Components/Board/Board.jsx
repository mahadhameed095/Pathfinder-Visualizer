import React from "react";
import Source from '../../Assets/Source.svg';
import Target from '../../Assets/Target.svg';
import Animator from "../../Utility/Animator";
import { getRandomInt } from "../../Utility/Random";
import { djikstraGen, djikstra} from "../../Algorithms/Djikstra";
import { astarGen, astar} from "../../Algorithms/Astar";
import * as CONSTANTS from "../../Utility/constants";
import { Grid, IconCell, VisitedCell, NormalCell, Wall, Path } from './Styles'

export default class Board extends React.Component{
  constructor(){
    super();
    this.source = null; /* Coordinates of source node */
    this.target = null; /* Coordinates of target node */
    this.state = {cells : this.__makeBoard(15, 29)}; /* Represents the state of the grid(mxn array) */
    this.grid = React.createRef(); /* The reference to the physical html div that represents the grid. It is used to fetch its dimensions */
    this.frames = null; /* Holds the current generator object */
    this.done = false; /* A boolean that is set when the animation is done. and clears while animating */
    this.isMouseDown = false; 
    this.isDragging = null;
    this.algorithmChoice = "djikstra";
    this.algorithms = {
      "djikstra" : [() => djikstraGen(this.state.cells, this.source, this.target),() => djikstra(this.state.cells, this.source, this.target)],
      "astar" : [ () => astarGen(this.state.cells, this.source, this.target), () => astar(this.state.cells, this.source, this.target)]
    }
    this.animator = new Animator(60, this.__animate);
  }
  isPlaying(){
    return this.animator.playing;
  }
  setAlgorithm(algorithm){
    this.algorithmChoice = algorithm;
  }
  start(){
    if(this.__isInteractable() && this.__canPlay())
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
    this.done = false;
    this.frames = null;
    this.animator.stop();
    this.setState({
      cells : this.state.cells.map(row => row.map(cell => (cell === CONSTANTS.SOURCE || cell === CONSTANTS.TARGET) ? cell : CONSTANTS.NORMAL))
    });
  }
  componentDidMount(){
    this.__resizeGrid();
    window.addEventListener('resize', this.__resizeGrid);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this.__resizeGrid);
  }
  __animate = (animatorRef) => { /* Used Arrow function as this is going to be called in the animator class. Arrow functions bind 'this' to the context where the function is declared */
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
      board = this.__updateIndices([...nextFrame.value.value], [CONSTANTS.PATH], this.state.cells);
    }
    this.setState({cells:board});
    this.forceUpdate();
  }
  __resizeGrid = () => {
      this.clear();
      const containerWidth = this.grid.current.offsetWidth;
      const containerHeight = this.grid.current.offsetHeight;
      const cols = Math.floor((containerWidth * 29)/1200);
      const rows = Math.floor(containerHeight / (containerWidth / cols - 1));
      this.setState({cells:this.__makeBoard(rows, cols)});
      this.forceUpdate();
  }
  __canPlay(){
    return this.isDragging === null;
  }
  __isInteractable(){
    return this.frames === null;
  }
  __makeBoard(rows, columns){
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
  __updateIndices(indices, values, array){
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
  __redoWithoutAnimation(board){
    const results = this.algorithms[this.algorithmChoice][1]();
    if(results !== null){
      board.forEach((row, i) => row.map((item, j) => (item === CONSTANTS.PATH || item === CONSTANTS.VISITED) && (board[i][j] = CONSTANTS.NORMAL))); /* Clear board of previously visited cells and paths */
      board.forEach((row, i) => row.map((item, j) => results.nodes[[i, j]].visited && board[i][j] === CONSTANTS.NORMAL &&  (board[i][j] = CONSTANTS.VISITED)));
      results.path.forEach(index => board[index[0]][index[1]] = CONSTANTS.PATH);
      return board;
    } else{
        /* No path */
      return board;
    }
  }

  __cellDragged(row, column, val){
    if(this.__isInteractable() && this.isMouseDown){
      let board = null;
      
      if(this.isDragging !== null){
        const endRef = this.isDragging === CONSTANTS.SOURCE ? this.source : this.target;
        board = [...this.state.cells];
        board[endRef[0]][endRef[1]] = CONSTANTS.NORMAL;
        endRef[0] = row ; endRef[1] = column;
        board[endRef[0]][endRef[1]] = this.isDragging;
      }
      
      else{
        board = this.__updateIndices([[row, column]], [val === CONSTANTS.WALL ? CONSTANTS.NORMAL : CONSTANTS.WALL], this.state.cells);
      }
      if(this.done) board = this.__redoWithoutAnimation(board);
      this.setState({ cells : board });
    }
  }
  __cellClicked(row, column, val){
    if(this.__isInteractable()){
      let board = this.__updateIndices([[row, column]], [val === CONSTANTS.WALL ? CONSTANTS.NORMAL : CONSTANTS.WALL], this.state.cells);
      if(this.done) board = this.__redoWithoutAnimation(board);
      this.setState({ cells : board });
    }
  }
  __cellFactory(id, row, column){
    switch(id){
      case CONSTANTS.NORMAL : return <NormalCell 
                                        key = {[row, column]} 
                                        onMouseMove = {() => this.__cellDragged(row, column, CONSTANTS.NORMAL)}
                                        onClick = {() => this.__cellClicked(row, column, CONSTANTS.NORMAL)}
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
                                        onMouseMove = {() => this.__cellDragged(row, column, CONSTANTS.WALL)}
                                        onClick = {() => this.__cellClicked(row, column, CONSTANTS.WALL)}
                                      />; /* Wall */
      case CONSTANTS.PATH : return <Path 
                                        key = {[row, column]}
                                        onMouseMove = {() => this.__cellDragged(row, column, CONSTANTS.PATH)}
                                        onClick = {() => this.__cellClicked(row, column, CONSTANTS.PATH)}                                        
                                        shouldAnimate = {!this.done}
                                      />; /* Path */
 
      case CONSTANTS.VISITED : return <VisitedCell 
                                        key = {[row, column]}
                                        onMouseMove = {() => this.__cellDragged(row, column, CONSTANTS.VISITED)}
                                        onClick = {() => this.__cellClicked(row, column, CONSTANTS.VISITED)}
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
            this.state.cells && this.state.cells.map((item, row) => item.map((subItem, column) => this.__cellFactory(subItem, row, column)))
          }
        </Grid>
    </React.Fragment>
    )
  }
};