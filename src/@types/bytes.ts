export function numberTypeGuard(n: number, max: number = 255, min: number = 0, name: string = 'Number') {
	if (n > max) {
		throw RangeError(`${name} is too big (${n}), it must be between ${min} and ${max}`)
	} else if (n < min) {
		throw RangeError(`${name} is too small (${n}), it must be between ${min} and ${max}`)
	}
}

export function isByte(b: number) {
	numberTypeGuard(b, 255, 0, 'Byte')
}

export function numberAsHex(n: number, padding: number = 0): string {
	return n.toString(16).toUpperCase().padStart(padding, '0')
}

export function byteAsHex(b: number): string {
	isByte(b)
	return numberAsHex(b, 2)
}