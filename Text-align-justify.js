// Your task in this Kata is to emulate text justification in monospace font. You will be given a single-lined text and the expected justification width. The longest word will never be greater than this width.

// Here are the rules:

// Use spaces to fill in the gaps between words.
// Each line should contain as many words as possible.
// Use '\n' to separate lines.
// Gap between words can't differ by more than one space.
// Lines should end with a word not a space.
// '\n' is not included in the length of a line.
// Large gaps go first, then smaller ones ('Lorem--ipsum--dolor--sit-amet,' (2, 2, 2, 1 spaces)).
// Last line should not be justified, use only one space between words.
// Last line should not contain '\n'
// Strings with one word do not need gaps ('somelongword\n').
 

// const itemsLength = (arr=[])=>arr.join("")
const LIPSUM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum sagittis dolor mauris, at elementum ligula tempor eget. In quis rhoncus nunc, at aliquet orci. Fusce at dolor sit amet felis suscipit tristique. Nam a imperdiet tellus. Nulla eu vestibulum urna. Vivamus tincidunt suscipit enim, nec ultrices nisi volutpat ac. Maecenas sit amet lacinia arcu, non dictum justo. Donec sed quam vel risus faucibus euismod. Suspendisse rhoncus rhoncus felis at fermentum. Donec lorem magna, ultricies a nunc sit amet, blandit fringilla nunc. In vestibulum velit ac felis rhoncus pellentesque. Mauris at tellus enim. Aliquam eleifend tempus dapibus. Pellentesque commodo, nisi sit amet hendrerit fringilla, ante odio porta lacus, ut elementum justo nulla et dolor.'
function justify(text, width) {
    if(!text || !width) return text
    let regex = new RegExp(`[\\p{L}\\p{N}\\p{P}\\p{S}\\s]{1,${width}}(\\s|$)`,'ug');
    // let regex = new RegExp(/[\p{L}\p{N}\p{P}\p{S}\s]{1,20}(\s|$)/,'ug');e
    const result = String(text).match(regex)
    const arr = text.split(/\s/g)
    const arr2 = result.map(el=>(el.trim())).map((el,i)=>{
      const currentLength = el.replaceAll(/\s/g,"").length
      const words = el.split(/\s/g)
      const wordsCount = words.length===1?words.length+1:words.length
      const neededSpaceCount = width-currentLength
      const stableSpaceCount = Math.floor(neededSpaceCount / (wordsCount-1))
      let surplus = neededSpaceCount-(stableSpaceCount*(wordsCount-1))
      // console.log(1,{
      //   currentLength,
      //   words,
      //   wordsCount,
      //   neededSpaceCount,
      //   stableSpaceCount
      // })
      words.map((word)=>{
        console.log('__________________',word.length);
        console.log(surplus)
        let space =""
        if (surplus > 0) {
          surplus--
          space=" "
        }
        console.log('__________________',word.length);
        return word + space
      })
      // console.log(2,{
      //   currentLength,
      //   words,
      //   wordsCount,
      //   neededSpaceCount,
      //   stableSpaceCount
      // })

      // console.log(neededSpaceCount,"-",(stableSpaceCount*(wordsCount-1)),'=',surplus,"%", el );
      return words.join(' '.repeat(stableSpaceCount))
    })

    return arr2.join('\n')
  }
console.log(justify(LIPSUM, 30))