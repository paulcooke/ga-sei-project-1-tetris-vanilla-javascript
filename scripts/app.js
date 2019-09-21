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

  // this function chooses the shape to use each time and reassigns 'currentShape' to be the newly generated one. start location can be altered by updating these
  function makeShape() {
    const tShape = [10, 11, 12, 21]
    const zShape = [11, 12, 20, 21]
    const sShape = [10, 11, 21, 22]
    const jShape = [1, 11, 20, 21]
    const lShape = [1, 11, 21, 22]
    const iShape = [1, 11, 21, 31]
    const oShape = [10, 11, 20, 21]
    shapes.push(tShape, zShape, sShape, jShape, lShape, iShape, oShape)
    const shapeColors = ['purple', 'red', 'green', 'blue', 'orange', 'cyan', 'rgb(243, 229, 79)']
    const colorMatch = Math.floor(Math.random() * shapes.length) // this variable makes sure each block is always the correct color, instead of calling Math.random twice
    currentShape = shapes[colorMatch]
    currentShapeColor = shapeColors[colorMatch]
  } 

  // this function spawns a new shape at the top of the board, at index contaied in global variable 'startLocation'
  function spawnShape () {
    makeShape()
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
    })
  }


  // these functions check movement is possible before movement is attempted. they are called from the switch statement in the event listener
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

  // this is the keyup event listener that is waiting for control input and deciding what to do with it
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
  console.log(currentShape)
  spawnShape()
  //console.log(activeShapeLocation)
  cells[75].classList.add('occupied-block')

})


// Collision detection for downward movement happens in the down section of the move checks
// need to put newly settled blocks in the settled blocks array, which must have settled class