import 'source-map-support/register'

import { CustomMemory } from './components/memory'
import { createBinFile } from './utils/bin'

import { MINST_COUNTER_LENGTH, INST_LENGHT, FLAGS_LENGTH, MINST_LENGTH, Instructions, inst, createIgnoreMicrocode } from './@types/instructions' // eslint-disable-line import/no-duplicates

console.log('\n> Building ROM...')

function posibleFlagCombinations (flags: number[]): number[] {
	let setFlags = 0
	for (let flag of flags) {
		setFlags |= (flag & (Math.pow(2, FLAGS_LENGTH) - 1))
	}
	let setFlagsString = setFlags.toString(2).padStart(FLAGS_LENGTH, '0')
	let posibleFlagsStrings: string[] = []

	let numberOfZeros = 0
	for (let char of setFlagsString) {
		if (char === '0') numberOfZeros++
	}

	for (let i = 0; i < Math.pow(2, numberOfZeros); i++) {
		let zerosPosibilities = i.toString(2).padStart(numberOfZeros, '0')
		let newStr = setFlagsString
		let zj = 0
		for (let j = 0; j < newStr.length; j++) {
			if (newStr[j] === '0') {
				newStr = newStr.substr(0, j) + zerosPosibilities[zj] + newStr.substr(j + 1)
				zj++
			}
		}
		posibleFlagsStrings.push(newStr)
	}
	// console.log(posibleFlagsStrings)
	return (posibleFlagsStrings.map(x => parseInt(x, 2))) as number[]
}

function createROM (inst: Instructions): CustomMemory {
	// Each ROM stores a byte for each address
	let rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT + FLAGS_LENGTH, MINST_LENGTH)

	for (let instructionName in inst) {
		let object = inst[instructionName]
		let ignoreMicrocode = createIgnoreMicrocode(object.bytesUsedByInstruction || 0)
		console.log(instructionName, '0x' + object.code.toString(16).toUpperCase())
		for (let i = 0; i < Math.pow(2, MINST_COUNTER_LENGTH); i++) {
			for (let flag of posibleFlagCombinations(object.flags || [0])) {
				rom.set((object.code << MINST_COUNTER_LENGTH | i) << FLAGS_LENGTH | flag, object.microcode[i] || 0)
				if (object.bytesUsedByInstruction && object.flags) {
					rom.set((object.code << MINST_COUNTER_LENGTH | i) << FLAGS_LENGTH | (~flag & (Math.pow(2, FLAGS_LENGTH) - 1)), ignoreMicrocode[i] || 0)
				}
			}
		}
	}

	return rom
}

const rom = createROM(inst)

console.log(rom.get(0))
rom.hexdump()

createBinFile(rom, 'rom')
