const HORIZONTAL = 0;
const VERTICAL = 1;
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const getOrientation = (width, height) => {
    if(width < height) return HORIZONTAL;
    else if(height < width) return VERTICAL;
    else return getRandomInt(0, 5) % 2 === 0 ? HORIZONTAL : VERTICAL;
}

function recurDiv(m, n){
  const board = Array.from({length: m}, () => Array.from({length: n}, () => 1));
  divide(board, 0, 0, m, n, getOrientation(m, n));
  return board;
}

function divide(grid, x, y, width, height, dir){
  if (width < 2 || height < 2) return;
  console.log(x, y, width, height, dir === HORIZONTAL ? "horizontal" : "vertical");
  const horizontal = dir === HORIZONTAL;

  //  where will the wall be drawn from?
  let wx = x + (horizontal ? 0 : getRandomInt(0, width - 1))
  let wy = y + (horizontal ? getRandomInt(0, height - 1) : 0)

  //  where will the passage through the wall exist?
  const px = wx + (horizontal ? getRandomInt(0, width + 1) : 0)
  const py = wy + (horizontal ? 0 : getRandomInt(0, height + 1))

  //  what direction will the wall be drawn?
  const dx = horizontal ? 1 : 0
  const dy = horizontal ? 0 : 1

  //  how long will the wall be?
  const length = horizontal ? width : height

  //  what direction is perpendicular to the wall?

  for(let i = 0 ; i < length ; i++)
  {
    grid[wy][wx] = 0;
    wx += dx;
    wy += dy;
  }
  grid[px][py] = 1;

  let [nx, ny] = [x, y];
  let [w, h] = horizontal ? [width, wy-y+1] : [wx-x+1, height];
  divide(grid, nx, ny, w, h, getOrientation(w, h));

  [nx, ny] = horizontal ? [x, wy+1] : [wx+1, y];
  [w, h] = horizontal ? [width, y+height-wy-1] : [x+width-wx-1, height];
  divide(grid, nx, ny, w, h, getOrientation(w, h));
}

// function divide(grid, x, y, m, n){
//     if(m <= 2 || n <= 2) return;
//     const orientation = getOrientation(m, n);
//     console.log(x, y, m, n, orientation == HORIZONTAL ? "horizontal" : "vertical");
//     if (orientation === HORIZONTAL){
//       const bisect = Math.floor(m / 2);
//       for(let i = y ; i < n; i++){
//         grid[bisect][i] = 0;
//       }
//       grid[bisect][getRandomInt(0, n)] = 1;
//       divide(grid, x, y, bisect, n);
//       divide(grid, bisect, y, m, n);
//     }
//     else if(orientation === VERTICAL){
//       const bisect = Math.floor(n / 2);
//       for(let i = x ; i < m; i++){
//         grid[i][bisect] = 0;
//       }
//       grid[getRandomInt(0, m)][bisect] = 1;

//       divide(grid, x, y, m, bisect);
//       divide(grid, x, bisect, m, n);
//     }
//     else{
//       alert("Orientation invalid");
//     }
// }
export default recurDiv;
// divide(board, 0, 0, 5, 5);

