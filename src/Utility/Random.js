function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
function getRandomEvenInt(min, max){
  let num;
  do{
    num = getRandomInt(min, max);
  }while(num % 2 === 1);
  return num;
}
function getRandomOddInt(min, max){
  let num;
  do{
    num = getRandomInt(min, max);
  }while(num % 2 === 0);
  return num;
}
export {getRandomInt, getRandomEvenInt, getRandomOddInt};