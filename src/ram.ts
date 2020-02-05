import 'source-map-support/register'

import { createBinFile } from './utils/bin'
import { compileAssembly } from './asm'
import { readFileSync } from 'fs'

console.log('\n> Building RAM...')

let ram = compileAssembly(readFileSync('data/code.asm').toString('utf8'))

ram.hexdump()

createBinFile(ram, 'ram')
