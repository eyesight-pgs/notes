# rust

## String and &str

[what-are-the-differences-between-rusts-string-and-str](https://stackoverflow.com/questions/24158114/what-are-the-differences-between-rusts-string-and-str)

`String`:
- Rust owned String type, the string itself lives on the heap and therefore is mutable and can alter its size and contents.
- Because String is owned when the variables which owns the string goes out of scope the memory on the heap will be freed.
- Variables of type String are fat pointers (pointer + associated metadata)
- The fat pointer is 3 * 8 bytes (wordsize) long consists of the following 3 elements:
  - Pointer to actual data on the heap, it points to the first character
  - Length of the string (# of characters)
  - Capacity of the string on the heap

`&str`:
- Rust non owned String type and is immutable by default. The string itself lives somewhere else in memory usually on the heap or 'static memory.
- Because String is non owned when &str variables goes out of scope the memory of the string will not be freed.
- Variables of type &str are fat pointers (pointer + associated metadata)
- The fat pointer is 2 * 8 bytes (wordsize) long consists of the following 2 elements:  
  - Pointer to actual data on the heap, it points to the first character
  - Length of the string (# of characters)

Example:

```rs
use std::mem;

fn main() {
    // on 64 bit architecture:
    println!("{}", mem::size_of::<&str>()); // 16
    println!("{}", mem::size_of::<String>()); // 24

    let string1: &'static str = "abc";
    // string will point to `static memory which lives through the whole program

    let ptr = string1.as_ptr();
    let len = string1.len();

    println!("{}, {}", unsafe { *ptr as char }, len); // a, 3
    // len is 3 characters long so 3
    // pointer to the first character points to letter a

    {
        let mut string2: String = "def".to_string();

        let ptr = string2.as_ptr();
        let len = string2.len();
        let capacity = string2.capacity();
        println!("{}, {}, {}", unsafe { *ptr as char }, len, capacity); // d, 3, 3
        // pointer to the first character points to letter d
        // len is 3 characters long so 3
        // string has now 3 bytes of space on the heap

        string2.push_str("ghijk"); // we can mutate String type, capacity and length will aslo change
        println!("{}, {}", string2, string2.capacity()); // defghijk, 8

    } // memory of string2 on the heap will be freed here because owner goes out of scope

}
```










