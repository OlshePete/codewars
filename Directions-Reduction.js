// Once upon a time, on a way through the old wild mountainous west,…
// … a man was given directions to go from one point to another. 
// The directions were "NORTH", "SOUTH", "WEST", "EAST". Clearly "NORTH" and "SOUTH" are opposite, "WEST" and "EAST" too.

// Going to one direction and coming back the opposite direction right away is a needless effort. 
// Since this is the wild west, with dreadful weather and not much water, 
// it's important to save yourself some energy, otherwise you might die of thirst!

const data = {
    NORTH: 1,
    SOUTH: 1,
    EAST: 2,
    WEST: 2,
};
const case1 = ["NORTH", "SOUTH", "SOUTH", "EAST", "WEST", "NORTH", "WEST"];
const case2 = ["EAST","EAST","WEST","NORTH","WEST","EAST","EAST","SOUTH","NORTH","WEST"]

function dirReduc(arr=[]) {
    console.log('^',arr);
    const twinkIndex = arr.findIndex((e,i,a)=>(data[e]===data[a[i+1]] && (e!==a[i+1])))
    if (twinkIndex!==-1) {
        arr.splice(twinkIndex, 2)
        return dirReduc(arr)
    } 
    return arr
}
console.log("case1", dirReduc(case1));
console.log("case2", dirReduc(case2));
