function add(n){
    const clb = function (k) {
        return add(n+k)
    }
    clb.valueOf = ()=>n; // clb.toString = ()=>n;
    return clb
  }
  
console.log("#1#",add(1))
console.log("#2#",add(1)(2))
console.log("#3#",add(1)(2)(3))
console.log("#4#",add(1)(2)(3)(4))
console.log("#5#",add(1)(2)(3)(4)(5))