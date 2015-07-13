  var hiddenBoard = [['X',1,0,1,1],[1,1,0,1,'X'],[0,0,1,2,2],[0,0,1,'X',2],[0,0,1,2,'X']];
  var openBoard = [['','','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','','']];


  
  function open(row,col) {
      openBoard[row][col] = hiddenBoard[row][col];
      console.log('You found:',openBoard[row][col]);
    if (openBoard[row][col] === 'X') {
        console.log('Game over. You just blew up into pieces.')
    }
    if (openBoard[row][col] === 0) {
            openAround(row,col);
      }
  }
  
  function openAround(row,col) {
      for (var i = -1; i < 2; i++) {
        if (hiddenBoard[row+i] !== undefined) {
            for(var j = -1; j < 2; j++) {
                    if ((hiddenBoard[row+i][col+j] !== undefined) && (openBoard[row+i][col+j] !== openBoard[row][col])) {
                    open(row+i,col+j);
                }
            }
        }
      }
  }
