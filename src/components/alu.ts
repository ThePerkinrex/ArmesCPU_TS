import { BusIOInterface } from './bus'
import { BusRegister } from './busRegister'
import { FlagsRegister } from './flagsRegister'

export class ALU extends BusRegister {
	private accumulator: BusIOInterface
	private flagsRegister: FlagsRegister

	private addFlag = false

	constructor(accumulator: BusIOInterface, flagsRegister: FlagsRegister){
		super()
		this.accumulator = accumulator
		this.flagsRegister = flagsRegister
	}

	add() {
		this.fromBus()
		this.addFlag = true
	}

	cycle() {
		if (this.addFlag) {
			if(this.getVal() + this.accumulator.getVal() > 255) {
				this.accumulator.setVal((this.getVal() + this.accumulator.getVal()) - 256)
				this.flagsRegister.setFlag(FlagsRegister.OF)
			}else{
				if(this.getVal() + this.accumulator.getVal() === 0) this.flagsRegister.setFlag(FlagsRegister.ZE)
				this.accumulator.setVal(this.getVal() + this.accumulator.getVal())
			}
			
		}
		this.addFlag = false
		super.cycle()
	}
}