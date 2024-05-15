// The Vigenère cipher is a classic cipher originally developed by Italian cryptographer Giovan Battista Bellaso and published in 1553. 
// It is named after a later French cryptographer Blaise de Vigenère, who had developed 
// a stronger autokey cipher (a cipher that incorporates the message of the text into the key).

// The cipher is easy to understand and implement, but survived three centuries of attempts to break it, 
// earning it the nickname "le chiffre indéchiffrable" or "the indecipherable cipher."

// From Wikipedia:

// The Vigenère cipher is a method of encrypting alphabetic text by using a series of different Caesar ciphers based on the letters of a keyword.
// It is a simple form of polyalphabetic substitution.

// . . .

// In a Caesar cipher, each letter of the alphabet is shifted along some number of places; for example, in a Caesar cipher of shift 3,
// A would become D, B would become E, Y would become B and so on.
// The Vigenère cipher consists of several Caesar ciphers in sequence with different shift values.

// Assume the key is repeated for the length of the text, character by character. 
// Note that some implementations repeat the key over characters only if they are part of the alphabet -- this is not the case here.

// The shift is derived by applying a Caesar shift to a character with the corresponding index of the key in the alphabet.

// Visual representation:

// "my secret code i want to secure"  // message
// "passwordpasswordpasswordpasswor"  // key
// Write a class that, when given a key and an alphabet, can be used to encode and decode from the cipher.

// Example
// var alphabet = 'abcdefghijklmnopqrstuvwxyz';
// var key = 'password';

// // creates a cipher helper with each letter substituted
// // by the corresponding character in the key
// var c = new VigenèreCipher(key, alphabet);

// c.encode('codewars'); // returns 'rovwsoiv'
// c.decode('laxxhsj');  // returns 'waffles'



class VigenèreCipher {
    constructor(key, alphabet) {
        this.key = key;
        this.alphabet = alphabet;
    }
    encode(message) {
        const arr_message = message.split('')
        const arr_key = this._generateComparedKey(arr_message)

        const enc_message = arr_message.map((letter, index)=>{
            const letter_index = this.alphabet.indexOf(letter)
            const key_letter_index = this.alphabet.indexOf(arr_key[index])         
            const arr_key_square = this._getCorrectSquareArray(key_letter_index)

            return arr_key_square[letter_index] ?? letter
        })
        return enc_message.join('')
    }
    decode(enc_message) {
        const arr_enc_message = enc_message.split('')
        const arr_key = this._generateComparedKey(enc_message)

        const message = arr_enc_message.map((enc_letter, index)=>{
            const key_letter_index = this.alphabet.indexOf(arr_key[index])         
            const arr_key_square = this._getCorrectSquareArray(key_letter_index)
            const enc_letter_index = arr_key_square.indexOf(enc_letter)
     
            return this.alphabet[enc_letter_index] ?? enc_letter
        })
        return message.join('')
    }
    _generateComparedKey (arr_message) {
        let arr_key = []
        const arr_init_key = this.key.split('')

        while (arr_key.length!==arr_message.length) {
            if (arr_message.length - arr_key.length >= arr_init_key.length) {
                arr_key.push(...arr_init_key)
            } else {
                arr_key.push(...arr_init_key.slice(0,arr_message.length - arr_key.length))
            } 
        }
        return arr_key
    }
    _getCorrectSquareArray (shift_value) {
        var result = this.alphabet.slice(shift_value).concat(this.alphabet.slice(0,shift_value))
        return result.split('')
    }
}
const code = new VigenèreCipher('password','abcdefghijklmnopqrstuvwxyz')
console.log('result',code.decode('laxxhsj'))