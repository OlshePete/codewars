function countInit (initaval = 0) {
    let counter = initaval
    return ()=>counter++
}
const counter = countInit()
const counter2 = countInit(2)
console.log(1,counter());
console.log(2,counter2());
console.log(1,counter());
console.log(2,counter2());
console.log(2,counter2());
console.log(2,counter2());