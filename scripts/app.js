document.addEventListener('DOMContentLoaded', () => {
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  let activeShapeLocation = []
  const startLocation = 4
  let currentShape = 0
  const directionKeys = [37, 38, 39, 40]
  let currentShapeColor = ''
  const lastRowStartCell = (width * height) - width  // using formula to get cell numbers for last row in the game board
  const gameOverRowStartCell = 30
  let gameOver = false

  // experimental additions - new variables go here in testing and moved up once in use
  let tickLength = 1000

  // ---------- RUN GAME FUNCTIONS ----------

  function playGame() {
    makeBoard()
    spawnShape()
  }
  
  // ---------- GAME SETUP FUNCTIONS ----------
  
  // this function makes the game board using the sizes specified at the start
  function makeBoard () {
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }
    for (let j = width * 3; j < width * 4; j++) {
      cells[j].style.borderBottom = '1px solid grey'
      // cells[j].style.backgroundColor = 'grey' - this doesn't work because it gets overwritten by the clear function once the shape moves
      // maybe make background nul and put another div behind it?
    }
  }

  // this function chooses the shape to use each time and reassigns 'currentShape' to be the newly generated one. start location can be altered by updating these
  function makeShape() {
    const shapes = []
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

  // ----------- SPAWNING, DRAWING AND CLEARING FUNCTIONS ----------

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
  function clearShape(shapeArrayOut, classToRemove) {
    shapeArrayOut.forEach(idx => {
      cells[idx].classList.remove(classToRemove)
      cells[idx].style.backgroundColor = null // ??? how to get it to revert to listening to the css for styling?
    })
  }

  function drawShape(shapeArrayIn, classToAdd) {
    shapeArrayIn.forEach(idx => {
      cells[idx].classList.add(classToAdd)
      cells[idx].style.backgroundColor = currentShapeColor
    })
  }

  // ---------- CHECK FUNCTIONS ----------

  function rightCheck(array) {
    return array.every(pos => pos % width < width - 1 && !cells[pos + 1].classList.contains('occupied-block'))
  }

  function leftCheck(array) {
    return array.every(pos => pos % width > 0 && !cells[pos - 1].classList.contains('occupied-block'))
  }

  function upCheck(array) {
    return array.every(pos => Math.floor(pos / width  && !cells[pos - 10].classList.contains('occupied-block')) > 0)
  }

  function downCheck(array) {
    return array.every(pos => Math.floor(pos / width) < height - 1  && !cells[pos + 10].classList.contains('occupied-block'))
  }

  function checkLastRow(array) {
    return array.some(block => block >= lastRowStartCell)
  }

  function stackCheck(array) {
    return array.some( cellIdx => {
      console.log(cellIdx + 10)
      return cells[cellIdx + 10].classList.contains('occupied-block')
    })
  }

  function checkGameOver() {
    const checkArray = []
    for (let i = gameOverRowStartCell; i < gameOverRowStartCell + width; i++) {
      checkArray.push(i)
    }
    // console.log('is gameOver?', checkArray.some(idx => cells[idx].classList.contains('occupied-block')))
    gameOver = checkArray.some(idx => cells[idx].classList.contains('occupied-block'))
  }

  function lockCheck(array) {
    // the first part of the below checks if any of the shape is on the last row, and then stops it and flashes it to let the user know that it's locked. then it spawns another shape
    if (checkLastRow(array) === true || stackCheck(array) === true) {
      // remove class 'active-shape'
      clearShape(array, 'active-shape')
      // redraw shape in same location but with new class 'occupied-block'
      drawShape(array, 'occupied-block')
      checkGameOver()
      if (gameOver) {
        alert('game over! you are not as good at tetris as Moni!')
      }
      // spawn a new shape, which makes all the controls apply to the new one and leaves the old (now 'occupied') one locked
      spawnShape()       
    } else {
      drawShape(array, 'active-shape')
    }
  }

  // ---------- EVENT LISTENERS ----------

  // const startButton = document.querySelector('#start-button')
  // startButton.addEventListener('click', () => playGame())

  // this is the keyup event listener that is waiting for control input and deciding what to do with it
  document.addEventListener('keyup', e => {
    
    if (e.keyCode === 87) {
      console.log('w was pressed')
    }


    if (directionKeys.includes(e.keyCode)) {
      clearShape(activeShapeLocation, 'active-shape')
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
      lockCheck(activeShapeLocation)
      console.log(activeShapeLocation.some(block => block >= lastRowStartCell)) // checks if any part of the active shape is in the final row
    }

    
    console.log('new shape location', activeShapeLocation)   
  }) // close event listener for keyup


  // ----------- CODE THAT RUNS! ----------

  //console.log(activeShapeLocation)
  playGame()

  
}) // close DOM event listener

