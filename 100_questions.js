//1. Что такое замыкание (closure) в JavaScript? Приведи пример использования.
function closureEx(params) {
    const name = 'Violetta'
    return (age)=>console.log(name+' '+(age??'возраст не известен'))
}
const testClb2 = closureEx()(23)
const testClb = closureEx()
testClb(21)
testClb(10)
testClb(0)
testClb()
console.log(testClb.toString())
//________________________________________________________________________________________//
//                     Junior: Генератор последовательности Фибоначчи

// Задача: Напишите функцию-генератор, которая будет генерировать 
// последовательность чисел Фибоначчи. Первые два числа последовательности — 0 
// и 1, а каждое следующее число — сумма двух предыдущих.

// Пример использования:

// const fib = fibonacciGenerator();
// console.log(fib.next().value); // 0
// console.log(fib.next().value); // 1
// console.log(fib.next().value); // 1
// console.log(fib.next().value); // 2
// console.log(fib.next().value); // 3

function* fibonacciGenerator () {
    var iteration = 0,
    lastPare = [0,1]
    while (true) {
        if (iteration === 0 || iteration === 1) {
            yield iteration++
        } else {
            const prev = lastPare
            const result = prev.reduce((a,e)=>a+e,0)
            lastPare = [lastPare[1],result] 
            yield result               
        }
    }
}
const fib = fibonacciGenerator();
console.log(fib.next().value); // 0
console.log(fib.next().value); // 1
console.log(fib.next().value); // 1
console.log(fib.next().value); // 2
console.log(fib.next().value); // 3
console.log(fib.next().value); // 5
console.log(fib.next().value); // 8
console.log(fib.next().value); // 13
console.log(fib.next().value); // 21
console.log(fib.next().value); // 34

//________________________________________________________________________________________//

// Middle: Генератор для бесконечного списка простых чисел
// Задача: Напишите функцию-генератор, которая будет генерировать бесконечный список простых чисел. 
// Простое число — это число больше 1, которое не имеет делителей, кроме 1 и самого себя.

// Пример использования:


const primes = primeGenerator();
console.log(primes.next().value); // 2
console.log(primes.next().value); // 3
console.log(primes.next().value); // 5
console.log(primes.next().value); // 7
console.log(primes.next().value); // 11