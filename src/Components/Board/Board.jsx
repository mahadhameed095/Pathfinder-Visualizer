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
    this.maze_gen = null;
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
    // if(this.__isInteractable() && this.__canPlay())
    // {
    //   this.done = false;
    //   this.frames = this.algorithms[this.algorithmChoice][0]();
    //   this.setState({
    //     cells : this.state.cells.map(row => row.map( cell => cell === CONSTANTS.VISITED || 
    //                                                          cell === CONSTANTS.PATH ? CONSTANTS.NORMAL : cell))
    //   })
    // }
    // this.animator.start();
    function* recursive_division(m, n){
      const HORIZONTAL = 0;
      const VERTICAL = 1;
      const get_even_rand = (min, max) => {
        let random;
        do{
          random = getRandomInt(min, max);
        }while(random % 2 === 1);
        return random;
      }
      const get_odd_rand = (min, max) => {
        let random;
        do{
          random = getRandomInt(min, max);
        }while(random % 2 === 0);
        return random;
      }

      const get_orientation = (rows, columns) => {
        if(rows > columns) return HORIZONTAL;
        else if(rows < columns) return VERTICAL;
        else return getRandomInt(0, 2) % 2 === 0 ? VERTICAL : HORIZONTAL;
      }
      const maze = Array.from({ length: m }, () => Array.from({ length: n }, () => 1));
      const stack = [];
      stack.push({ x : 0, y : 0, rows : maze.length, columns : maze[0].length });

      while(stack.length !== 0){
        const {x, y, rows, columns} = stack.pop();
        if(rows > 1 && columns > 1){
          const orientation = get_orientation(rows, columns);
          if(orientation === HORIZONTAL){
            const new_wall = get_even_rand(x, x + rows);
            const new_hole = get_odd_rand(y, y + columns);
            for (let i = y; i < y + columns; i++) {
              maze[new_wall][i] = 0;
            }
            maze[new_wall][new_hole] = 1;
            stack.push({ x : new_wall + 1, y : y, rows : x + rows - new_wall - 1, columns : columns });
            stack.push({ x : x,            y : y, rows : new_wall - x,        columns : columns });
            yield maze;
          }
          else{
            const new_wall = get_even_rand(y, y + columns);
            const new_hole = get_odd_rand(x, x + rows);
            for (let i = x; i < x + rows; i++) {
              maze[i][new_wall] = 0;
            }
            maze[new_hole][new_wall] = 1;
            stack.push({ x : x, y : new_wall + 1, rows : rows, columns : y + columns - new_wall - 1 });
            stack.push({ x : x, y : y,            rows : rows, columns : new_wall - y });
            yield maze;
         }
        }
      }
      return maze;
    }
    const [m, n] = [this.state.cells.length, this.state.cells[0].length];
    if(this.maze_gen === null)
      this.maze_gen = recursive_division(m, n);
    this.setState({cells: this.maze_gen.next().value});
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
    const args ={ 
                  key : [row, column],
                  onMouseMove : (id === CONSTANTS.SOURCE || id === CONSTANTS.TARGET) 
                                 ? () =>this.isMouseDown && (this.isDragging = id) /* For source and target cells */
                                 :() => this.__cellDragged(row, column, id), /* For all other cells */
                  onClick : () => this.__cellClicked(row, column, id)
                };
    switch(id){
      case CONSTANTS.NORMAL : return <NormalCell {...args}/>; /*Normal Cell*/
      case CONSTANTS.SOURCE : return <IconCell key= {args["key"]} onMouseMove = {args["onMouseMove"]} image = {Source}/> /* Source node */
      case CONSTANTS.TARGET : return <IconCell key= {args["key"]} onMouseMove = {args["onMouseMove"]} image = {Target}/> /* Target node */
      case CONSTANTS.WALL : return <Wall {...args}/>; /* Wall */
      case CONSTANTS.PATH : return <Path {...args} shouldAnimate = {!this.done}/>; /* Path */
      case CONSTANTS.VISITED : return <VisitedCell {...args} shouldAnimate = {!this.done}/>; /* Visisted cell */
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