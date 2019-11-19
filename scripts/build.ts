import path from 'path'
import { sync as spawnSync } from 'cross-spawn'
import { Logger, deleteFolder, colors } from './utils'

let exitCode = 0

// Clean old 'dist folder'
const cleanLogger = new Logger('Cleaning')

try {
	const deleted = deleteFolder(path.join(__dirname, '../dist/'))
	cleanLogger.end(false, deleted ? "'dist' folder deleted successfully" : "'dist' folder not present")
} catch (err) {
	exitCode = 1
	cleanLogger.end(true, `'dist' folder couldn't be deleted: ${colors.red(err.message)}`)
}

// Compile source
const buildLogger = new Logger('Building')
const tsc = spawnSync('npx', ['tsc'], { encoding: 'utf8' })

const output = tsc.stdout.split('\n')

if (tsc.status === 0) {
	buildLogger.end(false, 'Build passed')
} else {
	exitCode = 1
	buildLogger.end(true, 'Build failed')
	output.forEach(out => buildLogger.info(colors.red(out), '  ↦ '))
}

process.exit(exitCode)
