import { BusIOInterface } from './bus'
import { BusRegister } from './busRegister'
import { FlagsRegister } from './flagsRegister'

export class ALU extends BusRegister {
	private accumulator: BusIOInterface
	private flagsRegister: FlagsRegister

	private addFlag = false
	private subFlag = false
	private cmpFlag = false

	constructor(accumulator: BusIOInterface, flagsRegister: FlagsRegister){
		super()
		this.accumulator = accumulator
		this.flagsRegister = flagsRegister
	}

	add() {
		this.fromBus()
		this.addFlag = true
	}

	sub() {
		this.fromBus()
		this.subFlag = true
	}

	cmp() {
		this.fromBus()
		this.cmpFlag = true
	}

	cycle() {
		if (this.addFlag) {
			// Clear all flags set by it
			this.flagsRegister.clearFlags(FlagsRegister.OF | FlagsRegister.ZE)
			if(this.getVal() + this.accumulator.getVal() > 255) {
				this.accumulator.setVal((this.getVal() + this.accumulator.getVal()) - 256)
				this.flagsRegister.setFlag(FlagsRegister.OF)
			}else{
				if(this.getVal() + this.accumulator.getVal() === 0) this.flagsRegister.setFlag(FlagsRegister.ZE)
				this.accumulator.setVal(this.getVal() + this.accumulator.getVal())
			}
		}

		if (this.subFlag) {
			// Clear all flags set by it
			this.flagsRegister.clearFlags(FlagsRegister.UF | FlagsRegister.ZE)
			if(this.getVal() - this.accumulator.getVal() < 0) {
				this.accumulator.setVal(256 + (this.getVal() - this.accumulator.getVal()))
				this.flagsRegister.setFlag(FlagsRegister.UF)
			}else{
				if(this.getVal() - this.accumulator.getVal() === 0) this.flagsRegister.setFlag(FlagsRegister.ZE)
				this.accumulator.setVal(this.getVal() - this.accumulator.getVal())
			}
		}

		if (this.cmpFlag) {
			// Clear all flags set by it
			this.flagsRegister.clearFlags(FlagsRegister.GT | FlagsRegister.EQ | FlagsRegister.ST)
			if(this.getVal() < this.accumulator.getVal()) {
				this.flagsRegister.setFlag(FlagsRegister.ST)
			}else if(this.getVal() === this.accumulator.getVal()) {
				this.flagsRegister.setFlag(FlagsRegister.EQ)
			}else if(this.getVal() > this.accumulator.getVal()) {
				this.flagsRegister.setFlag(FlagsRegister.GT)
			}
		}

		this.addFlag = false
		this.subFlag = false
		this.cmpFlag = false
		super.cycle()
	}
}