document.addEventListener('DOMContentLoaded', () => {
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  let activeShapeLocation = []
  const startLocation = 14
  const shapes = []
  let currentShape = 0
  
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
      document.querySelectorAll('div')[x + startLocation + 1].classList.add('active-shape')
      return x + startLocation
    })
  }

  // this function removes the class 'active-shape' from the divs currently in the active shape location
  function clearShape(shapeArrayOut) {
    shapeArrayOut.forEach(idx => {
      document.querySelectorAll('div')[idx + 1].classList.remove('active-shape')
    })
  }

  function drawShape(shapeArrayIn) {
    shapeArrayIn.forEach(idx => {
      document.querySelectorAll('div')[idx + 1].classList.add('active-shape')
    })
  }

  // this is the evenet listener that is waiting for keyup
  document.addEventListener('keyup', e => {
    
    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
      clearShape(activeShapeLocation)
      console.log(activeShapeLocation)

      const newLocation = activeShapeLocation.map(idx => {
        const x = idx % width
        const y = Math.floor(idx / width)
        
        switch (e.keyCode) {
          case 37: if (x > 0) return idx -= 1                // left 
            break
          case 38: if (y > 0) return idx -= width            // up
            break
          case 39: if (x < width - 1) return idx += 1        // right
            break
          case 40: if (y < height - 1) return idx += width   // down
            break
        }
      })
      activeShapeLocation = newLocation
      drawShape(activeShapeLocation)
      console.log('new shape location' ,activeShapeLocation)
    }


    // const x = playerIdx % width
    // const y = Math.floor(playerIdx / width)
    // switch (e.keyCode) {
    //   case 37: if(x > 0) playerIdx -= 1
    //     break
    //   case 38: if(y > 0) playerIdx -= width
    //     break
    //   case 39: if(x < width - 1) playerIdx += 1
    //     break
    //   case 40: if(y < width - 1)playerIdx += width
    //     break
    // }
    
  })

  makeBoard()
  chooseShape()
  console.log(currentShape)
  spawnShape()
  //console.log(activeShapeLocation)
  

  



})