import styled, { keyframes } from "styled-components";
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
const visited_creation = keyframes`
  from {
    transform : scale(0.1);
    border-radius : 50%;
    background-color : #666bcb;
  }

  to {
    transform : scale(1.0);
    border-radius : 0%;
    background-color : #4ae7aa;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${ props => props.n }, 1fr);
  flex-grow : 1;
  // grid-gap : 1px;
  background-color : #e7e7e7;
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
  background-color : #666bcb;
  user-select:none;
`;
const VisitedCell = styled(GridCell)`
  animation: ${visited_creation} 2s forwards;
  background-color : hsl(200, 70%, 60%);
`;
const NormalCell = styled(GridCell)`
  background-color: white;
`;

const Wall = styled(GridCell)`
  animation: ${creation} 0.5s forwards;
  background-color : gray;
`;
const Path = styled(GridCell)`
  animation: ${creation} 0.5s forwards;
  background-color : #f15757;
`;


export { Grid, IconCell, VisitedCell, NormalCell, Wall, Path };