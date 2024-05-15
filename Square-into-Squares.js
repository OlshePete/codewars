// Given an array of positive or negative integers

//  I= [i1,..,in]

// you have to produce a sorted array P of the form

// [ [p, sum of all ij of I for which p is a prime factor (p positive) of ij] ...]

// P will be sorted by increasing order of the prime numbers. 
// The final result has to be given as an array of arrays in other languages.

// Example:
// I = [12, 15]; //result = [[2, 12], [3, 27], [5, 15]]
// [2, 3, 5] is the list of all prime factors of the elements of I, hence the result.

// Notes:

// It can happen that a sum is 0 if some numbers are negative!
// Example: I = [15, 30, -45] 5 divides 15, 30 and (-45) so 5 appears in the result, the sum of the numbers for which 5 is a factor is 0 so we have [5, 0] in the result amongst others.

// testing(
//      [12, 15], 
//      [ [2, 12], [3, 27], [5, 15] ]
// );
// testing(
//      [15,21,24,30,45], 
//      [ [2, 54], [3, 135], [5, 90], [7, 21] ]
// );
const sumArray = (arr) => arr.reduce((a,e)=>a+=e,0)
const isPrime = (n) => {
    for (let i = 2,max = Math.sqrt(n); i < max; i++) {
        if (n % i === 0) return false        
    }
    return n !== 1
}
const getPrimeList = (max_number) => {
    const primes = []
    const seive = []
    for (let i = 2; i < max_number; i++) {
        if (!seive[i]) {
            primes.push(i);
            for (let j = i * 2; j < max_number; j+=i) {
                seive[j] = true;
                
            }
        }
    }
    return primes
} 
function sumOfDivided(lst) {
    
    const totalSum = sumArray(lst.map(Math.abs))
    

    const factorList = getPrimeList(totalSum)

    const result = factorList.reduce((acc, el)=>{    
        const validValue = lst.filter((element)=>element%el === 0)
        validValue?.length > 0 && acc.push([el,sumArray(validValue)])
        return acc
    },[])
    return result;
  }
   
console.log(1, sumOfDivided([-29804,-4209,-28265,-72769,-31744])) 
console.log(2, sumOfDivided([
    107, 158, 204, 100,
    118, 123, 126, 110,
    116, 100
  ]))
console.log(3, getPrimeList(sumArray([15, 21, 24, 30, 45])))