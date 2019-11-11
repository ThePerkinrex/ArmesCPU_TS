import { BusIOInterface } from './bus'
import { DEBUG } from '../cpu'

export class BusRegister implements BusIOInterface {
	private ontoBusBool: boolean = false
	private fromBusBool: boolean = false
	private val: number = 0

	getVal(): number {
		if (DEBUG) console.log('rget', this.val.toString(16).padStart(2,'0'))
		return this.val
	}

	setVal(n: number) {
		if (DEBUG) console.log('rset', this.val.toString(16).padStart(2,'0'), '->', n.toString(16).padStart(2,'0'))
		this.val = n
	}

	cycle() {
		this.ontoBusBool = false
		this.fromBusBool = false
	}

	ontoBus(): void {
		this.ontoBusBool = true
	}

	fromBus(): void {
		this.fromBusBool = true
	}

	isOntoBus(): boolean {
		return this.ontoBusBool
	}

	isFromBus(): boolean {
		return this.fromBusBool
	}
}