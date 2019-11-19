import { Memory } from './components/memory'
import { inst as i } from './@types/instructions'

interface Code {
	[address: number]: number;
}

export function compileAssembly (asm: string): Memory {
	console.log('\n> Compiling Assembly...')

	let ram = new Memory(15) // first bit to select ram or another thing
	for (let idx = 0x00; idx < 0x8000; idx++) { // Empty it
		ram.set(idx, i.NOP.code)
	}

	let code: Code = {}

	let address = 0
	let variableAddress = 0x7FFF

	let variables: {[name: string]: number} = {}

	let labels: {[name: string]: number} = {}

	const instructionRegex = /(:\w+ )?(([A-Z]+)(?: ([^; ]+))*)( *;.*)?/
	const variableDefineRegex = /#(\w+)/
	const variableDefineSetRegex = /#(\w+)\s*=\s*(\d+|(?:0x\d+))/
	const labelRegex = /@\w+/
	const variableRegex = /#\w+/

	for (let line of asm.split('\n')) {
		let instMatch = line.match(instructionRegex)
		if (instMatch && instMatch.length > 3) {
			let args = instMatch[2].split(/\s/).slice(1)
			let instruction = instMatch[3]

			if (instMatch[1]) {
				labels[instMatch[1].trim().slice(1)] = address
			}

			code[address] = i[instruction].code
			address++
			for (let arg of args) {
				let num = parseInt(arg)
				if (!isNaN(num)) {
					code[address] = num >> 8
					address++
					code[address] = num & 255
				} else if (labelRegex.test(arg)) {
					if(labels[arg.slice(1)] !== undefined){
						num = labels[arg.slice(1)]

						code[address] = num >> 8
						address++
						code[address] = num & 255
					}else{
						// TODO go forward and get where the address will be
					}
				} else if (variableRegex.test(arg)) {
					num = variables[arg.slice(1)]

					code[address] = num >> 8
					address++
					code[address] = num & 255
				}
				address++
			}
			continue
		}

		let defineSetMatch = line.match(variableDefineSetRegex)
		if (defineSetMatch && defineSetMatch.length > 1) {
			variables[defineSetMatch[1]] = variableAddress
			code[variableAddress] = parseInt(defineSetMatch[2])
			variableAddress--
			continue
		}

		let defineMatch = line.match(variableDefineRegex)
		if (defineMatch && defineMatch.length > 1) {
			variables[defineMatch[1]] = variableAddress
			variableAddress--
			continue
		}
	}

	/* = {
		0x0000: i.LDA.code, // LDA
		0x0001: 0x7F,
		0x0002: 0xFE, // #x
		0x0003: i.STA.code, // :loop STA
		0x0004: 0x7F,
		0x0005: 0xFF, // #y
		0x0006: i.ADD.code, // ADD
		0x0007: 0x7F,
		0x0008: 0xFE, // #x
		0x0009: i.JOF.code, // JOF
		0x000A: 0x00,
		0x000B: 0x17, // @halt
		0x000C: i.STA.code, // STA
		0x000D: 0x80,
		0x000E: 0x10, // 0x8010 ; IO address
		0x000F: i.MOV.code, // MOV
		0x0010: 0x7F,
		0x0011: 0xFF, // #y
		0x0012: 0x7F,
		0x0013: 0xFE, // #x
		0x0014: i.JMP.code, // JMP
		0x0015: 0x00,
		0x0016: 0x03, // @loop
		0x0017: i.HALT.code, // :halt
		0x7FFE: 1, // #x
		0x7FFF: 0 // #y
	} */

	console.log(code)

	// compile code
	for (let address in code) {
		ram.set(parseInt(address), code[address])
	}

	return ram
}
