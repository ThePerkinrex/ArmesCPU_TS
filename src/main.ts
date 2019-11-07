import 'source-map-support/register'

import { Memory } from './@types/memory'
import { createBinFile } from './bin'

console.log("I'm alive")

let ram = new Memory(15) // first bit to select ram or another thing
for (let i = 0x00; i < 0x8000; i++) {
	ram.set(i, 0xff)
}

ram.hexdump()

createBinFile(ram, 'ram')
