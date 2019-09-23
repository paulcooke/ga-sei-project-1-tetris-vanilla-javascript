document.addEventListener('DOMContentLoaded', () => {
  // game board variables
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  const startLocation = 4

  // check vairables
  const lastRowStartCell = (width * height) - width  // using formula to get cell numbers for last row in the game board
  const gameOverRowStartCell = 30
  let gameOver = false
  
  // shape variables
  let activeShapeLocation = []
  let currentShape = {}
  
  // move variables
  const directionKeys = [37, 38, 39, 40]
  let direction

  // rotation variables
  const checkArrayGridMaker = [0, 1, 2, width, width + 1, width + 2, (2 * width), (2 * width) + 1, (2 * width) + 2]
  const fiveShapes = ['tShape', 'zShape', 'sShape', 'jShape', 'lShape']
  let potentialCenterIdx
  let iRotationPosition
  let tempIRotationPosition

  // experimental additions - new variables go here in testing and moved up once in use
  // let tickLength = 1000

  // ---------- RUN GAME FUNCTIONS ---------- //

  function playGame() {
    makeBoard()
    spawnShape()
  }
  
  // ---------- GAME SETUP FUNCTIONS ---------- //
  
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
    // centerIdx properties will let us map a 3x3 grid around each shape when we try to rotate them. they line up with the shapes array
    const shapes = [ 
      { name: 'tShape', shapeStartAddress: [10, 19, 20, 21], color: 'purple', centerIdx: 2 },
      { name: 'zShape', shapeStartAddress: [9, 10, 20, 21], color: 'red', centerIdx: 2 },
      { name: 'sShape', shapeStartAddress: [10, 11, 19, 20], color: 'green', centerIdx: 3 },
      { name: 'jShape', shapeStartAddress: [9, 19, 20, 21], color: 'blue', centerIdx: 2 },
      { name: 'lShape', shapeStartAddress: [11, 19, 20, 21], color: 'orange', centerIdx: 2 },
      { name: 'iShape', shapeStartAddress: [19, 20, 21, 22], color: 'cyan', centerIdx: 1 },
      { name: 'oShape', shapeStartAddress: [10, 11, 20, 21], color: 'rgb(243, 229, 79)', centerIdx: 1 }
    ]
    const colorMatch = Math.floor(Math.random() * shapes.length) // this variable makes sure each block is always the correct color, instead of calling Math.random twice
    currentShape = shapes[colorMatch]
  } 

  // ----------- SPAWNING, DRAWING AND CLEARING FUNCTIONS ---------- //

  // this function spawns a new shape at the top of the board, at index contaied in global variable 'startLocation'
  function spawnShape () {
    makeShape()
    if (currentShape.name === 'iShape') iRotationPosition = 1 
    console.log(iRotationPosition) // iRotationPosition used to id the position that the i is in
    activeShapeLocation = currentShape.shapeStartAddress.map(x => {
      cells[x + startLocation].classList.add('active-shape')
      cells[x + startLocation].style.backgroundColor = currentShape.color
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
      cells[idx].style.backgroundColor = currentShape.color
    })
  }

  // ---------- CHECK FUNCTIONS ---------- //

  function rightCheck(array, offsetLocation, offsetIdx) {
    return array.every(pos => pos % width < width - 1 + offsetLocation && !cells[pos + 1 + offsetIdx].classList.contains('occupied-block'))
  }

  function leftCheck(array, offsetLocation, offsetIdx) {
    return array.every(pos => pos % width > (0 + offsetLocation) && !cells[pos - 1 + offsetIdx].classList.contains('occupied-block'))
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

  // lockCheck is a function because it's used in both move and rotation and is called by both
  function lockCheck(array) {
    // the first part of the below checks if any of the shape is on the last row, and then stops it and flashes it to let the user know that it's locked. then it spawns another shape
    if (checkLastRow(array) === true || stackCheck(array) === true) {
      // remove class 'active-shape'
      // clearShape(array, 'active-shape') // not needed as there's a clear before the move attempt
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
      activeShapeLocation = array
    }
  }

  // ---------- MOVEMENT & ROTATION FUNCTIONS ---------- //

  // movement check logic. doesn't actually do the move, that is done by calling lockCheck() before closing the if statement
  // asks if all moves are possible before attempting any at all
  function moveShape(arrayToMove, direction, distance) {
    clearShape(arrayToMove, 'active-shape')
    arrayToMove = arrayToMove.map(idx => {        
      switch (direction) {
        case 'left': if (leftCheck(arrayToMove, 0, 0)) idx -= distance         // left 
          break
        case 'up': if (upCheck(arrayToMove)) idx -= (width * distance)         // up
          break
        case 'right': if (rightCheck(arrayToMove, 0, 0)) idx += distance       // right
          break
        case 'down': if (downCheck(arrayToMove)) idx += (width * distance)     // down
          break
      }
      return idx
    })
    lockCheck(arrayToMove)
  }  
  
  // return the *POSSIBLEe* final position after rotating right 90 degrees
  function rotateFiveRightCheck(arrayToRotate) {
    // rotate instructions give instructions to any of the 5 shapes (excl o and i) on how to spin to the right
    const rotateRightInstructions = [2, width + 1, 2 * width, -width + 1, 0, width - 1, -2 * width, -width - 1, -2]  
    // the grid below is what we will use to map the future moves of the current shape to rotate it
    const rotateCheckGrid = checkArrayGridMaker.map(instruction => arrayToRotate[currentShape.centerIdx] - width - 1 + instruction)
    console.log('grid', rotateCheckGrid)
    // now we check the rotateCheckGrid against the currentShapeLocation and if it includes it we return the index with the instructions applied to it
    clearShape(arrayToRotate, 'active-shape')
    const potentialRotation = []
    rotateCheckGrid.forEach(idx => {
      if (arrayToRotate.includes(idx)) {
        potentialRotation.push(idx + rotateRightInstructions[rotateCheckGrid.indexOf(idx)])
      }
    })
    potentialCenterIdx = potentialRotation.indexOf(arrayToRotate[currentShape.centerIdx])
    return potentialRotation
  }

  function rotateFiveRigthDo(active, potential) {
    potential = rotateFiveRightCheck(active)
    // reassign the shape key location so that the code works next time around
    // get the index in potentialRotation that holds the value that was at the index of the currentShape.centerIdx in activeShapeLocation
    currentShape.centerIdx = potential.indexOf(active[currentShape.centerIdx])
    if (!leftCheck(potential, 0, 1) && !rightCheck(potential, 0, -1)) {
      lockCheck(active)
    } else {
      active = potential
      lockCheck(active)
    } 
  }

  function rotateIRightCheck(arrayToRotate) {
    const i1To2 = [-(2 * width) + 1, - width, -1, width - 2]
    const i2To3 = [width - 1, 0, - width + 1, -(2 * width) + 2]
    const i3To4 = [- width + 2, 1, width, (2 * width) - 1]
    const i4To1 = [(2 * width) - 2, width - 1, 0, - width + 1]

    clearShape(arrayToRotate, 'active-shape')
    const potentialRotation = []
    if (iRotationPosition === 2) {
      for (let i = 0; i < arrayToRotate.length; i++) {
        potentialRotation.push(arrayToRotate[i] + i2To3[i])
      }
      tempIRotationPosition = 3
    } else if (iRotationPosition === 3) {
      for (let i = 0; i < arrayToRotate.length; i++) {
        potentialRotation.push(arrayToRotate[i] + i3To4[i])
      } 
      tempIRotationPosition = 4
    } else if (iRotationPosition === 4) {
      for (let i = 0; i < arrayToRotate.length; i++) {
        potentialRotation.push(arrayToRotate[i] + i4To1[i])
      }
      tempIRotationPosition = 1
    } else {
      for (let i = 0; i < arrayToRotate.length; i++) {
        potentialRotation.push(arrayToRotate[i] + i1To2[i])
      }
      tempIRotationPosition = 2
    }
    console.log('potential location is', potentialRotation)
    return potentialRotation
  }

  function rotateIRigthDo(active, potential) {
    potential = rotateIRightCheck(active)
    // reassign the shape key location so that the code works next time around
    // get the index in potentialRotation that holds the value that was at the index of the currentShape.centerIdx in activeShapeLocation
    if (!leftCheck(potential, 0, 1) && !rightCheck(potential, 0, -1)) {
      lockCheck(active)
    } else {
      active = potential
      iRotationPosition = tempIRotationPosition
      lockCheck(active)
    } 
  }

  // ---------- EVENT LISTENERS ---------- //

  // this is the keyup event listener that is waiting for control input and deciding what to do with it
  document.addEventListener('keyup', e => {

    // rotation keys. 87 = 'w', for rotating right 90 degrees
    if (e.keyCode === 87) {
      if (fiveShapes.includes(currentShape.name)) {  
        //first let' check the move rules, stop it rotating if it breaks them
        const potentialRotation = rotateFiveRightCheck(activeShapeLocation)
        
        if (!leftCheck(potentialRotation, 0, 1) && !rightCheck(potentialRotation, 0, -1)) {
          // console.log('oh no! move not possible!')
          console.log(potentialCenterIdx)
          // || cells[currentShape.centerIdx - 1].classList.contains('occupied-block')  ???? how to wall kick off occupied blocks
          if (activeShapeLocation[currentShape.centerIdx] % width === 0) {
            moveShape(activeShapeLocation, 'right', 1)
            // console.log('kicked right!')
            // console.log(cells[currentShape.centerIdx - 1].classList)
            rotateFiveRigthDo(activeShapeLocation, potentialRotation)
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 9) {
            moveShape(activeShapeLocation, 'left', 1)
            // console.log('kicked left!')
            rotateFiveRigthDo(activeShapeLocation, potentialRotation)
          }
          lockCheck(activeShapeLocation)
        } else {
          rotateFiveRigthDo(activeShapeLocation, potentialRotation)
          // currentShape.centerIdx = potentialRotation.indexOf(activeShapeLocation[currentShape.centerIdx])
          // activeShapeLocation = potentialRotation
          // lockCheck(activeShapeLocation)
        }
        // console.log('w was pressed')
        // console.log('current shape key:', currentShape.centerIdx, 'location:', currentShape.centerIdx)
        // console.log('current location', activeShapeLocation, 'potential rotation', potentialRotation)
      }

      if (currentShape.name === 'iShape') {
        const potentialRotation = rotateIRightCheck(activeShapeLocation)
        
        if (!leftCheck(potentialRotation, 0, 1) && !rightCheck(potentialRotation, 0, -1)) {
          // console.log('oh no! move not possible!')
          console.log(potentialCenterIdx)
          // || cells[currentShape.centerIdx - 1].classList.contains('occupied-block') 
          if (activeShapeLocation[currentShape.centerIdx] % width === 0) {
            if (iRotationPosition === 4) {
              moveShape(activeShapeLocation, 'right', 2)
              rotateIRigthDo(activeShapeLocation, potentialRotation)  
            } else {     
              moveShape(activeShapeLocation, 'right', 1)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            }
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 1 && iRotationPosition === 4) {
            moveShape(activeShapeLocation, 'right', 1)
            rotateIRigthDo(activeShapeLocation, potentialRotation)
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 9) {
            if (iRotationPosition === 2) {
              moveShape(activeShapeLocation, 'left', 2)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            } else {
              moveShape(activeShapeLocation, 'left', 1)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            }           
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 8 && iRotationPosition === 2) {
            moveShape(activeShapeLocation, 'left', 1)
            rotateIRigthDo(activeShapeLocation, potentialRotation)
          }
          lockCheck(activeShapeLocation)
          console.log('centerid address', activeShapeLocation[currentShape.centerIdx])
        } else {
          rotateIRigthDo(activeShapeLocation, potentialRotation)
        }
      }
    }
    

    if (directionKeys.includes(e.keyCode)) {
      switch (e.keyCode) {
        case 37: direction = 'left' 
          break
        case 38: direction = 'up'
          break
        case 39: direction = 'right'
          break
        case 40: direction = 'down'
          break
      }
      moveShape(activeShapeLocation, direction, 1)
      console.log('new shape location', activeShapeLocation)   
    }

  }) // close event listener for keyup

  // ----------- CODE THAT RUNS! ---------- //

  //console.log(activeShapeLocation)
  playGame() 

}) // close DOM event listener

