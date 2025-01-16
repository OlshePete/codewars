function flatCustom(initialArr) {
    //foreach
    const result = []
    initialArr.forEach((element,index)=>{
        if(!Array.isArray(element)) result.push(element); else {
            result.push(...flatCustom(element))
        }
    })
    return result
}
function flatCustom2(initialArr) {
    //reduce
    return initialArr.reduce((acc, element,index)=>{
        if(!Array.isArray(element)) acc.push(element); else {
            acc.push(...flatCustom(element))
        }
        return acc
    },[])
}


console.log(`\x1b[36m test1 \x1b[0m`,`: `,flatCustom([1,2,3,4,[5,6,[7,8,[9,10]]]]))
console.log(`\x1b[36m test2 \x1b[0m`,`: `,flatCustom2([1,[2],3,4,[5,6,[7,8,[9,10]]]]))