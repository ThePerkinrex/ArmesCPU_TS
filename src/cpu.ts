import { Memory, CustomMemory } from './components/memory'
import { ConsoleIO, IO } from './components/io'
import { MINST_LENGTH, MINST_COUNTER_LENGTH, INST_LENGHT, HLT, ICA, ICO1, ICO2, ICI2, ICI1, A1I, A2I, DAI, DAO, IRI, R1I, R1O, R2I, R2O, ACI, ACO, ADD, FLAGS_LENGTH } from './@types/instructions'
import { AddressSelector, Bus_AddressSelector_Interface } from './components/addressSelector' // eslint-disable-line @typescript-eslint/camelcase
import { Bus } from './components/bus'
import { BusRegister } from './components/busRegister'
import { InstructionCounter, Bus_InstructionCounter_Interface } from './components/instructionCounter' // eslint-disable-line @typescript-eslint/camelcase
import { ALU } from './components/alu'
import { FlagsRegister } from './components/flagsRegister'

// BIG ENDIAN SYSTEM

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

export const DEBUG = false

export class CPU {
	private ram: Memory
	private rom: CustomMemory

	private io: IO // 16B - 0x8010 - 0x801F

	public addressSelector = new AddressSelector(16)

	private addressSelectorInterface = new Bus_AddressSelector_Interface(this.addressSelector)

	private instructionCounter = new InstructionCounter()
	private instructionCounterInterface = new Bus_InstructionCounter_Interface(this.instructionCounter)

	private instructionRegister = new BusRegister()
	private privateRegister1 = new BusRegister()
	private privateRegister2 = new BusRegister()
	private accumulator = new BusRegister()

	private flags = new FlagsRegister()

	private alu = new ALU(this.accumulator, this.flags)

	private bus = new Bus()

	constructor (ram: Buffer, rom: Buffer, io = new ConsoleIO(4)) {
		this.ram = new Memory(15, ram) // 32kB - 0x0000 - 0x7FFF
		this.rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT + FLAGS_LENGTH, MINST_LENGTH, rom)

		this.io = io

		this.addressSelector.addComponent(0x0000, 0x7FFF, this.ram)
		this.addressSelector.addComponent(0x8010, 0x801F, this.io)

		this.bus.addBusIO(this.addressSelectorInterface.address1Interface)
		this.bus.addBusIO(this.addressSelectorInterface.address2Interface)
		this.bus.addBusIO(this.addressSelectorInterface.dataInterface)

		this.bus.addBusIO(this.instructionCounterInterface.counter1Interface)
		this.bus.addBusIO(this.instructionCounterInterface.counter2Interface)

		this.bus.addBusIO(this.instructionRegister)

		this.bus.addBusIO(this.privateRegister1)
		this.bus.addBusIO(this.privateRegister2)

		this.bus.addBusIO(this.accumulator)
		this.bus.addBusIO(this.alu)
	}

	public haltFlag = false

	// #region Microinstructions
	/* eslint-disable @typescript-eslint/camelcase */

	private ICO1 () {
		this.instructionCounterInterface.counter1Interface.ontoBus()
	}

	private ICO2 () {
		this.instructionCounterInterface.counter2Interface.ontoBus()
	}

	private ICI1 () {
		this.instructionCounterInterface.counter1Interface.fromBus()
	}

	private ICI2 () {
		this.instructionCounterInterface.counter2Interface.fromBus()
	}

	private ICA () {
		this.instructionCounter.add()
	}

	private A1I () {
		this.addressSelectorInterface.address1Interface.fromBus()
	}

	private A2I () {
		this.addressSelectorInterface.address2Interface.fromBus()
	}

	private DAI () {
		this.addressSelectorInterface.dataInterface.fromBus()
	}

	private DAO () {
		this.addressSelectorInterface.dataInterface.ontoBus()
	}

	private IRI () {
		this.instructionRegister.fromBus()
	}

	private R1I () {
		this.privateRegister1.fromBus()
	}

	private R1O () {
		this.privateRegister1.ontoBus()
	}

	private R2I () {
		this.privateRegister2.fromBus()
	}

	private R2O () {
		this.privateRegister2.ontoBus()
	}

	private HLT () {
		this.haltFlag = true
	}

	private ACI () {
		this.accumulator.fromBus()
	}

	private ACO () {
		this.accumulator.ontoBus()
	}

	private ADD () {
		this.alu.add()
	}

	/* eslint-enable @typescript-eslint/camelcase */
	// #endregion Microinstructions

	public async run () {
		try {
			while (!this.haltFlag) {
				// Read instruction -> go trough microinstructions -> start over
				let instruction = this.instructionRegister.getVal()
				if (DEBUG) console.log('#', this.instructionCounter.counter.toString(16).padStart(4, '0'), instruction.toString(16).padStart(2, '0'))
				for (let i = 0; i < Math.pow(2, MINST_COUNTER_LENGTH); i++) {
					let romAddress = (((instruction << MINST_COUNTER_LENGTH) + i) << FLAGS_LENGTH) + this.flags.getVal()
					let romVal = this.rom.get(romAddress)
					if (romVal === 0) break // break out of the loop if no microcode
					let mcodes = ''
					// #region Check microinstructions
					if ((romVal & HLT) !== 0) {
						this.HLT()
						mcodes += 'HLT '
					}
					if ((romVal & ICA) !== 0) {
						this.ICA()
						mcodes += 'ICA '
					}
					if ((romVal & ICO1) !== 0) {
						this.ICO1()
						mcodes += 'ICO1 '
					}
					if ((romVal & ICO2) !== 0) {
						this.ICO2()
						mcodes += 'ICO2 '
					}
					if ((romVal & ICI1) !== 0) {
						this.ICI1()
						mcodes += 'ICI1 '
					}
					if ((romVal & ICI2) !== 0) {
						this.ICI2()
						mcodes += 'ICI2 '
					}

					if ((romVal & A1I) !== 0) {
						this.A1I()
						mcodes += 'A1I '
					}
					if ((romVal & A2I) !== 0) {
						this.A2I()
						mcodes += 'A2I '
					}

					if ((romVal & DAI) !== 0) {
						this.DAI()
						mcodes += 'DAI '
					}
					if ((romVal & DAO) !== 0) {
						this.DAO()
						mcodes += 'DAO '
					}

					if ((romVal & IRI) !== 0) {
						this.IRI()
						mcodes += 'IRI '
					}

					if ((romVal & R1I) !== 0) {
						this.R1I()
						mcodes += 'R1I '
					}
					if ((romVal & R1O) !== 0) {
						this.R1O()
						mcodes += 'R1O '
					}

					if ((romVal & R2I) !== 0) {
						this.R2I()
						mcodes += 'R2I '
					}
					if ((romVal & R2O) !== 0) {
						this.R2O()
						mcodes += 'R2O '
					}

					if ((romVal & ACI) !== 0) {
						this.ACI()
						mcodes += 'ACI '
					}
					if ((romVal & ACO) !== 0) {
						this.ACO()
						mcodes += 'ACO '
					}
					if ((romVal & ADD) !== 0) {
						this.ADD()
						mcodes += 'ADD '
					}
					// #endregion Check microinstructions
					if (DEBUG) console.log('-', romVal.toString(2).padStart(MINST_LENGTH, '0'), romVal.toString(16), mcodes)
					this.bus.cycle()
				}
				// console.log(this.flags.getVal().toString(2))
				this.flags.cycle()
			}
		} catch (e) {
			console.error('\x1b[31mCPU Error:', e, '\x1b[0m')
		}
	}
}


