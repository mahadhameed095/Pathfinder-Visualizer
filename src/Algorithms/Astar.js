import { neighbours } from "../Utility/neighbours";
import PriorityQueue from "../Utility/PriorityQueue";
import { euclideanDistance } from "../Utility/distance";


/* euclideanDistance is being used as the heuristic value */
export default function* astar(board, source, target){
    const queue = new PriorityQueue((a, b) => a[2] < b[2]);
    const [m, n] = [board.length, board[0].length];
    const nodes = {};
    for (let i = 0; i < m; i++) {
        for (let j = 0 ; j < n ; j++){
            nodes[[i, j]] = { visited : false };
        }
    }
    let resultant = [];
    queue.push([source, [source], 0]);
    while(!queue.isEmpty())
    {
        const [U, path, _ ] = queue.pop();
        if(U[0] === target[0] && U[1] === target[1])
        {
            resultant = [...path];
            break;
        } 
        const neigboursList = neighbours(U, m, n);
        neigboursList.map( V => {
            if(board[V[0]][V[1]] === 0 || nodes[V].visited) return V;
            else{
                queue.push([V, [...path, V], path.length + euclideanDistance(V, U)]);
                nodes[V].visited = true;
                return V;
            }
        });
        yield {type : "visited", value : nodes};
    }
    if(resultant.length == 0) return null;
    for(let i = resultant.length - 2 ; i > 0 ; i--){
        yield {type : "path", value : resultant[i]}
    }
}