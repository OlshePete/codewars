let person = {name:'Lara'}
const members = [person]
console.log(`\x1b[36m test compare 1 \x1b[0m`,`: `,members[0]===person)
person = null
console.log(`\x1b[36m test compare 2 \x1b[0m`,`: `,members[0]===person)
console.log(`\x1b[36m members \x1b[0m`,`: `,members)

// console output
// test compare 1  :  true
// test compare 2  :  false
// members  :  [ { name: 'Lara' } ]