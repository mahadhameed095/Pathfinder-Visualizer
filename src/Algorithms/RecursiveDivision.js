import { getRandomInt, getRandomEvenInt, getRandomOddInt } from "../Utility/Random";

function* recursive_division(m, n){
  const HORIZONTAL = 0;
  const VERTICAL = 1;
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
        const new_wall = getRandomEvenInt(x, x + rows);
        const new_hole = getRandomOddInt(y, y + columns);
        for (let i = y; i < y + columns; i++) {
          if(i !== new_hole){
            maze[new_wall][i] = 0;
          }
        }
        yield maze;
        stack.push({ x : new_wall + 1, y : y, rows : x + rows - new_wall - 1, columns : columns });
        stack.push({ x : x,            y : y, rows : new_wall - x,        columns : columns });
      }
      else{
        const new_wall = getRandomEvenInt(y, y + columns);
        const new_hole = getRandomOddInt(x, x + rows);
        for (let i = x; i < x + rows; i++) {
          if(i !== new_hole){
            maze[i][new_wall] = 0;
          }
        }
        yield maze;
        stack.push({ x : x, y : new_wall + 1, rows : rows, columns : y + columns - new_wall - 1 });
        stack.push({ x : x, y : y,            rows : rows, columns : new_wall - y });
      }
    }
  }
  return maze;
}

export {recursive_division};