import * as bytes from './bytes'

export class Memory {
	private data: Int8Array
	private isAddressCorrect (address: number) {
		bytes.numberTypeGuard(address, this.data.byteLength-1, 0, 'Address')
	}

	constructor (addressBits: number) {
		this.data = new Int8Array(Math.pow(2, addressBits))
	}

	get (address: number): number {
		this.isAddressCorrect(address)
		return this.data[address]
	}

	set (address: number, data: number) {
		this.isAddressCorrect(address)
		bytes.isByte(data)
		this.data[address] = data
	}

	hexdump () {
		let address = 0
		console.log(``)
	}
}
