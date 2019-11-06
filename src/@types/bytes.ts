export function numberTypeGuard (n: number, max: number = 255, min: number = 0, name: string = 'Number') {
	if (n > max) {
		throw RangeError(`${name} is too big, it must be between ${min} and ${max}`)
	} else if (n < min) {
		throw RangeError(`${name} is too small, it must be between ${min} and ${max}`)
	}
}

export function isByte (b: number) {
	numberTypeGuard(b, 255, 0, 'Byte')
}