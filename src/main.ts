import 'source-map-support/register'

import { Memory, CustomMemory } from './components/memory'
import { IO } from './components/io'
import { readFileSync } from 'fs'
import { MINST_LENGTH, MINST_COUNTER_LENGTH, INST_LENGHT, HLT } from './@types/instructions'



let ram = new Memory(15, readFileSync('data/ram.bin')) // 32kB - 0x0000 - 0x7FFF
let rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT, MINST_LENGTH, readFileSync('data/rom.bin'))

let io = new IO(4) // 16B - 0x8010 - 0x801F

ram.hexdump()
rom.hexdump()




