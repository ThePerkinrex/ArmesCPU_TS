import 'source-map-support/register'

import { Memory, CustomMemory } from './components/memory'
import { ConsoleIO } from './components/io'
import { readFileSync } from 'fs'
import { MINST_LENGTH, MINST_COUNTER_LENGTH, INST_LENGHT, HLT, ICA, ICO1, ICO2, ICI2, ICI1, A1I, A2I, DAI, DAO, IRI, R1I, R1O, R2I, R2O, ACI, ACO, ADD } from './@types/instructions'
import { AddressSelector, Bus_AddressSelector_Interface } from './components/addressSelector' // eslint-disable-line @typescript-eslint/camelcase
import { Bus } from './components/bus'
import { BusRegister } from './components/busRegister'
import { InstructionCounter, Bus_InstructionCounter_Interface } from './components/instructionCounter' // eslint-disable-line @typescript-eslint/camelcase
import { ALU } from './components/alu'

// BIG ENDIAN SYSTEM

export const DEBUG = false

/* Address sections (16bit/2Byte address)
* 0x0000 - 0x7FFF: 32kB - RAM

? 0x8000 - 0x800F: 16B  - General Purpose Registers
* 0x8010 - 0x801F: 16B  - Console I/O
? 0x8020 - 0x803F: 32B  - I/O
-- Almost 32kB empty (32kB - 64B) -- Divided into standard length sections --
  0x8040 - 0x807F: 64B  -
  0x8080 - 0x80FF: 128B -
  0x8100 - 0x81FF: 256B -
  0x8200 - 0x83FF: 512B -
  0x8400 - 0x87FF: 1kB  -
  0x8800 - 0x8FFF: 2kB  -
  0x9000 - 0x9FFF: 4kB  -
  0xA000 - 0xBFFF: 8kB  -
  0xC000 - 0xFFFF: 16kB -
*/

let ram = new Memory(15, readFileSync('data/ram.bin')) // 32kB - 0x0000 - 0x7FFF
let rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT, MINST_LENGTH, readFileSync('data/rom.bin'))

let io = new ConsoleIO(4) // 16B - 0x8010 - 0x801F

ram.hexdump()
console.log()
console.log()
// rom.hexdump()

let addressSelector = new AddressSelector(16)

addressSelector.addComponent(0x0000, 0x7FFF, ram)
addressSelector.addComponent(0x8010, 0x801F, io)

let addressSelectorInterface = new Bus_AddressSelector_Interface(addressSelector)

let instructionCounter = new InstructionCounter()
let instructionCounterInterface = new Bus_InstructionCounter_Interface(instructionCounter)

let instructionRegister = new BusRegister()
let privateRegister1 = new BusRegister()
let privateRegister2 = new BusRegister()
let accumulator = new BusRegister()

let alu = new ALU(accumulator)

let bus = new Bus()

bus.addBusIO(addressSelectorInterface.address1Interface)
bus.addBusIO(addressSelectorInterface.address2Interface)
bus.addBusIO(addressSelectorInterface.dataInterface)

bus.addBusIO(instructionCounterInterface.counter1Interface)
bus.addBusIO(instructionCounterInterface.counter2Interface)

bus.addBusIO(instructionRegister)

bus.addBusIO(privateRegister1)
bus.addBusIO(privateRegister2)

bus.addBusIO(accumulator)
bus.addBusIO(alu)

let haltFlag = false

// #region Microinstructions
/* eslint-disable @typescript-eslint/camelcase */

function f_ICO1 () {
	instructionCounterInterface.counter1Interface.ontoBus()
}

function f_ICO2 () {
	instructionCounterInterface.counter2Interface.ontoBus()
}

function f_ICI1 () {
	instructionCounterInterface.counter1Interface.fromBus()
}

function f_ICI2 () {
	instructionCounterInterface.counter2Interface.fromBus()
}

function f_ICA () {
	instructionCounter.add()
}

