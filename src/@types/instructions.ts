export const INST_LENGHT = 8
export const MINST_COUNTER_LENGTH = 4
export const MINST_LENGTH = 16

// INSTRUCTION (8bits) MINST_COUNTER (4bits)
// 12 bits total

/*
NOP		0x00
HALT	0xFF
ADD		0x01
MOV		0x02
LDA		0x03
STA		0x04
*/
//MICRO INSTRUTIONS (MINST) (2 bytes for now)
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
14 - REI
15 - REO
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

export const REI = 1 << 14
export const REO = 1 << 15

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