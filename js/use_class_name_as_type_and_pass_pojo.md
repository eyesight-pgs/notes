
Is works.
We can provide class name as type
and pass plain object for it
instead of instance of the class.

class A {
    ten: number
    letter: string
}

function test(aa: A) {
    console.log(`ten: `, aa.ten)
    console.log(`letter: `, aa.letter)
}
//-----
test({ten: 10, letter: "ten"})
test({ten: 10, letter: 222})

