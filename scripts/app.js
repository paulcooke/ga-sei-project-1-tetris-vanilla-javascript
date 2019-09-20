document.addEventListener('DOMContentLoaded', () => {
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  let activeShapeLocation = []
  const startLocation = 14
  const shapes = []
  let currentShape = 0
  const directionKeys = [37,38,39,40]
  
  // this function makes the game board using the sizes specified at the start
  function makeBoard () {
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  // this function chooses the shape to use each time and reassigns current shape
  function chooseShape() {
    function makeShapes() {
      const tShape = [0, 1, 2, 11]
      shapes.push(tShape)
    }
    makeShapes()
    currentShape = shapes[0]
  }
    
  // this function spawns a new shape at the top of the board, on location 14
  function spawnShape () {
    activeShapeLocation = currentShape.map(x => {
      cells[x + startLocation].classList.add('active-shape')
      return x + startLocation
    })
  }

  // this function removes the class 'active-shape' from the divs currently in the active shape location
  function clearShape(shapeArrayOut) {
    shapeArrayOut.forEach(idx => {
      cells[idx].classList.remove('active-shape')
    })
  }

  function drawShape(shapeArrayIn) {
    shapeArrayIn.forEach(idx => {
      cells[idx].classList.add('active-shape')
    })
  }

  function rightCheck(array) {
    return activeShapeLocation.every(pos => pos % width < width - 1)
  }

  function leftCheck(array) {
    return activeShapeLocation.every(pos => pos % width > 0)
  }

  function upCheck(array) {
    return activeShapeLocation.every(pos => Math.floor(pos / width) > 0)
  }

  function downCheck(array) {
    return activeShapeLocation.every(pos => Math.floor(pos / width) < height - 1)
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
  chooseShape()
  console.log(currentShape)
  spawnShape()
  // document.querySelectorAll('div')[1].classList.add('green')
  // document.querySelectorAll('div')[239].classList.add('green')
  //console.log(activeShapeLocation)

})