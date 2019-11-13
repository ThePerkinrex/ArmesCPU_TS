export class FlagsRegister {
	public static EQ = 1 << 0
	public static GT = 1 << 1
	public static ST = 1 << 2

	public static OF = 1 << 3
	public static UF = 1 << 4
	public static ZE = 1 << 5

	public static flagNumber = 6

	private val = 0

	private lastLoop = 0
	private thisLoop = 0

	public getVal(): number {
		return this.val
	}

	public setFlag(flag: number) {
		if (flag > (1<<(FlagsRegister.flagNumber-1))) {
			throw new Error('Flag too big: ' + flag.toString(2))
		}
		this.val |= flag
		this.thisLoop |= flag
	}

	public cycle() {
		this.val &= ~this.lastLoop // Clear lastLoop's bits

		this.lastLoop = this.thisLoop
	}
}
