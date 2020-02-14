export interface BusIOInterface {
	getVal(): number
	setVal(n: number): void
	cycle(): void
	ontoBus(): void
	fromBus(): void

	isOntoBus(): boolean
	isFromBus(): boolean
}


export class Bus {
	private val: number
	private connections: BusIOInterface[]

	constructor() {
		this.val = 0
		this.connections = new Array()
	}

	addBusIO(b: BusIOInterface) {
		this.connections.push(b)
	}

	cycle() {
		for(let conn of this.connections) {
			if(conn.isOntoBus()) {
				this.val |= conn.getVal()
			}
		}
		// console.log('#',this.val.toString(16).padEnd(2,'0'))
		for(let conn of this.connections) {
			if(conn.isFromBus()) {
				conn.setVal(this.val)
			}
		}
		
		this.val = 0
		for(let conn of this.connections) {
			conn.cycle()
		}
	}
}

export abstract class DefaultBusInterface implements BusIOInterface {
	private ontoBusBool: boolean
	private fromBusBool: boolean

	abstract getVal(): number

	abstract setVal(n: number): void

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