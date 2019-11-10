import { IMemory } from '../components/memory'
import { writeFileSync } from 'fs'

export function createBinFile (mem: IMemory, name: string) {
	writeFileSync(`data/${name}.bin`, mem.buffer())
}
