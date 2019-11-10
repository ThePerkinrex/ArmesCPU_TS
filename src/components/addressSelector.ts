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

	constructor() {
		this.components = new Array()
	}

	addComponent(startAdressSpace: number, endAddressSpace: number, addressableComponent: AddressableComponent) {
		this.components.push({startAdressSpace, endAddressSpace, addressableComponent})
	}

	set(address: number, data: number) {
		for (let component of this.components) {
			if (address >= component.startAdressSpace && address < component.endAddressSpace) {
				component.addressableComponent.set(address - component.startAdressSpace, data)
				return
			}
		}
		console.log('Address isnt matchable')
	}
	
	get(address: number): number {
		for (let component of this.components) {
			if (address >= component.startAdressSpace && address < component.endAddressSpace) {
				return component.addressableComponent.get(address - component.startAdressSpace)
			}
		}
		console.log('Address isnt matchable')
		return 0
	}

}