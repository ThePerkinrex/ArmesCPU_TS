import { BusIOInterface } from './bus'

export class BusRegister implements BusIOInterface {
	private ontoBusBool: boolean = false
	private fromBusBool: boolean = false
	private val: number = 0

	getVal(): number {
		//console.log('rget', this.val.toString(16).padStart(2,'0'))
		return this.val
	}

	setVal(n: number) {
		//console.log('rset', this.val.toString(16).padStart(2,'0'), '->', n.toString(16).padStart(2,'0'))
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