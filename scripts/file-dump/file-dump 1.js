if (checkLastRow(array) === true || stackCheck(array) === true) {      
  clearInterval(timer)
  // setTimeout to check it is definitely true that it has to stop
  setTimeout(() => {
    if (checkLastRow(array) === true || stackCheck(array) === true) {
      // clearShape(array, 'active-shape', currentShape.name)
      drawShape(array, 'occupied-block', currentShape.name) // this needs to draw the
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
    }
  }, levelSpeeds[currentLevel.innerHTML])

} else {
  clearShape(array, 'active-shape', currentShape.name)
  drawShape(array, 'active-shape', currentShape.name)
  activeShapeLocation = array
}