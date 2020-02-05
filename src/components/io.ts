import * as bytes from '../@types/bytes'
import { AddressableComponent } from './addressSelector'

export class IO implements AddressableComponent {
	protected data: Uint8Array
	protected addressBits: number

	protected isAddressCorrect(address: number) {
		bytes.numberTypeGuard(address, this.data.byteLength - 1, 0, 'Address')
	}

	constructor(addressBits: number) {
		this.data = new Uint8Array(Math.pow(2, addressBits))
		this.addressBits = addressBits
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

export class ConsoleIO extends IO { //  Address 0 normal IO
	set(address: number, data: number) {
		if (address == 0) {
			process.stdout.write(String.fromCharCode(data))
		}else{
			console.log(`OUT[${address.toString(16).toUpperCase().padStart((Math.pow(2, this.addressBits)-1).toString(16).length, '0')}]: ${data.toString(16).toUpperCase().padStart(2, '0')} | ${data.toString(10).padStart((Math.pow(2, this.addressBits)-1).toString(10).length, '0')} | ${String.fromCharCode(data)}`)
		}
	}
}

