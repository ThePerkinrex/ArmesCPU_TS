import { BusIOInterface } from './bus'
import { BusRegister } from './busRegister'

export class ALU extends BusRegister {
	private accumulator: BusIOInterface
	private addFlag = false

	constructor(accumulator: BusIOInterface){
		super()
		this.accumulator = accumulator
	}

	add() {
		this.fromBus()
		this.addFlag = true
	}

	cycle() {
		if (this.addFlag) {
			this.accumulator.setVal(this.getVal() + this.accumulator.getVal())
		}
		this.addFlag = false
		super.cycle()
	}
}