import * as CONSTANTS from '../constants'
const Neighbours = (key, num_rows, num_cols) => {
  const [i, j] = key;
  if((i < 0 || i >= num_rows ) || (j < 0 || j >= num_cols ))
  {
    console.log("Out of Bounds access : ", i, j);
    return [];
  } 
  const neighbours = [];
  if(i - 1 >= 0){
    neighbours.push([i - 1, j])
  }
  if(j + 1 < num_cols){
    neighbours.push([i, j + 1])
  }
  if(i + 1 < num_rows){
    neighbours.push([i + 1, j])
  }
  if(j - 1 >= 0){
    neighbours.push([i, j - 1])
  }
  // if((i - 1 >= 0) && (j - 1 >= 0)){
  //   neighbours.push([i - 1, j - 1])
  // }
  // if((i - 1 >= 0) && (j + 1 < num_cols)){
  //   neighbours.push([i - 1, j + 1])
  // }
  // if((i + 1 < num_rows) && (j + 1 < num_cols)){
  //   neighbours.push([i + 1, j + 1])
  // }
  // if((i + 1 < num_rows) && (j - 1 >= 0)){
  //   neighbours.push([i + 1, j - 1])
  // }
  return neighbours;
}

export default function* djikstra(board, source, target){
  const nodes = {};
  const previous = {};
  const path = [];
  const [m, n] = [board.length, board[0].length];
  // console.log("D=>",[board.length, board[0].length]);
  for (let i = 0; i < m; i++) {
    for (let j = 0 ; j < n ; j++){
      nodes[[i, j]] = {visited: false, distance :Infinity};
      previous[[i, j]] = null;
    }
  }
  nodes[source] = {visited : true, distance : 0};
  const queue = [source];
  while(queue.length > 0){
    const U = queue.shift();
    if(U[0] === target[0] && U[1] === target[1]) break;
    const neighbours = Neighbours(U, m, n);
    neighbours.map( V => {
      if(board[V[0]][V[1]] === CONSTANTS.WALL){  /* 3 means its a wall */
        return V;
      }
      if(nodes[V].visited)
      {
        return V;
      } 
      queue.push(V);
      nodes[V].visited = true;
      const tempDistance = nodes[U].distance + 1;
      if(tempDistance < nodes[V].distance){
        nodes[V].distance = tempDistance;
        previous[V] = U;
      }
      return V;
    });
    yield {type : "visited", value : nodes};
  }
  let index = target;
  while(true){
    index = previous[index];
    if(index === null) return { type : "path", value : null};
    if (index === source) break;
    path.push(index);
    yield { type : "path", value : index};
  }
  return { type : "path", value : path }
}