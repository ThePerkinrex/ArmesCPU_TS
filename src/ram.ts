import 'source-map-support/register'

import { Memory } from './components/memory'
import { createBinFile } from './utils/bin'
import { inst as i } from './@types/instructions'
import { compileAssembly } from './asm'

console.log('\n> Building RAM...')

let ram = new Memory(15) // first bit to select ram or another thing
for (let idx = 0x00; idx < 0x8000; idx++) { // Empty it
	ram.set(idx, i.NOP.code)
}

/*
let x = 1;
let acc = x;
for(let i=0; i<100; i++){
	let y = acc
	acc = acc + x
	x = y
	console.log(acc)
}
VVVVVVVVVVV
#x = 1
LDA #x
:loop STA #y
ADD #x
MOV #y #x
STA 0x8010
JMP @loop

*/

let asm = `
#x = 1
#y = 0
LDA #x
:loop STA #y
ADD #x
MOV #y #x
STA 0x8010
JOF @halt
JMP @loop
:halt HALT
`

let compiled = compileAssembly(asm)
compiled.hexdump()

let code: {[address: number]: number} = {
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
}

// TODO: write real compiler

for (let address in code) {
	ram.set(parseInt(address), code[address])
}

ram.hexdump()

createBinFile(ram, 'ram')
