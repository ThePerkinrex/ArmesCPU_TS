export const INST_LENGHT = 8
export const MINST_COUNTER_LENGTH = 5
export const MINST_LENGTH = 24

// INSTRUCTION (8bits) MINST_COUNTER (4bits)
// 12 bits total

/*
NOP		0x00
HALT	0xFF
ADD		0x01
MOV		0x02
LDA		0x03
STA		0x04
JMP		0x05
*/
//MICRO INSTRUTIONS (MINST) (24bit)
/*
0 -  HLT Halt

1 -  ICA Instrution counter add
2 -  ICO1	"		  "	   out1
3 -  ICO2	"		  "	   out2
4 -  ICI1	"		  "	   in1
5 -  ICI2	"		  "	   in2

6 -  ACO Accumulator out
7 -  ACI Accumulator in

8 -  A1I Address 1 in
9 -  A2I Address 2 in
10 - DAI Data in
11 - DAO Data out

12 - ADD Add the bus with the accumulator

13 - IRI Instruction register in

14 - R1I Register 1 In
15 - R1O Register 1 Out

16 - R2I Register 2 In
17 - R2O Register 2 Out
*/


// Masks
export const HLT = 1 << 0
export const ICA = 1 << 1
export const ICO1 = 1 << 2
export const ICO2 = 1 << 3
export const ICI1 = 1 << 4
export const ICI2 = 1 << 5

export const ACO = 1 << 6
export const ACI = 1 << 7

export const A1I = 1 << 8
export const A2I = 1 << 9
export const DAI = 1 << 10
export const DAO = 1 << 11

export const ADD = 1 << 12

export const IRI = 1 << 13

export const R1I = 1 << 14
export const R1O = 1 << 15

export const R2I = 1 << 16
export const R2O = 1 << 17

export type Microcode = number[]

export interface Instruction {
	code: number,
	microcode: Microcode
}

export interface Instructions {
	[name: string]: Instruction
}

export const LOADER: Microcode = [
	ICO1 | A1I,
	ICO2 | A2I,
	ICA | DAO | IRI
]

export const inst: Instructions = {
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
			// Get argument routine
			DAO | R1I, // Get next value (Instruction counter already advanced & ram address saved) & store it in the register
			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | A2I | ICA, // Set address 2
			R1O | A1I, // set register to address 1
			// End routine

			DAO | R2I, // save value to register 2

			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | R1I | ICA, // Store it in the register
			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | A2I | ICA, // Set address 2
			R1O | A1I, // set register to address 1

			DAI | R2O,

			// Setup for next instrcution
			ICO1 | A1I,
			ICO2 | A2I,
			ICA | DAO | IRI
		])
	},
	ADD: {
		code: 0x01,
		microcode: LOADER.concat([
			// Get argument routine
			DAO | R1I, // Get next value (Instruction counter already advanced & ram address saved) & store it in the register
			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | A2I | ICA, // Set address 2
			R1O | A1I, // set register to address 1
			// End routine
			DAO | ADD,

			// Setup for next instrcution
			ICO1 | A1I,
			ICO2 | A2I,
			ICA | DAO | IRI
		])
	},
	LDA: {
		code: 0x03,
		microcode: LOADER.concat([
			// Get argument routine
			DAO | R1I, // Get next value (Instruction counter already advanced & ram address saved) & store it in the register
			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | A2I | ICA, // Set address 2
			R1O | A1I, // set register to address 1
			// End routine

			DAO | ACI,

			// Setup for next instrcution
			ICO1 | A1I,
			ICO2 | A2I,
			ICA | DAO | IRI
		])
	},
	STA: {
		code: 0x04,
		microcode: LOADER.concat([
			// Get argument routine
			DAO | R1I, // Get next value (Instruction counter already advanced & ram address saved) & store it in the register
			ICO1 | A1I, // Get next value
			ICO2 | A2I,
			DAO | A2I | ICA, // Set address 2
			R1O | A1I, // set register to address 1
			// End routine

			DAI | ACO,

			// Setup for next instrcution
			ICO1 | A1I,
			ICO2 | A2I,
			ICA | DAO | IRI
		])
	},
	JMP: {
		code: 0x05,
		microcode: LOADER.concat([
			DAO | ICI1,
			ICO1 | A1I,
			ICO2 | A2I,
			DAO | ICI2,

			// Setup for next instrcution
			ICO1 | A1I,
			ICO2 | A2I,
			ICA | DAO | IRI
		])
	}
}