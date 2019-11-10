import * as bytes from '../@types/bytes'
import { AddressableComponent } from './addressSelector'

export class IO implements AddressableComponent {
	private data: Uint8Array

	private isAddressCorrect(address: number) {
		bytes.numberTypeGuard(address, this.data.byteLength - 1, 0, 'Address')
	}

	constructor(addressBits: number) {
		this.data = new Uint8Array(Math.pow(2, addressBits))
	}

	set(address: number, data: number) {
		this.isAddressCorrect(address)
		bytes.isByte(data)
		this.data[address] = data
	}

	get(address: number): number {
		this.isAddressCorrect(address)
		return this.data[address]
	}
}

