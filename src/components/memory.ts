import * as bytes from '../@types/bytes'
import { AddressableComponent } from './addressSelector'

export interface IMemory extends AddressableComponent {
	get(address: number): number,
	set(address: number, data: number): void,
	hexdump(): void,
	buffer(): Buffer
}

export class Memory implements IMemory {
	private data: Uint8Array
	private isAddressCorrect(address: number) {
		bytes.numberTypeGuard(address, this.data.byteLength - 1, 0, 'Address')
	}

	constructor(addressBits: number, buffer?: Buffer) {
		this.data = new Uint8Array(Math.pow(2, addressBits))
		if (buffer !== undefined) {
			this.data = new Uint8Array(buffer)
		}
	}

	get(address: number): number {
		this.isAddressCorrect(address)
		return this.data[address]
	}

	set(address: number, data: number) {
		this.isAddressCorrect(address)
		bytes.isByte(data)
		this.data[address] = data
	}

	hexdump() {
		const columns = 32
		let lastRow = Array.apply(null, Array(columns)).map(function () { })
		let lastEqualRows = false
		for (let address = 0; address < this.data.byteLength; address += columns) {
			let end = Math.min(address + columns - 1, this.data.byteLength - 1)
			let equalRows = true
			let thisRow = this.data.slice(address, end)
			for (let i = 0; i <= end - address; i++) {
				if (lastRow[i] !== thisRow[i]) {
					equalRows = false
					break
				}
			}
			if (!equalRows) {
				let data = ''
				for (let i = 0; i < columns; i++) {
					if (i % 8 == 0) {
						data += ' '
					}
					data += bytes.byteAsHex(this.data[address + i]) + ' '
				}
				let addressAsHex = bytes.numberAsHex(address, bytes.numberAsHex(this.data.byteLength).length)
				console.log(`[${addressAsHex}] ${data}`)
			} else if (!lastEqualRows && equalRows) {
				console.log('...')
			}
			lastRow = thisRow
			lastEqualRows = equalRows
		}
		let addressAsHex = bytes.numberAsHex(this.data.byteLength)
		console.log(`[${addressAsHex}]`)
	}

	buffer(): Buffer {
		return Buffer.from(this.data.buffer)
	}
}

export class CustomMemory implements IMemory {
	private data: Array<number>
	private dataBits: number

	private isAddressCorrect(address: number) {
		bytes.numberTypeGuard(address, this.data.length - 1, 0, 'Address')
	}

	private isDataCorrect(data: number) {
		bytes.numberTypeGuard(data, Math.pow(2, this.dataBits), 0, 'Data')
	}

	constructor(addressBits: number, dataBits: number, buffer?: Buffer) {
		if (dataBits / 8 !== Math.floor(dataBits / 8)) {
			throw RangeError('dataBits must a multiple of 8')
		}
		this.dataBits = dataBits
		this.data = Array.apply(null, Array<number>(Math.pow(2, addressBits))).map(function () { return 0 })
		if (buffer !== undefined) {
			let newAddress = 0
			for (let address = 0; address < buffer.length; newAddress++) {
				let n = 0
				// convert the data from bytes
				for (let i = (dataBits / 8) - 1; i >= 0; i--) {
					n += buffer[address] * Math.pow(0x100, i)
					//console.log('#', i, newAddress.toString(16), buffer[address].toString(16), n.toString(16))
					address++
				}
				this.data[newAddress] = n
				//console.log(newAddress.toString(16), n.toString(16))
			}
		}
	}

	get(address: number): number {
		this.isAddressCorrect(address)
		return this.data[address]
	}

	set(address: number, data: number) {
		this.isAddressCorrect(address)
		this.isDataCorrect(data)
		this.data[address] = data
	}

	hexdump() {
		const columns = 16
		let lastRow = Array.apply(null, Array(columns)).map(function () { })
		let lastEqualRows = false
		for (let address = 0; address < this.data.length; address += columns) {
			let end = Math.min(address + columns - 1, this.data.length - 1)
			let equalRows = true
			let thisRow = this.data.slice(address, end)
			for (let i = 0; i <= end - address; i++) {
				if (lastRow[i] !== thisRow[i]) {
					equalRows = false
					break
				}
			}
			if (!equalRows) {
				let data = ''
				for (let i = 0; i < columns; i++) {
					if (i % 8 == 0) {
						data += ' '
					}
					data += bytes.numberAsHex(this.data[address + i], bytes.numberAsHex(Math.pow(2, this.dataBits)).length) + ' '
				}
				let addressAsHex = bytes.numberAsHex(address, bytes.numberAsHex(this.data.length).length)
				console.log(`[${addressAsHex}] ${data}`)
			} else if (!lastEqualRows && equalRows) {
				console.log('...')
			}
			lastRow = thisRow
			lastEqualRows = equalRows
		}
		let addressAsHex = bytes.numberAsHex(this.data.length)
		console.log(`[${addressAsHex}]`)
	}

	buffer(): Buffer {
		let buffer = Buffer.alloc(this.data.length * this.dataBits / 8)
		let bufferAddress = 0x00
		for (let address = 0; address < this.data.length; address++) {
			// split the data into bytes
			for (let i = (this.dataBits / 8) - 1; i >= 0; i--) {
				buffer[bufferAddress] = (this.data[address] & (0xFF * Math.pow(0x100, i))) >> (8*i)
				bufferAddress++
			}
		}
		return buffer
	}
}
