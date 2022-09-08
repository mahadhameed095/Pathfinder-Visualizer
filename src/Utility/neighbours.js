export const neighbours = (key, num_rows, num_cols) => {
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