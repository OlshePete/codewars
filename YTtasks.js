// Написать функцию add, которая принимает число
// и может вызываться бесконечное число раз, 
// пока не будет вызвана без аргументов - тогда возвращается сумма переданных
// ранее чисел

//  console.log(add(9)(10)())//19
//  console.log(add(9)())//9
//  console.log(add())//0

// const  add = (x) => {
//     let sum = x || 0

//     function inner  (y)  {
//         if (!y) {
//             return sum
//         } else {
//             sum+=y
//             return inner
//         }
//     }
//     return x?inner:0
// }
// console.log(add(9)(10)())//19
// console.log(add(9)())//9
// console.log(add())//0

// function isPalindrom(str) {
//     return str === [...str].reverse().join('')
// }
// console.log('isPalindrom',isPalindrom('ast'))
// console.log('isPalindrom',isPalindrom('asa'))

// const redCar = {
//     wheels:4,
//     brake:4,
//     speed:180,
//     options:[
//         {optionKey:'123-234-345', optionName:'color'},
//         {optionKey:'234-345-987', optionName:'warranty'}
//     ]
// }
// const redCar1 = {
//     wheels:4,
//     brake:4,
//     speed:180,
//     options:[
//         {optionKey:'123-234-345', optionName:'color'},
//         {optionKey:'234-345-987', optionName:'warranty'}
//     ]
// }
// const yellowCar = {
//     wheels:3,
//     brake:2,
//     speed:70,
//     options:[
//         {optionKey:'656-234-345', optionName:'isBroken'},
//         {optionKey:'234-345-987', optionName:'warranty'}
//     ]
// }
// const blueCar = {
//     wheels:4,
//     brake:4,
//     speed:180,
//     options:[
//         {optionKey:'123-234-345', optionName:'isBroken'},
//         {optionKey:'234-345-987', optionName:'warranty'}
//     ]
// }

// const isEqual = (o1, o2) => {
//     const keys1 = Object.keys(o1)
//     return keys1.every((key) => {
//         const element1 = o1[key]
//         const element2 = o2[key]
//         if (typeof element1 !== 'object') {
//             if (!element2 || ((typeof element1 !== typeof element2)) || element1!==element2) return false
//             return true
//         } else {
//             if (typeof element1 !== typeof element2) return false
//             return isEqual(element1,element2)
//         }
//     });
// }
// console.log('redCar1 ',isEqual(redCar,redCar1))
// console.log('yellowCar ',isEqual(redCar,yellowCar))
// console.log('blueCar ',isEqual(redCar,blueCar))

// Отсортировать нечетные числа так, чтобы четные числа остались на своих местах:

// const input = [5,4,1,6,3,8]
// const output = [1,4,3,6,5,8]
// const isOdd = (num) => (num % 2) !== 0 
// function sortOddNumbers(input) {
//     const filtered = input.filter(el=>isOdd(el)).sort()
//     // console.log(filtered)
//     const output = input.map((in_numb,index)=>{
//         if (!isOdd(in_numb)) return in_numb
//         return filtered.shift()
//     })
//     return output
// }
// console.log(sortOddNumbers(input))

// провести review кода + переписать на ES6
// import * as fs from 'node:fs'

//  function getFile(path) {
//     const result = new Promise((res,rej)=>fs.readFile(path, function (err, data) {
//         if (err){
//             rej(err)
//         }
//         res(data)
//     })).then(d=>d).catch((e)=>{throw new Error(e)})
//     return result;
// }

// провести review кода 

// const updater = async(storage,data) => {/*....*/}

// const list = [
//     updater1,
//     updater2,
//     updater3,
//     '...',
//     updaterN
// ]

// async function doStorageUpdate(storage, data) {
//     list.forEach(updater=>updater(storage,data))
// }

// async function doStorageUpdate(storage, data) {
//    for (const request of list) {
//     await request(storage, data)
//    }
// }

function counter() {
    let count = 0
    return {
        getValue:()=>count,
        increment:()=>{count++; return count},
    }
}
const exempl = counter()
console.log(exempl.getValue())
console.log(exempl.increment())
console.log(exempl.increment())