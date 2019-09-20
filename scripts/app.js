document.addEventListener('DOMContentLoaded', () => {
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  let activeShapeLocation = []
  const startLocation = 4
  const shapes = []
  let currentShape = 0
  const directionKeys = [37,38,39,40]
  let currentShapeColor = '' // not in use yet

  // this function makes the game board using the sizes specified at the start
  function makeBoard () {
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  // this function chooses the shape to use each time and reassigns current shape
  function makeShape() {
    const tShape = [10, 11, 12, 21]
    const zShape = [11, 12, 20, 21]
    const sShape = [10, 11, 21, 22]
    const jShape = [1, 11, 20, 21]
    const lShape = [1, 11, 21, 22]
    const iShape = [1, 11, 21, 31]
    const oShape = [10, 11, 20, 21]
    shapes.push(tShape, zShape, sShape, jShape, lShape, iShape, oShape)
    const shapeColors = ['purple', 'red', 'green', 'blue', 'orange', 'cyan', 'yellow']
    console.log('shapeColor', shapeColors[3])
    const colorMatch = Math.floor(Math.random() * shapes.length)
    currentShape = shapes[colorMatch]
    currentShapeColor = shapeColors[colorMatch]
    console.log('current shape color:', currentShapeColor)
  }
  console.log(shapes)  

  // this function spawns a new shape at the top of the board, on location 14
  function spawnShape () {
    activeShapeLocation = currentShape.map(x => {
      cells[x + startLocation].classList.add('active-shape')
      cells[x + startLocation].style.backgroundColor = currentShapeColor
      return x + startLocation
    })
  }

  // this function removes the class 'active-shape' from the divs currently in the active shape location
  function clearShape(shapeArrayOut) {
    shapeArrayOut.forEach(idx => {
      cells[idx].classList.remove('active-shape')
      cells[idx].style.backgroundColor = 'white'
    })
  }

  function drawShape(shapeArrayIn) {
    shapeArrayIn.forEach(idx => {
      cells[idx].classList.add('active-shape')
      cells[idx].style.backgroundColor = currentShapeColor
      console.log('second', currentShapeColor)
    })
  }

  function rightCheck(array) {
    return array.every(pos => pos % width < width - 1)
  }

  function leftCheck(array) {
    return array.every(pos => pos % width > 0)
  }

  function upCheck(array) {
    return array.every(pos => Math.floor(pos / width) > 0)
  }

  function downCheck(array) {
    return array.every(pos => Math.floor(pos / width) < height - 1)
  }

  // this is the evenet listener that is waiting for keyup
  document.addEventListener('keyup', e => {
    
    if (directionKeys.includes(e.keyCode)) {
      clearShape(activeShapeLocation)
      console.log(activeShapeLocation)

      activeShapeLocation = activeShapeLocation.map(idx => {        
        switch (e.keyCode) {
          case 37: if (leftCheck(activeShapeLocation)) idx -= 1       // left 
            break
          case 38: if (upCheck(activeShapeLocation)) idx -= width     // up
            break
          case 39: if (rightCheck(activeShapeLocation)) idx += 1      // right
            break
          case 40: if (downCheck(activeShapeLocation)) idx += width   // down
            break
        }
        return idx
      })
      console.log('new shape location', activeShapeLocation)
      drawShape(activeShapeLocation)
      
    }
  })

  makeBoard()
  makeShape()
  console.log(currentShape)
  spawnShape()
  //console.log(activeShapeLocation)

})