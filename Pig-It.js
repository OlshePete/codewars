// Move the first letter of each word to the end of it, then add "ay" to the end of the word. Leave punctuation marks untouched.


const case1 = 'Hello World'
const case2 = 'Pig latin is cool'
const case3 = 'O tempora o mores !'

const pigIt = (str) => str.split(" ").map((word,index)=>{
        const symbolList = word.match(/[^\w\s]/g)
        return !symbolList ? word.slice(1)+word[0]+"ay" :word
    }).join(' ')

console.log(`test 1 :`,pigIt(case1))
console.log(`test 2 :`,pigIt(case2))
console.log(`test 3 :`,pigIt(case3)) 