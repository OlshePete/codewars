// If we were to set up a Tic-Tac-Toe game, we would want to know whether the board's current state is solved, 
// wouldn't we? Our goal is to create a function that will check that for us!

// Assume that the board comes in the form of a 3x3 array, where the value is 0 if a spot is empty, 
// 1 if it is an "X", or 2 if it is an "O", like so:

// [[0, 0, 1],
//  [0, 1, 2],
//  [2, 1, 0]]
// We want our function to return:

// -1 if the board is not yet finished AND no one has won yet (there are empty spots),
// 1 if "X" won,
// 2 if "O" won,
// 0 if it's a cat's game (i.e. a draw).
// You may assume that the board passed in is valid in the context of a game of Tic-Tac-Toe.

const arr1 = [
    [2,1,2], 
    [2,1,1], 
    [1,2,1]
]
const arr2 = [[1,1,1],[0,2,2],[0,0,0]]
const arr3 = [[2,1,2],[2,1,1],[1,2,1]]
const arr4 = [[2,2,2],[0,1,1],[1,0,0]]
const arr5 = [[1,1,1],[0,2,2],[0,0,0]]
const arr6 = [[1,1,1],[0,2,2],[0,0,0]]

const result = {
    '-1':'Игра не закончена',
    '0': 'Ничья',
    '1': 'Победили креcтики (1)',
    '2': 'Победили нолики (2)',
}


const compare = (a,b,c) => (new Set ([a,b,c]).size === 1 && a!=0)
function isSolved(board) {
    let result = -1
    let hasEmptySlot = false
    board.forEach((line, lineIndex) => {
        const otherLines = board.filter((l,i)=>i!==lineIndex)
        if(compare(...line)){ 
            result = line[0];
        } else {
            if (line.includes(0)) hasEmptySlot = true
        }
        if (result <= 0) {
            line.forEach((dot, dotIndex)=> {
                if (dot!==0) {
                    if ((dotIndex === 0 || dotIndex === 2 ) && otherLines.every((oLine)=>oLine[dotIndex] === dot)) {
                        result = dot
                    } 
                }
            })
        }
    });

    if (
        board[1][1]>0 && (
        compare(board[0][0] , board[1][1] , board[2][2]) || 
        compare(board[0][2] , board[1][1] , board[2][0]))
        ) result = board[1][1]
    return result>0 ? result : hasEmptySlot ? -1 : 0
}


console.log(`\x1b[36m isSolved(arr1) Ничья \x1b[0m`,`: `,result[String(isSolved(arr1))])
console.log(`\x1b[36m isSolved(arr2) Победили креcтики (1) \x1b[0m`,`: `,result[String(isSolved(arr2))])
console.log(`\x1b[36m isSolved(arr3) Ничья \x1b[0m`,`: `,result[String(isSolved(arr3))])
console.log(`\x1b[36m isSolved(arr4) Победили нолики (2) \x1b[0m`,`: `,result[String(isSolved(arr4))])
console.log(`\x1b[36m isSolved(arr5) Победили креcтики (1) \x1b[0m`,`: `,result[String(isSolved(arr5))])
console.log(`\x1b[36m isSolved(arr6) Победили креcтики (1) \x1b[0m`,`: `,result[String(isSolved(arr6))])