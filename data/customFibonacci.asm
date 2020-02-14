:IOPORT = 0x8011
:DEBUGPORT = 0x8012

#x = 1
#y = 0

#idx = 0
#one = 1
#iterations = 20

#o = 'o'

#accumulator

LDA #x
:loop STA #y
ADD #x
JOF @overflow
:retOverflow MOV #y #x
STA @IOPORT
STA #accumulator
LDA #idx
;STA @DEBUGPORT
CMP #iterations
JST @halt
ADD #one
STA #idx
LDA #accumulator
JMP @loop
:halt LDA #idx
STA @DEBUGPORT
HALT

:overflow STA #accumulator
LDA #o
STA @DEBUGPORT
LDA #accumulator
JMP @retOverflow
