import { BusIOInterface, DefaultBusInterface } from './bus'

export class InstructionCounter {
	public counter = 0

	constructor(){
		this.counter = 0
	}

	add() {
		this.counter++
		// console.log(this.counter.toString(16).padStart(4,'0'), this.getCounter1().toString(16), this.getCounter2().toString(16))
	}

	getCounter1(): number {
		return (this.counter & 0xFF00) >> 8
	}

	getCounter2(): number {
		return (this.counter & 0xFF)
	}

	setCounter1(n: number) {
		this.counter = ((n & 0xFF) << 8) + (this.counter & 0x00FF)
	}

	setCounter2(n: number) {
		this.counter = (n & 0xFF) + (this.counter & 0xFF00)
	}
}

export class Bus_InstructionCounter_Interface {
	public counter1Interface: BusIOInterface
	public counter2Interface: BusIOInterface

	private instructionCounter: InstructionCounter



	constructor(instructionCounter: InstructionCounter) {
		this.instructionCounter = instructionCounter

		let t = this

		this.counter1Interface = new (
			class extends DefaultBusInterface {
				getVal(): number { return t.instructionCounter.getCounter1() }

				setVal(n: number) { t.instructionCounter.setCounter1(n)} 
			}
		)()
		this.counter2Interface = new (
			class extends DefaultBusInterface {
				getVal(): number { return t.instructionCounter.getCounter2() }

				setVal(n: number) { t.instructionCounter.setCounter2(n)} 
			}
		)()

	}
}