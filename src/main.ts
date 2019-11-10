import 'source-map-support/register'

import { Memory, CustomMemory } from './components/memory'
import { ConsoleIO } from './components/io'
import { readFileSync } from 'fs'
import { MINST_LENGTH, MINST_COUNTER_LENGTH, INST_LENGHT } from './@types/instructions'
import { AddressSelector, Bus_AddressSelector_Interface } from './components/addressSelector' // eslint-disable-line @typescript-eslint/camelcase
import { Bus } from './components/bus'

/* Address sections (16bit/2Byte address)
* 0x0000 - 0x7FFF: 32kB - RAM

? 0x8000 - 0x800F: 16B  - General Purpose Registers
* 0x8010 - 0x801F: 16B  - Console I/O
? 0x8020 - 0x803F: 32B  - I/O
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

let ram = new Memory(15, readFileSync('data/ram.bin')) // 32kB - 0x0000 - 0x7FFF
let rom = new CustomMemory(MINST_COUNTER_LENGTH + INST_LENGHT, MINST_LENGTH, readFileSync('data/rom.bin'))

let io = new ConsoleIO(4) // 16B - 0x8010 - 0x801F

ram.hexdump()
rom.hexdump()

let addressSelector = new AddressSelector(16)

addressSelector.addComponent(0x0000, 0x7FFF, ram)
addressSelector.addComponent(0x8010, 0x801F, io)

let addressSelectorInterface = new Bus_AddressSelector_Interface(addressSelector)

let bus = new Bus()

bus.addBusIO(addressSelectorInterface.address1Interface)
bus.addBusIO(addressSelectorInterface.address2Interface)
bus.addBusIO(addressSelectorInterface.dataInterface)

// Hello > 72 101 108 108 111 (ASCII)

addressSelectorInterface.address1Interface.setVal(0x80) // Set the ConsoleIO first address (0x8010)
addressSelectorInterface.address2Interface.setVal(0x10)

addressSelectorInterface.dataInterface.setVal(72) // H
addressSelectorInterface.dataInterface.setVal(101) // e
addressSelectorInterface.dataInterface.setVal(108) // l
addressSelectorInterface.dataInterface.setVal(108) // l
addressSelectorInterface.dataInterface.setVal(111) // o
