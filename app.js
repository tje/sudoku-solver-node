const fs = require('fs')

const puzzles = [
  fs.readFileSync('./puzzles/1.txt', { encoding: 'utf8' }),
  fs.readFileSync('./puzzles/2.txt', { encoding: 'utf8' }),
  fs.readFileSync('./puzzles/3.txt', { encoding: 'utf8' })
]

const getXYRegion = (x, y) => {
  return Math.ceil(x / 3) + (Math.floor((y - 1) / 3) * 3)
}

const parsePuzzle = (blob) => {
  const lines = blob.split('\n')
  const cells = []
  for (let y = 1; y < 10; y++) {
    for (let x = 1; x < 10; x++) {
      let value = lines[y - 1].substr(x - 1, 1).trim() || null
      if (value !== null) {
        value = Number(value)
      }
      const region = getXYRegion(x, y)
      cells.push({
        x,
        y,
        region,
        value
      })
    }
  }
  return cells
}

const getPossibleValues = (cells, x, y) => {
  const region = getXYRegion(x, y)

  const reserved = cells
    .filter((cell) => cell.x === x || cell.y === y || cell.region === region)
    .reduce((v, cell) => (cell.value && !v.includes(cell.value)) ? v.concat(Number(cell.value)) : v, [])
  // const cellsInRow = cells.filter((cell) => cell.x === x)
  // const cellsInColumn = cells.filter((cell) => cell.y === y)
  // const cellsInRegion = cells.filter((cell) => cell.region === region)

  return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    .filter((v) => !reserved.includes(v))
}

const solve = (cells) => {
  const cell = cells.find((cell) => cell.value === null)
  if (!cell) {
    return cells
  }

  const possibilities = getPossibleValues(cells, cell.x, cell.y)
  if (possibilities.length === 0) {
    return false
  }

  const copy = cells.slice(0)
  const idx = copy.indexOf(cell)
  for (const value of possibilities) {
    copy[idx] = {
      ...cell,
      value
    }
    const res = solve(copy)
    if (res !== false) {
      return res
    }
  }
  return false
}

const printMap = (cells, spaced = true) => {
  let out = ''
  for (let y = 1; y < 10; y++) {
    for (let x = 1; x < 10; x++) {
      const cell = cells.find((cell) => cell.x === x && cell.y === y)
      out += cell.value || ' '

      if (spaced && x % 3 === 0 && x < 9) {
        out += ' '
      }
    }
    out += '\n'
    if (spaced && y % 3 === 0 && y < 9) {
      out += '\n'
    }
  }
  console.log(out)
}

const start = Date.now()
for (const puzzle of puzzles) {
  const puzzleStart = Date.now()
  const cells = parsePuzzle(puzzle)
  console.log('Puzzle:')
  printMap(cells)

  const solution = solve(cells)
  console.log('\nSolution:')
  printMap(solution)
  console.log(`Took ${Date.now() - puzzleStart}ms to solve`)
}

console.log(`\nSolved all puzzles after ${Date.now() - start}ms`)
