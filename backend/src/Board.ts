//ladder positions (start and end) and snake positions(start and end)
// interface SnakesLadderProps {
//     num
// }
const LADDERS: Record<number, number> = {
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    51: 67,
    71: 91,
    80: 99

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

//class or function
export const Board = (position: number) => {

    //we need to update the values and send it to the main thing
    //return new position else the postion remains the same
    if (LADDERS[position] || SNAKES[position]) {
        if (LADDERS[position]) {
            console.log("you are at", position);


            console.log("ladderhere ; goes to ", LADDERS[position]);
            return LADDERS[position];

        } else {
            console.log("you are at", position)

            console.log("snake here ; goes to ", SNAKES[position]);
            return SNAKES[position];


        }

    } else {
        return position;
    }

}