import 'source-map-support/register'

import { Memory } from './components/memory'
import { createBinFile } from './utils/bin'
import { inst as i } from './@types/instructions'

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

let code: {[address: number]: number} = {
	0x0000: i.LDA.code, // LDA
	0x0001: 0x00,
	0x0002: 0x14, // #x
	0x0003: i.STA.code, // :loop STA
	0x0004: 0x00,
	0x0005: 0x15, // #y
	0x0006: i.ADD.code, // ADD
	0x0007: 0x00,
	0x0008: 0x14, // #x
	0x0009: i.STA.code, // STA
	0x000A: 0x80,
	0x000B: 0x10, // 0x8010 ; IO address
	0x000C: i.MOV.code, // MOV
	0x000D: 0x00,
	0x000E: 0x15, // #y
	0x000F: 0x00,
	0x0010: 0x14, // #x
	0x0011: i.JMP.code, // JMP
	0x0012: 0x00,
	0x0013: 0x03, // @loop
	0x0014: 1,
	0x0015: 0
}

// TODO: write real compiler

for (let address in code) {
	ram.set(parseInt(address), code[address])
}

ram.hexdump()

createBinFile(ram, 'ram')
