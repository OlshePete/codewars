// Write a method that takes a field for well-known board game "Battleship" 
// as an argument and returns true if it has a valid disposition of ships, false otherwise. 
// Argument is guaranteed to be 10*10 two-dimension array. 
// Elements in the array are numbers, 0 if the cell is free and 1 if occupied by ship.
const test1 = [
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    [1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
const test2 = [
    [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
const template = [
    4,3,3,2,2,2,1,1,1,1
]
const summarize = (array) => {
    return array.reduce((s,e)=>s+(Array.isArray(e)?summarize(e):e),0)
}
const calcShipCount = (i,j,array ) => {
    console.log(i,j)
    let shipStart = array[i][j]
    let result = 0
    const horizontalDirection = array[i][j+1] === 1  
    if (horizontalDirection){
        let k = j
        while (array[i][k] === 1 ) {
            result+=1;
            k++
        }
        //проверить сверху
        //проверить снизу
    } else {
        let k = i
        while (array[k][j] === 1 ) {
            result+=1;
            k++
        }
    }
    return result
}
function validateBattlefield(field) {
    const validCount = summarize(template)
    const isValidCount = summarize(field) === validCount
    if (!isValidCount) return false
    let result = []
    for (let i = 0; i < 10; i++) {
        const element = field[i];
        // console.log('row', element)
        let pre_result = []
        for (let j = 0; j < 10; j++) {
            const el = element[j];
            // console.log('elems', el)
            if (el === 1 && (!(element[j-1]) || element[j-1] === 0)) {
                const count = calcShipCount(i,j,field)
                console.log("dot on line ",i," column ",j,": ",count)
                pre_result.push(count)
                // pre_result.push(calcShipCount(i,j,field))
            } else {
                // pre_result.push(null)
            }
        }
        result[i] = pre_result
    }
    // write your magic here
    return {
        validCount,
        isValidCount,
        result
    }
  }

console.log(test2.map(x=>JSON.stringify(x.map(e=>e===1?'X':'.')).replaceAll(/[\s\'\",]/g," ")))
console.log(validateBattlefield(test2))