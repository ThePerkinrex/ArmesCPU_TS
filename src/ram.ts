import 'source-map-support/register'

import { Memory } from './components/memory'
import { createBinFile } from './utils/bin'
import { inst as i } from './@types/instructions'

let ram = new Memory(15) // first bit to select ram or another thing
for (let idx = 0x00; idx < 0x8000; idx++) { // Empty it
	ram.set(idx, i.NOP.code)
}

let code: {[address: number]: number} = {
	0x0000: i.LDA.code,
	0x0001: 0x00,
	0x0002: 0x0B,
	0x0003: i.ADD.code,
	0x0004: 0x00,
	0x0005: 0x0C,
	0x0006: i.STA.code,
	0x0007: 0x80,
	0x0008: 0x10,
	0x0009: i.HALT.code,
	0x000B: 15,
	0x000C: 50
}

// TODO: write real compiler

for (let address in code) {
	ram.set(parseInt(address), code[address])
}

ram.hexdump()

createBinFile(ram, 'ram')
