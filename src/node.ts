import 'source-map-support/register'

import { CPU } from './cpu'
import { readFileSync } from 'fs'

let cpu = new CPU(readFileSync('data/ram.bin'), readFileSync('data/rom.bin'))

cpu.run()