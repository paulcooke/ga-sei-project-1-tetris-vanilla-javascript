if (activeShapeLocation[currentShape.centerIdx] % width === 0 && !cells[activeShapeLocation[currentShape.centerIdx] - 1].classList.contains('occupied-block')) {
  moveShape(activeShapeLocation, 'right')
  
  
  // keep this here for now
  // currentShape.centerIdx = potentialRotation.indexOf(activeShapeLocation[currentShape.centerIdx])
  // activeShapeLocation = potentialRotation
  // lockCheck(activeShapeLocation)
 
  // console.log('left not clear')
  // console.log('can we see active shape?', activeShapeLocation)
  // potentialRotation = moveShape(potentialRotation, 'right')
  // currentShape.centerIdx = potentialRotation.indexOf(activeShapeLocation[currentShape.centerIdx])
  
  // activeShapeLocation = potentialRotation
  // lockCheck(activeShapeLocation)
} else {
  currentShape.centerIdx = potentialRotation.indexOf(activeShapeLocation[currentShape.centerIdx])
  activeShapeLocation = potentialRotation
  lockCheck(activeShapeLocation)
}




if (!leftCheck(activeShapeLocation, -1) && !rightCheck(activeShapeLocation, 1)) {
  console.log('oh no! move not possible!')
  clearShape(activeShapeLocation, 'active-shape')
  lockCheck(activeShapeLocation)
} else {
  rotateFiveRight(activeShapeLocation)
}

