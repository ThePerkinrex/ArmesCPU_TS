import fs from 'fs'
import path from 'path'

export function isEmpty (str: string): boolean {
	return /^(?:\x1b\[\d+m\s*)*$/.test(str) // Matches an empty string, including empty ANSI escape codes
}

export function deleteFolder (folder: string): boolean {
	if (fs.existsSync(folder)) {
		fs.readdirSync(folder).forEach(file => {
			const curPath = path.join(folder, file)
			if (fs.lstatSync(curPath).isDirectory()) {
				deleteFolder(curPath)
			} else {
				fs.unlinkSync(curPath)
			}
		})
		fs.rmdirSync(folder)
		return true
	} else return false
}

export const colors = {
	red:    (text: string) => `\x1b[31m${text}\x1b[0m`,
	green:  (text: string) => `\x1b[32m${text}\x1b[0m`,
	yellow: (text: string) => `\x1b[33m${text}\x1b[0m`,
	blue:   (text: string) => `\x1b[34m${text}\x1b[0m`,
	purple: (text: string) => `\x1b[35m${text}\x1b[0m`,
	cyan:   (text: string) => `\x1b[36m${text}\x1b[0m`,
}

export class Logger {
	constructor(str: string) {
		this.log(`\n> ${str}...`)
	}

	log (str: string) {
		process.stdout.write(str)
	}

	info (str: string, arrow = '↳') {
		if (!isEmpty(str)) console.log(`  ${arrow} ${str}`)
		else console.log() // Just add newline without the arrow
	}

	end (error?: boolean, info?: string) {
		process.stdout.moveCursor(-3, 0) // Move cursor 3px to the left
		process.stdout.clearLine(1) // Clear everything in front of the cursor
		this.log(error ? colors.red(' ✘\n') : colors.green(' ✔\n'))
		if (info) this.info(info)
	}
}
