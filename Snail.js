// Snail Sort
// Given an n x n array, return the array elements arranged from outermost elements to the middle element, traveling clockwise.

const array = [[1,2,3],
         [4,5,6],
         [7,8,9]]
// snail(array) #=> [1,2,3,6,9,8,7,4,5]
// For better understanding, please follow the numbers of the next array consecutively:

// array = [[1,2,3],
//          [8,9,4],
//          [7,6,5]]
// snail(array) #=> [1,2,3,4,5,6,7,8,9]
function circleJob(arr) {
    if (arr.length === 1 && arr[0].length===0) return []
    var result_first_row = arr[0].slice(0,-1)
    var result_right_column = arr.reduce((acc,el)=>{
        acc.push(el.at(-1))
        return acc
    },[])
    var result_last_row = arr.at(-1).slice(1,-1).toReversed()
    var result_left_column = arr.reduce((acc,el,i)=>{
        if(i!==0)acc.push(el.at(0))
        return acc
    },[]).toReversed()
    const new_arr = arr.slice(1,-1).map(e=>e.slice(1,-1))
        const recursion = new_arr.length>0?circleJob(new_arr):[]
        return [...result_first_row, ...result_right_column, ...result_last_row, ...result_left_column, ...recursion]
}
snail = function(array) {
    return circleJob(array).flat()
  }
console.log('\n             TEST \n ____________________________\n\n', snail(array))