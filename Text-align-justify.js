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
function justify(text, width) {
    const arr = text.split(' ')
    // Your code goes here
    return arr
  }
console.log('>>>\n', justify('123 45 6', 7))