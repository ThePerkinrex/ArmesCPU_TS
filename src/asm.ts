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

	let variableAddress = 0x7FFF

	let variables: { [name: string]: number } = {}

	let labels: { [name: string]: number } = {}

	const instructionRegex = /^(:\w+ )?(([A-Z]+)(?: ([^; ]+))*)( *;.*)?$/
	const variableDefineRegex = /#(\w+)/
	const variableDefineSetRegex = /#(\w+)\s*=\s*((?:0x\d+)|\d+|'.')/
	const labelDefineRegex = /:(\w+)\s*=\s*((?:0x\d+)|\d+)/
	const labelRegex = /@\w+/
	const variableRegex = /#\w+/
	const charRegex = /'.'/

	let lines = asm.split('\n')

	let address = 0
	for (let line of lines) {
		let instMatch = line.match(instructionRegex)
		if (instMatch && instMatch.length > 3) {
			let instruction = instMatch[3]
			// console.log(instruction, line, instMatch)

			if (instMatch[1]) {
				labels[instMatch[1].trim().slice(1)] = address
			}

			address += 1 /* Instruction byte */ + i[instruction].bytesUsedByInstruction
			continue
		}

		let labelDefineMatch = line.match(labelDefineRegex)
		if (labelDefineMatch && labelDefineMatch.length > 1) {
			labels[labelDefineMatch[1]] = parseInt(labelDefineMatch[2])
			// console.log(labels, labelDefineMatch[1])

			console.log(`(${labelDefineMatch[1]})`, labels[labelDefineMatch[1]], `(${labelDefineMatch[2]})`)
		}

		let defineSetMatch = line.match(variableDefineSetRegex)
		if (defineSetMatch && defineSetMatch.length > 1) {
			variables[defineSetMatch[1]] = variableAddress

			if (charRegex.test(defineSetMatch[2])) {
				code[variableAddress] = defineSetMatch[2].replace('\'', '').charCodeAt(0) & 0xFF
			}else{
				code[variableAddress] = parseInt(defineSetMatch[2])
			}
			
			console.log(`(${defineSetMatch[1]})`,variableAddress.toString(16), '=', code[variableAddress], `(${defineSetMatch[2]})`)
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

	// console.log(labels)
	address = 0
	for (let line of lines) {
		let instMatch = line.match(instructionRegex)
		if (instMatch && instMatch.length > 3) {
			let args = instMatch[2].split(/\s/).slice(1)
			let instruction = instMatch[3]

			if (instMatch[1] && labels[instMatch[1].trim().slice(1)] === undefined) {
				labels[instMatch[1].trim().slice(1)] = address
				console.error('Something bad happened (unreachable state): label', instMatch[1].trim().slice(1), 'should exist')
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
					if (labels[arg.slice(1)] !== undefined) {
						num = labels[arg.slice(1)]

						code[address] = num >> 8
						address++
						code[address] = num & 255
					} else {
						console.error('Unreachable state (label not found)', arg.slice(1))
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
	}

	// console.log(code)

	// compile code
	for (let address in code) {
		ram.set(parseInt(address), code[address])
		// console.log(`${parseInt(address).toString(16)}: ${code[address].toString(16)} --> ${ram.get(parseInt(address)).toString(16)}`)
	}

	return ram
}
