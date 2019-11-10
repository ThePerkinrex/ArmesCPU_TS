import { BusIOInterface } from './bus'

export interface AddressableComponent {
	set(address: number, data: number): void
	get(address: number): number
}

interface Component {
	startAdressSpace: number,
	endAddressSpace: number,
	addressableComponent: AddressableComponent
}

export class AddressSelector implements AddressableComponent {
	private components: Component[]
	private addressBits: number

	constructor(addressBits: number) {
		if (addressBits !== 16) {
			throw RangeError('addressBits must be 16')
		}
		this.components = new Array()
		this.addressBits = addressBits
	}

	addComponent(startAdressSpace: number, endAddressSpace: number, addressableComponent: AddressableComponent) {
		if(startAdressSpace >= 0 && startAdressSpace < endAddressSpace && endAddressSpace < Math.pow(2, this.addressBits)) {
			this.components.push({startAdressSpace, endAddressSpace, addressableComponent})
		} else {
			throw RangeError('startAdressSpace and/or endAddressSpace are out of range')
		}
	}

	set(address: number, data: number) {
		for (let component of this.components) {
			if (address >= component.startAdressSpace && address <= component.endAddressSpace) {
				component.addressableComponent.set(address - component.startAdressSpace, data)
				return
			}
		}
		console.log('Address isnt matchable')
	}
	
	get(address: number): number {
		for (let component of this.components) {
			if (address >= component.startAdressSpace && address <= component.endAddressSpace) {
				return component.addressableComponent.get(address - component.startAdressSpace)
			}
		}
		console.log('Address isnt matchable')
		return 0
	}

}

abstract class DefaultBusInterface implements BusIOInterface {
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

export class Bus_AddressSelector_Interface {
	public address1Interface: BusIOInterface
	public address2Interface: BusIOInterface
	public dataInterface: BusIOInterface

	private addressSelector: AddressSelector

	

	constructor(addressSelector: AddressSelector) {
		this.addressSelector = addressSelector

		const AddressInterface = (class extends DefaultBusInterface {
			val: number = 0

			getVal(): number { return this.val }
	
			setVal(n: number) { this.val = n }
		})

		this.address1Interface = new AddressInterface()
		this.address2Interface = new AddressInterface()

		let t = this

		this.dataInterface = new (class extends DefaultBusInterface {
			private calcAddress(): number {
				return (t.address1Interface.getVal() << 8) + t.address2Interface.getVal()
			}

			getVal(): number {
				return t.addressSelector.get(this.calcAddress())
			}
	
			setVal(n: number) {
				t.addressSelector.set(this.calcAddress(), n)
			}
		})()

	}
}