import 'source-map-support/register'

import { Memory } from './components/memory'
import { createBinFile } from './utils/bin'
import { inst as i } from './@types/instructions'

// Little-endian? big part first, small part last

let ram = new Memory(15) // first bit to select ram or another thing
for (let idx = 0x00; idx < 0x8000; idx++) { // Empty it
	ram.set(idx, 0x00)
}

let code: {[address: number]: number} = {
	0x00: i.MOV.code,
	0x01: 0x00,
	0x02: 0x06,
	0x03: 0x80,
	0x04: 0x10,
	0x05: i.HALT.code,
	0x06: 0x0F
}

for (let address in code) {
	ram.set(parseInt(address), code[address])
}

ram.hexdump()

createBinFile(ram, 'ram')
