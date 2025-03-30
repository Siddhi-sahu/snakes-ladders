//ladder positions (start and end) and snake positions(start and end)
// interface SnakesLadderProps {
//     num
// }
const LADDERS: Record<number, number> = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    51: 67,
    71: 91,
    80: 100

}
const SNAKES: Record<number, number> = {
    16: 6,
    49: 11,
    62: 19,
    65: 53,
    87: 24,
    95: 75,
    98: 78
}


export const Board = (position: number) => {

    console.log(LADDERS[position]);
    console.log(SNAKES[position])
}