import * as bytes from './bytes'

export interface IMemory {
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

	constructor(addressBits: number) {
		this.data = new Uint8Array(Math.pow(2, addressBits))
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

	constructor(addressBits: number, dataBits: number) {
		this.dataBits = dataBits
		this.data = Array.apply(null, Array<number>(Math.pow(2, addressBits))).map(function () { return 0 })
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
		return Buffer.from(this.data)
	}
}
