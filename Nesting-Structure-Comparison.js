// Complete the function/method (depending on the language) 
// to return true/True when its argument is an array that has the same nesting structures 
// and same corresponding length of nested arrays as the first array.

//  // should return true
//  [ 1, 1, 1 ].sameStructureAs( [ 2, 2, 2 ] );          
//  [ 1, [ 1, 1 ] ].sameStructureAs( [ 2, [ 2, 2 ] ] );  
 
//   // should return false 
//  [ 1, [ 1, 1 ] ].sameStructureAs( [ [ 2, 2 ], 2 ] );  
//  [ 1, [ 1, 1 ] ].sameStructureAs( [ [ 2 ], 2 ] );  
 
//  // should return true
//  [ [ [ ], [ ] ] ].sameStructureAs( [ [ [ ], [ ] ] ] ); 
 
//  // should return false
//  [ [ [ ], [ ] ] ].sameStructureAs( [ [ 1, 1 ] ] ); 

function clearData(raw_array) {
    return Array.isArray(raw_array)? raw_array?.map((el,index)=>{
         if (typeof el !== 'object' ) {
            return null
        } else return clearData(el)
    }) : null
}

Array.prototype.sameStructureAs = function (other) {
    const first = JSON.stringify(clearData(this))
    const second = JSON.stringify(clearData(other))
    return first === second
};
console.log('test',[[[],[]]].sameStructureAs( [[[],[]]] ))