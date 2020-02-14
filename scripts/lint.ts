import { spawnSync } from 'child_process'
import { Logger, colors } from './utils'

let exitCode = 0

// Limt source code
const buildLogger = new Logger('Linting')
const eslint = spawnSync('npx', ['eslint', "--ignore-pattern 'node_modules/*'", ...process.argv], { encoding: 'utf8' })

const output = eslint.stdout.split('\n')

if (eslint.status === 0) {
	buildLogger.end(false, 'Linting passed\n')
} else {
	exitCode = 1
	buildLogger.end(true, 'Linting failed')
	output.forEach(out => buildLogger.info(colors.red(out), '  ↦ '))
}

process.exit(exitCode)
