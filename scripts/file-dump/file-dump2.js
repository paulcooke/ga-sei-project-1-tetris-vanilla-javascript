document.addEventListener('DOMContentLoaded', () => {
  const width = 10
  const height = 24
  const grid = document.querySelector('.grid')
  const cells = []
  const activeShapeLocation = []
  const startLocation = 14
  const tShape = [0, 1, 2, 11]
  
  

  // this bit makes the game board, 10 x 40
  function makeBoard () {
    for (let i = 0; i < width * height; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }
  }

  // put a shape on the board (starting with the t shape
  // function putOnBoard(startLocation) {
  //   tShape.forEach(ref => {
  //     console.log(ref)
  //     activeShapeLocation.push(ref + startLocation)
  //     console.log(activeShapeLocation)
  //   })
  //   activeShapeLocation.forEach(x => {
  //     // console.log(document.querySelectorAll('div')[x + 1])
  //     document.querySelectorAll('div')[x + 1].classList.add('active-shape')
  //   })
  // }
  
  function drawShape(location) {
    activeShapeLocation = address.map(ref => {
      console.log(ref)
      cells[ref].classList.add('active-shape') 
    }) 
  }

  function clearShape (shape) {
    shape.forEach(block => {
      block.classList.remove('active-shape')
    })
  }
  // console.log(activeShapeLocation)

  
  // move the shape around
  function moveShape (shapeToMove) {
    let newLocation = []
    clearShape(shapeToMove)
    
    const x = partOfShape % width
    //console.log('x value', x)
    const y = Math.floor(partOfShape / width)
    //console.log('y value', y)

    shapeToMove.forEach(partOfShape => {
      switch (e.keyCode) {
        case 37: if (x > 0) partOfShape -= 1                // left
          break
        case 38: if (y > 0) partOfShape -= width            // up
          break
        case 39: if (x < width - 1) partOfShape += 1        // right
          break
        case 40: if (y < height - 1) partOfShape += width   // down
          break
      }
      newLocation.push(partOfShape)
    })
  
    drawShape(newLocation)
    
  }

  makeBoard()
  // putOnBoard(startLocation)
  // moveShape()



  //   // redraw on movement
  //   activeShapeLocation.forEach(partOfShape => {

  //     document.addEventListener('keyup', e => {
    
  //       //cells[partOfShape].classList.remove('active-shape') // if using querySelector nth of it needs to be index plus 1 because it's the nth value not the index
       
  //       const x = partOfShape % width
  //       //console.log('x value', x)
  //       const y = Math.floor(partOfShape / width)
  //       //console.log('y value', y)
  
  //       switch (e.keyCode) {
  //         case 37: if (x > 0) partOfShape -= 1                // left
  //           break
  //         case 38: if (y > 0) partOfShape -= width            // up
  //           break
  //         case 39: if (x < width - 1) partOfShape += 1        // right
  //           break
  //         case 40: if (y < height - 1) partOfShape += width   // down
  //           break
  //       }
  //       // console.log('before adding', cells[partOfShape].classList)
  //       cells[partOfShape].classList.add('active-shape')
  //       // console.log('after adding', cells[partOfShape].classList)
        
  //       // it's overwriting itself, delete all then draw all...?
  
  
  //     })
      
  //   })

  
  // })
  


  



  

  // // activeShape.forEach(shapeBlockIndex => {
  // //   document.querySelectorAll('div')[shapeBlockIndex+1].classList.remove('shape-next-location')
  //   cells[shapeIndex].classList.add('active-shape')
  // })




  // const x = playerIdx % width
  // const y = Math.floor(playerIdx / width

  // let's move a shape
  // document.addEventListener('keyup', (e) => {

  //   cells[playerIdx].classList.remove('player')
  //   const x = playerIdx % width
  //   const y = Math.floor(playerIdx / width)

  //   switch(e.keyCode) {
  //     case 37: if(x > 0) playerIdx -= 1
  //       break
  //     case 38: if(y > 0) playerIdx -= width
  //       break
  //     case 39: if(x < width - 1) playerIdx += 1
  //       break
  //     case 40: if(y < width - 1)playerIdx += width
  //       break
  //   }

  //   cells[playerIdx].classList.add('player')
  // })




/*  function handleClick(e) {
    e.target.classList.add('player')
  } */
  
//   cells[playerIdx].classList.add('player')

//   document.addEventListener('keyup', (e) => {

//     cells[playerIdx].classList.remove('player')
//     const x = playerIdx % width
//     const y = Math.floor(playerIdx / width)

//     switch(e.keyCode) {
//       case 37: if(x > 0) playerIdx -= 1
//         break
//       case 38: if(y > 0) playerIdx -= width
//         break
//       case 39: if(x < width - 1) playerIdx += 1
//         break
//       case 40: if(y < width - 1)playerIdx += width
//         break
//     }

//     cells[playerIdx].classList.add('player')
//   })
// 

