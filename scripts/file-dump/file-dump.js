  //this is how moveShape looks when it is overwriting itself when trying to move the shape as individual blocks
  
  
  // move the shape around
  function moveShape () {

 

    // redraw on movement
    activeShape.forEach(partOfShape => {

      document.addEventListener('keyup', e => {
    
        cells[partOfShape].classList.remove('active-shape') // if using querySelector nth of it needs to be index plus 1 because it's the nth value not the index
       
        const x = partOfShape % width
        //console.log('x value', x)
        const y = Math.floor(partOfShape / width)
        //console.log('y value', y)
  
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
        // console.log('before adding', cells[partOfShape].classList)
        cells[partOfShape].classList.add('active-shape')
        // console.log('after adding', cells[partOfShape].classList)
        
        // it's overwriting itself, delete all then draw all...?
  
  
      })
      
    })

  }