import { DefaultBusInterface } from './bus'

export class Stack extends DefaultBusInterface {
    private stack: number[]

    constructor(){
        super()
        this.stack = []
    }

    getVal(): number {
        let val = this.stack.pop()
        console.log('Popped', val)
        if(val !== undefined)
            return val
        else
            return 0
    }
    
    setVal(n: number): void {
        this.stack.push(n)
        console.log('Pushed', n)
    }

}