function f_A1I () {
	addressSelectorInterface.address1Interface.fromBus()
}

function f_A2I () {
	addressSelectorInterface.address2Interface.fromBus()
}

function f_DAI () {
	addressSelectorInterface.dataInterface.fromBus()
}

function f_DAO () {
	addressSelectorInterface.dataInterface.ontoBus()
}

function f_IRI () {
	instructionRegister.fromBus()
}

function f_R1I () {
	privateRegister1.fromBus()
}

function f_R1O () {
	privateRegister1.ontoBus()
}

function f_R2I () {
	privateRegister2.fromBus()
}

function f_R2O () {
	privateRegister2.ontoBus()
}

function f_HLT () {
	haltFlag = true
}

function f_ACI () {
	accumulator.fromBus()
}

function f_ACO () {
	accumulator.ontoBus()
}

function f_ADD () {
	alu.add()
}

/* eslint-enable @typescript-eslint/camelcase */
// #endregion Microinstructions
// let j = 0

// TODO make this like a library, so that it can be used on web as well as on node
// For that add callbacks

while (!haltFlag) {
	// Read instruction -> go trough microinstructions -> start over
	let instruction = instructionRegister.getVal()
	if (DEBUG) console.log('#', instructionCounter.counter.toString(16).padStart(4, '0'), instruction.toString(16).padStart(2, '0'))
	for (let i = 0; i < Math.pow(2, MINST_COUNTER_LENGTH); i++) {
		let romAddress = (instruction << MINST_COUNTER_LENGTH) + i
		let romVal = rom.get(romAddress)
		if (romVal === 0) break // break out of the loop if no microcode
		let mcodes = ''
		if ((romVal & HLT) !== 0) {
			f_HLT()
			mcodes += 'HLT '
		}
		if ((romVal & ICA) !== 0) {
			f_ICA()
			mcodes += 'ICA '
		}
		if ((romVal & ICO1) !== 0) {
			f_ICO1()
			mcodes += 'ICO1 '
		}
		if ((romVal & ICO2) !== 0) {
			f_ICO2()
			mcodes += 'ICO2 '
		}
		if ((romVal & ICI1) !== 0) {
			f_ICI1()
			mcodes += 'ICI1 '
		}
		if ((romVal & ICI2) !== 0) {
			f_ICI2()
			mcodes += 'ICI2 '
		}

		if ((romVal & A1I) !== 0) {
			f_A1I()
			mcodes += 'A1I '
		}
		if ((romVal & A2I) !== 0) {
			f_A2I()
			mcodes += 'A2I '
		}

		if ((romVal & DAI) !== 0) {
			f_DAI()
			mcodes += 'DAI '
		}
		if ((romVal & DAO) !== 0) {
			f_DAO()
			mcodes += 'DAO '
		}

		if ((romVal & IRI) !== 0) {
			f_IRI()
			mcodes += 'IRI '
		}

		if ((romVal & R1I) !== 0) {
			f_R1I()
			mcodes += 'R1I '
		}
		if ((romVal & R1O) !== 0) {
			f_R1O()
			mcodes += 'R1O '
		}

		if ((romVal & R2I) !== 0) {
			f_R2I()
			mcodes += 'R2I '
		}
		if ((romVal & R2O) !== 0) {
			f_R2O()
			mcodes += 'R2O '
		}

		if ((romVal & ACI) !== 0) {
			f_ACI()
			mcodes += 'ACI '
		}
		if ((romVal & ACO) !== 0) {
			f_ACO()
			mcodes += 'ACO '
		}
		if ((romVal & ADD) !== 0) {
			f_ADD()
			mcodes += 'ADD '
		}
		if (DEBUG) console.log('-', romVal.toString(2).padStart(MINST_LENGTH, '0'), romVal.toString(16), mcodes)
		bus.cycle()
	}
	/* if(j==4){
    console.log('j broke')
    break
  }
  j++ */
}

console.log()
console.log()

ram.hexdump()
