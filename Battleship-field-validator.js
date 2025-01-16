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
    [1,0,0,0,0,1,1,0,0,0],
    [1,0,1,0,0,0,0,0,1,0],
    [1,0,1,0,1,1,1,0,1,0],
    [1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0],
    [0,0,0,0,1,1,1,0,0,0],
    [0,0,0,1,0,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

const template = [
    4,3,3,2,2,2,1,1,1,1
]
const summarize = (array) => {
    return array.reduce((s,e)=>s+(Array.isArray(e)?summarize(e):e),0)
}
const calcShipCount = (i, j, array) => {
    const shipStart = array[i][j];
    let result = 0;
    let k = j;
    let isHorizontal = false;
    if (j > 0 && array[i][j - 1] === 1) {
      k = j - 1;
      isHorizontal = true;
    } else if (j < 9 && array[i][j + 1] === 1) {
      k = j;
      isHorizontal = true;
    } else if (i > 0 && array[i - 1][j] === 1) {
      k = i - 1;
    } else if (i < 9 && array[i + 1][j] === 1) {
      k = i;
    }
  
    if (isHorizontal) {
      while (k >= 0 && array[i][k] === 1) {
        result += 1;
        k--;
      }
      k = j + 1;
      while (k < 10 && array[i][k] === 1) {
        result += 1;
        k++;
      }
    } else {
      while (k >= 0 && array[k][j] === 1) {
        result += 1;
        k--;
      }
      k = i + 1;
      while (k < 10 && array[k][j] === 1) {
        result += 1;
        k++;
      }
    }
    return result;
  };
  function validateBattlefield(field) {
    const validCount = template.reduce((a, b) => a + b, 0);
    const shipCount = field.reduce((a, row) => a + row.filter((cell) => cell === 1).length, 0);
    if (shipCount !== validCount) return false;
  
    // Check if ships are in contact
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (field[i][j] === 1) {
          if (i > 0 && field[i - 1][j] === 1 && Math.abs(i - 1 - i) + Math.abs(j - j) === 1) return false;
          if (j > 0 && field[i][j - 1] === 1 && Math.abs(i - i) + Math.abs(j - 1 - j) === 1) return false;
          if (i < 9 && field[i + 1][j] === 1 && Math.abs(i + 1 - i) + Math.abs(j - j) === 1) return false;
          if (j < 9 && field[i][j + 1] === 1 && Math.abs(i - i) + Math.abs(j + 1 - j) === 1) return false;
        }
      }
    }
  
    // Check if some ships have incorrect shapes (non-straight)
    const shipLengths = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (field[i][j] === 1) {
          const count = calcShipCount(i, j, field);
          shipLengths.push(count);
        }
      }
    }
    const shipLengthCounts = {};
    shipLengths.forEach((length) => {
      shipLengthCounts[length] = (shipLengthCounts[length] || 0) + 1;
    });
    for (let i = 0; i < template.length; i++) {
      if (shipLengthCounts[template[i]] !== 1) return false;
    }
  
    return true;
  }


console.log(test2.map(x=>JSON.stringify(x.map(e=>e===1?'X':'.')).replaceAll(/[\s\'\",]/g," ")))
console.log(validateBattlefield(test1))