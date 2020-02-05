:IOPORT = 0x8010

#x = 1
#y = 0

LDA #x
:loop STA #y
ADD #x
MOV #y #x
STA @IOPORT
JOF @halt
JMP @loop
:halt HALT
