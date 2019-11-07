import 'source-map-support/register'

import { Memory } from './@types/memory'
import { createBinFile } from './bin'

/* Address sections (16bit/2Bytes)
* 0x0000 - 0x7FFF: 32kB - RAM

* 0x8000 - 0x800F: 16B  - General Purpose Registers
* 0x8010 - 0x801F: 16B  - I/O
* 0x8020 - 0x803F: 32B  - I/O
-- Almost 32kB empty (32kB - 64B) -- Divided into standard length sections --
  0x8040 - 0x807F: 64B  -
  0x8080 - 0x80FF: 128B -
  0x8100 - 0x81FF: 256B -
  0x8200 - 0x83FF: 512B -
  0x8400 - 0x87FF: 1kB  -
  0x8800 - 0x8FFF: 2kB  -
  0x9000 - 0x9FFF: 4kB  -
  0xA000 - 0xBFFF: 8kB  -
  0xC000 - 0xFFFF: 16kB -
*/

let ram = new Memory(15) // first bit to select ram or another thing
for (let i = 0x00; i < 0x8000; i++) { // Empty it
	ram.set(i, 0x00)
}

ram.hexdump()

createBinFile(ram, 'ram')
