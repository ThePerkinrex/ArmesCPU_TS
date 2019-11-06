import { Memory } from './@types/memory'

console.log("I'm alive")

let ram = new Memory(8)

console.log(ram.get(0))
console.log(ram.get(255))
