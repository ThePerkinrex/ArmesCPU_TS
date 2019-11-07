import 'source-map-support/register'

import { CustomMemory } from './@types/memory'
import { createBinFile } from './bin'

import { MINST_COUNTER_LENGTH, INST_LENGHT, MINST_LENGTH, Instructions, LOADER } from './@types/instructions' // eslint-disable-line import/no-duplicates
import { HLT, A1I, A2I, ICA, ICO1, ICO2, ICI1, ICI2, DAO, DAI, REI, REO, IRI, ACO, ACI, ADD } from './@types/instructions' // eslint-disable-line @typescript-eslint/no-unused-vars, import/no-duplicates

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

let instructions: Instructions = {
	NOP: {
		code: 0x00,
		microcode: LOADER
	},
	HALT: {
		code: 0xFF,
		microcode: LOADER.concat([HLT])
	},
	MOV: {
		code: 0x02,
		microcode: LOADER.concat([
			ICO1 | A1I,
			ICO2 | A2I,
			DAO | REI
		])
	}
}

const rom = createROM(instructions)

console.log(rom.get(0))
rom.hexdump()

createBinFile(rom, 'rom')
