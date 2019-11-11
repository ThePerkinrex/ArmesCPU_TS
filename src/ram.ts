import 'source-map-support/register'

import { Memory } from './components/memory'
import { createBinFile } from './utils/bin'
import { inst as i } from './@types/instructions'

let ram = new Memory(15) // first bit to select ram or another thing
for (let idx = 0x00; idx < 0x8000; idx++) { // Empty it
	ram.set(idx, 0x00)
}

let code: {[address: number]: number} = {
	0x0000: i.MOV.code,
	0x0001: 0x00,
	0x0002: 0x0B,
	0x0003: 0x80,
	0x0004: 0x10,
	0x0005: i.MOV.code,
	0x0006: 0x00,
	0x0007: 0x0C,
	0x0008: 0x80,
	0x0009: 0x11,
	0x000A: i.HALT.code,
	0x000B: 70, // F
	0x000C: 65 // A
}

// TODO: write real compiler

for (let address in code) {
	ram.set(parseInt(address), code[address])
}

ram.hexdump()

createBinFile(ram, 'ram')
