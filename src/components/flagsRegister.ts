export class FlagsRegister {
	public static EQ = 1 << 0
	public static GT = 1 << 1
	public static ST = 1 << 2

	public static OF = 1 << 3
	public static UF = 1 << 4
	public static ZE = 1 << 5

	public static flagNumber = 6

	private val = 0

	public getVal(): number {
		return this.val
	}

	public setFlag(flag: number) {
		if (flag > (1<<(FlagsRegister.flagNumber-1))) {
			throw new Error('Flag too big: ' + flag.toString(2))
		}
		this.val |= flag
	}

	public clearFlags(flag: number) {
		this.val &= ((~flag) & (Math.pow(2, FlagsRegister.flagNumber)-1))
	}
}
