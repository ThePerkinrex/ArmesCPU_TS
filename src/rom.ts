import 'source-map-support/register'

import { CustomMemory } from './components/memory'
import { createBinFile } from './utils/bin'

import { MINST_COUNTER_LENGTH, INST_LENGHT, MINST_LENGTH, Instructions, inst } from './@types/instructions' // eslint-disable-line import/no-duplicates

console.log('\n> Building ROM...')

function createROM (inst: Instructions): CustomMemory {
	// Each ROM stores a byte for each address
	let rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT, MINST_LENGTH)

	for (let instructionName in inst) {
		let object = inst[instructionName]
		console.log(instructionName, '0x' + object.code.toString(16).toUpperCase())
		for (let i = 0; i < Math.pow(2, MINST_COUNTER_LENGTH); i++) {
			rom.set(object.code << MINST_COUNTER_LENGTH | i, object.microcode[i] || 0)
		}
	}

	return rom
}

const rom = createROM(inst)

console.log(rom.get(0))
rom.hexdump()

createBinFile(rom, 'rom')
