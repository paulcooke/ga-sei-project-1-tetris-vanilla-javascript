document.addEventListener('DOMContentLoaded', () => {
  // game board variables
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  const littleGrid = document.querySelector('.littleGrid')
  const littleCells = []
  const startLocation = 14
  const holdingLocation = 5
  // const leaderBoard = document.querySelector('#leaderBoardList')
  // const form = document.querySelector('#leaderboard-form')

  // scoring variable1s
  const displayedScore = document.querySelector('#currentScore')
  const lineClearPoints = { 1: 100, 2: 300, 3: 500, 4: 800 }
  let lineClearCounter
  const displayedTotalLines = document.querySelector('#totalLinesCleared')
  const levelMultipliers = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10 } // for points
  const musicSpeeds = { 0: 1, 1: 1.05, 2: 1.1, 3: 1.15, 4: 1.2, 5: 1.25, 6: 1.3, 7: 1.35, 8: 1.4, 9: 1.45 }
  

  const currentLevel = document.querySelector('#currentLevel')
  currentLevel.innerHTML = 0
  const levelSpeeds = { 0: 600, 1: 550, 2: 500, 3: 450, 4: 400, 5: 350, 6: 300, 7: 250, 8: 200, 9: 150 }
  // let userName
  // let newScoreEntry = [parseInt(displayedScore.innerHTML)]
  // let leaderBoardArray = [['PAUL', 1000], ['MONI', 20000], ['TOOTHLESS', 7500], ['CROOKSHANKS', 7400], ['T.STARK', 300], ['P.PARKER',400], ['THOR', 1000], ['N.ROMANOV', 3000], ['B.BANNER', 100], ['UNIKITTY', 4000]]

  // check vairables
  const lastRowStartCell = (width * height) - width  // using formula to get cell numbers for last row in the game board
  const gameOverRowStartCell = 30
  let gameOver = true
  let cellsToClear = []
  const rangeMaker = (start, stop, step) => Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + (i * step))
  
  // shape variables
  let holdingShape = {}
  let currentShape = {}
  let activeShapeLocation = []
  
  // move variables
  const directionKeys = [37, 39, 40] //38, up removed
  let direction
  let timer

  // rotation variables
  const checkArrayGridMaker = [0, 1, 2, width, width + 1, width + 2, (2 * width), (2 * width) + 1, (2 * width) + 2]
  const fiveShapes = ['tShape', 'zShape', 'sShape', 'jShape', 'lShape']
  let potentialCenterIdx
  let iRotationPosition
  let tempIRotationPosition

  // ---------- GAME SETUP FUNCTIONS ---------- //
  
  // this function makes the game board using the sizes specified at the start
  function makeBoard () {
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }
    for (let j = width * 3; j < width * 4; j++) {
      cells[j].style.borderBottom = '2px solid rgb(74, 74, 155)'
    }
    for (let k = 0; k < 16; k++) {
      const littleCell = document.createElement('div')
      littleGrid.appendChild(littleCell)
      littleCells.push(littleCell)
    }

    //leaderboards
    // for (let i = 0; i < 10; i++) {
    //   const leaderListItem = document.createElement('li')
    //   leaderListItem.innerHTML = '<span id="span1">span tag</span><span id="span2">tag 2</span>'
    //   leaderListItem.classList.add('leaderListItem')
    //   leaderBoard.append(leaderListItem)
    // }

    // ***************************************************************
    // testing adding info from arrays to the leaderboard;
    // leaderBoardArray = leaderBoardArray.sort((function(index) {
    //   return function(a, b) {
    //     return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1))
    //   }
    // })(1))

    // const items = document.querySelectorAll('li')
    // // console.log(items)
    
    // for (let i = 0; i < leaderBoardArray.length; i++) {
    //   items[i].innerHTML = `<span id="span1">${leaderBoardArray[i][0]}</span><span id="span2">${leaderBoardArray[i][1]}</span>`
    // }


    // ***************************************************************    
  }

  // this function chooses the shape to use each time and reassigns 'currentShape' to be the newly generated one. start location can be altered by updating these
  function makeShape() {
    // centerIdx properties will let us map a 3x3 grid around each shape when we try to rotate them. they line up with the shapes array
    const shapes = [ 
      { name: 'tShape', shapeStartAddress: [0, 9, 10, 11], centerIdx: 2, holdingAddress: [0, 3, 4, 5] },
      { name: 'zShape', shapeStartAddress: [-1, 0, 10, 11], centerIdx: 2, holdingAddress: [-1, 0, 4, 5] },
      { name: 'sShape', shapeStartAddress: [0, 1, 9, 10], centerIdx: 3, holdingAddress: [0, 1, 3, 4] },
      { name: 'jShape', shapeStartAddress: [-1, 9, 10, 11], centerIdx: 2, holdingAddress: [-1, 3, 4, 5] },
      { name: 'lShape', shapeStartAddress: [1, 9, 10, 11], centerIdx: 2, holdingAddress: [1, 3, 4, 5] },
      { name: 'iShape', shapeStartAddress: [9, 10, 11, 12], centerIdx: 1, holdingAddress: [3, 4, 5, 6] },
      { name: 'oShape', shapeStartAddress: [0, 1, 10, 11], centerIdx: 1, holdingAddress: [0, 1, 4, 5] }
    ]
    holdingShape = shapes[Math.floor(Math.random() * shapes.length)]
  } 

  function gameOverScreen() {
    cells.forEach(cell => cell.classList.add('gameOverScreen'))
    const gameOverDiv = document.querySelector('#gameOver')
    setTimeout(() => {
      gameOverDiv.style.display = 'flex'
    }, 1000)
    const gameOverSound = document.querySelector('#game-over')
    gameOverSound.volume = 0.8
    gameOverSound.play()
    theme.pause()
    


    // const scoreBox = document.querySelector('#enterScore')
    // console.log(topTenCheck(parseInt(displayedScore.innerHTML)))

    // if (topTenCheck(parseInt(displayedScore.innerHTML))) {
    //   gameOverDiv.style.display = 'flex'
    //   scoreBox.style.display = 'flex'
    // } else {
    //   
    // }

  }

  function resetStuff() {
    displayedTotalLines.innerHTML = 0
    displayedScore.innerHTML = 0
    currentLevel.innerHTML = 0
    // newScoreEntry = []
  }

  // ----------- SPAWNING, DRAWING AND CLEARING FUNCTIONS ---------- //

  // make a random shape and put it in the holding ('next shape') area
  function getRandomShape() {
    littleCells.forEach(lilCell => lilCell.classList.remove('tShape', 'iShape', 'oShape', 'jShape', 'lShape', 'sShape', 'zShape'))
    makeShape()
    holdingShape.holdingAddress.forEach(shape => {
      littleCells[shape + holdingLocation].classList.add(holdingShape.name)
      return shape + holdingLocation
    })
  }
  
  //this function spawns a new shape at the top of the board, at index contained in global variable 'startLocation'
  function spawnShape () {
    currentShape = holdingShape
    console.log(holdingShape)
    // console.log(currentShape)
    if (currentShape.name === 'iShape') iRotationPosition = 1 
    console.log(iRotationPosition) // iRotationPosition used to id the position that the i is in
    activeShapeLocation = currentShape.shapeStartAddress.map(startShape => {
      cells[startShape + startLocation].classList.add('active-shape')
      cells[startShape + startLocation].classList.add(currentShape.name)
      return startShape + startLocation
    })
    timer = setInterval(() => {
      clearShape(activeShapeLocation, 'active-shape', currentShape.name)
      moveShape(activeShapeLocation, 'down', 1)
    }, levelSpeeds[currentLevel.innerHTML])
    getRandomShape()
  }

  // this function removes the class 'active-shape' from the divs currently in the active shape location
  function clearShape(shapeArrayOut, classToRemove, class2, class3, class4, class5, class6, class7, class8) {
    shapeArrayOut.forEach(idx => {
      cells[idx].classList.remove(classToRemove)
      cells[idx].classList.remove(class2)
      cells[idx].classList.remove(class3)
      cells[idx].classList.remove(class4)
      cells[idx].classList.remove(class5)
      cells[idx].classList.remove(class6)
      cells[idx].classList.remove(class7)
      cells[idx].classList.remove(class8)
    })
  }

  function drawShape(shapeArrayIn, classToAdd, secondClassToAdd) {
    shapeArrayIn.forEach(idx => {
      cells[idx].classList.add(classToAdd)
      cells[idx].classList.add(secondClassToAdd)
    })
  }

  function clearLinesAndTopUp(starterCellsArray) {
    console.log(starterCellsArray)
    displayedTotalLines.innerHTML = parseInt(displayedTotalLines.innerHTML) + lineClearCounter
    const clearLinesSound = document.querySelector('#line-clear-sound')
    clearLinesSound.volume = 0.3
    clearLinesSound.play()

    const lineScore = lineClearPoints[lineClearCounter] * levelMultipliers[parseInt(currentLevel.innerHTML)]
    displayedScore.innerHTML = parseInt(displayedScore.innerHTML) + lineScore

    const lineCheck = parseInt(displayedTotalLines.innerHTML)
    if (lineCheck < 2) {
      currentLevel.innerHTML = 0
    } else if (lineCheck < 4) {
      currentLevel.innerHTML = 1
    } else if (lineCheck < 6) {
      currentLevel.innerHTML = 2
    } else if (lineCheck < 8) {
      currentLevel.innerHTML = 3
    } else if (lineCheck < 10) {
      currentLevel.innerHTML = 4
    } else if (lineCheck < 12) {
      currentLevel.innerHTML = 5
    } else if (lineCheck < 14) {
      currentLevel.innerHTML = 6
    } else if (lineCheck < 16) {
      currentLevel.innerHTML = 7
    } else if (lineCheck < 18) {
      currentLevel.innerHTML = 8
    } else {
      currentLevel.innerHTML = 9
    }
    theme.playbackRate = musicSpeeds[currentLevel.innerHTML]
    for (let i = 0; i < starterCellsArray.length; i++) {
      clearShape(starterCellsArray[i], 'occupied-block', 'tShape', 'iShape', 'oShape', 'jShape', 'lShape', 'sShape', 'zShape')
      const tempArray = rangeMaker(40, starterCellsArray[i][starterCellsArray[i].length - 1], 1).reverse()
      tempArray.forEach(idx => {
        cells[idx].classList = cells[idx - width].classList
      })  
      cellsToClear = []  
    }
  }

  // function leaderBoardAdd() {
  //   // const leaderBoardForm = document.querySelector('#leaderboard-form')
  //   // leaderBoardForm.style.display = 'flex'
  //   newScoreEntry.unshift(userName)
  //   leaderBoardArray.pop()
  //   console.log('leaderboard array popped', leaderBoardArray)

  //   leaderBoardArray.push(newScoreEntry)
  //   leaderBoardArray = leaderBoardArray.sort((function(index) {
  //     return function(a, b) {
  //       return (a[index] === b[index] ? 0 : (a[index] > b[index] ? -1 : 1))
  //     }
  //   })(1))

  //   const items = document.querySelectorAll('li')
  //   // console.log(items)
    
  //   for (let i = 0; i < leaderBoardArray.length; i++) {
  //     items[i].innerHTML = `<span id="span1">${leaderBoardArray[i][0]}</span><span id="span2">${leaderBoardArray[i][1]}</span>`
  //   }

  // }
  
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
    return array.some(cellIdx => {
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

  // function topTenCheck(userScore) {
  //   return userScore > Math.min(...leaderBoardArray.flat().filter(x => typeof x === 'number')) 
  // }

  function checkCompletedLines() {
    // lineRange makes an array based on start and stop plus increment inputs. it's used to make the gridArrays array
    const gridArrays = []
    // make the array with the row arrays in (gridArrays)
    for (let i = 0; i < cells.length; i += 10) {
      gridArrays.push(rangeMaker(i, i + width - 1, 1))
    }
    // for each row, check if it's completed and return any that are to the cellsToClear array, these will get to clear rows
    gridArrays.forEach(row => {
      // row.forEach(idx => console.log('testing for idx', cells[idx].classList))
      if (row.every(idx => cells[idx].classList.contains('occupied-block'))) {
        cellsToClear.push(row)
      }
    })
    lineClearCounter = cellsToClear.length
  }

  // lockCheck is the 'finishing move' for move and rotation attempts
  function lockCheck(array) {
    if (checkLastRow(array) === true || stackCheck(array) === true) {      
      
      // give it one tick
      // if it's really locked, then do the locked stuff, otherwise do the not locked stuff
      // need to check again the above lock checks


      drawShape(array, 'occupied-block', currentShape.name)
      clearInterval(timer)
      checkCompletedLines()
      if (cellsToClear.length > 0) {
        clearLinesAndTopUp(cellsToClear)
      }
      checkGameOver()
      if (gameOver) {
        gameOverScreen()
      }
      if (!gameOver) spawnShape()       
    } else {
      drawShape(array, 'active-shape', currentShape.name)
      activeShapeLocation = array
    }
  }

  // ---------- MOVEMENT & ROTATION FUNCTIONS ---------- //

  // movement check logic. doesn't actually do the move, that is done by calling lockCheck() before closing the if statement
  // asks if all moves are possible before attempting any at all
  function moveShape(arrayToMove, direction, distance) {
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

    // thouht this was where to put the lock delay
    // if (checkLastRow(arrayToMove) === true || stackCheck(arrayToMove) === true) {
    //   setInterval(() => {
    //     lockCheck(arrayToMove)
    //   }, levelSpeeds[currentLevel.innerHTML])
    // } else {
    //   lockCheck(arrayToMove)
    // }
  }  
  
  // return the *POSSIBLEe* final position after rotating right 90 degrees
  function rotateFiveRightCheck(arrayToRotate) {
    // rotate instructions give instructions to any of the 5 shapes (excl o and i) on how to spin to the right
    const rotateRightInstructions = [2, width + 1, 2 * width, -width + 1, 0, width - 1, -2 * width, -width - 1, -2]  
    // the grid below is what we will use to map the future moves of the current shape to rotate it
    const rotateCheckGrid = checkArrayGridMaker.map(instruction => arrayToRotate[currentShape.centerIdx] - width - 1 + instruction)
    console.log('grid', rotateCheckGrid)
    // now we check the rotateCheckGrid against the currentShapeLocation and if it includes it we return the index with the instructions applied to it
    clearShape(arrayToRotate, 'active-shape', currentShape.name)
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

    clearShape(arrayToRotate, 'active-shape', currentShape.name)
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

    // start and pause
    if (e.keyCode === 32) {
      if (gameOver) {
        const readyGoSound = document.querySelector('#ready-go-sound')
        const readyGo = document.querySelector('#ready-go')
        readyGoSound.volume = 0.3
        readyGoSound.play()
        setTimeout(() => {
          readyGo.style.display = 'none'
          spawnShape()
          theme.volume = 0.1
          theme.paused ? theme.play() : theme.pause()
          gameOver = false
        }, 1000)
        
      }
    }

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
            clearShape(activeShapeLocation, 'active-shape', currentShape.name)
            moveShape(activeShapeLocation, 'right', 1)
            // console.log('kicked right!')
            // console.log(cells[currentShape.centerIdx - 1].classList)
            rotateFiveRigthDo(activeShapeLocation, potentialRotation)
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 9) {
            clearShape(activeShapeLocation, 'active-shape', currentShape.name)
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
              clearShape(activeShapeLocation, 'active-shape', currentShape.name)
              moveShape(activeShapeLocation, 'right', 2)
              rotateIRigthDo(activeShapeLocation, potentialRotation)  
            } else {     
              clearShape(activeShapeLocation, 'active-shape', currentShape.name)
              moveShape(activeShapeLocation, 'right', 1)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            }
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 1 && iRotationPosition === 4) {
            clearShape(activeShapeLocation, 'active-shape', currentShape.name)
            moveShape(activeShapeLocation, 'right', 1)
            rotateIRigthDo(activeShapeLocation, potentialRotation)
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 9) {
            if (iRotationPosition === 2) {
              clearShape(activeShapeLocation, 'active-shape', currentShape.name)
              moveShape(activeShapeLocation, 'left', 2)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            } else {
              clearShape(activeShapeLocation, 'active-shape', currentShape.name)
              moveShape(activeShapeLocation, 'left', 1)
              rotateIRigthDo(activeShapeLocation, potentialRotation)
            }           
          } else if (activeShapeLocation[currentShape.centerIdx] % width === 8 && iRotationPosition === 2) {
            clearShape(activeShapeLocation, 'active-shape', currentShape.name)
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

  }) // close event listener for keyup
  
  document.addEventListener('keydown', e => {
    if (directionKeys.includes(e.keyCode)) {
      switch (e.keyCode) {
        case 37: direction = 'left' 
          break
        // case 38: direction = 'up'
        //   break
        case 39: direction = 'right'
          break
        case 40: direction = 'down'
          break
      }
      clearShape(activeShapeLocation, 'active-shape', currentShape.name)
      moveShape(activeShapeLocation, direction, 1)
      console.log('new shape location', activeShapeLocation)   
    }
  }) // close event listener for keydown

  // form.addEventListener('submit', e => {
  //   e.preventDefault()
  //   const userInput = form.querySelector('#user-name')
  //   userName = userInput.value.toUpperCase()
  //   console.log(userName)
  //   leaderBoardAdd()
  // })

  const playAgain = document.querySelector('#play-again')
  playAgain.addEventListener('click', () => {
    location.reload()
  })

  const musicToggle = document.querySelector('.sound')
  const theme = document.querySelector('#theme')
  musicToggle.addEventListener('click', () => {
    theme.volume = 0.15
    theme.paused ? theme.play() : theme.pause()
  })

  // ----------- CODE THAT RUNS! ---------- //
  
  resetStuff() 
  makeBoard()
  getRandomShape()

}) // close DOM event listener

