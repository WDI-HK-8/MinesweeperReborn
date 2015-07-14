  $(document).ready(function(){

  var hiddenBoard = [['X',1,0,1,1],[1,1,0,1,'X'],[0,0,1,2,2],[0,0,1,'X',2],[0,0,1,2,'X']];
  var openBoard = [['','','','',''],['','','','',''],['','','','',''],['','','','',''],['','','','','']];


  // Open a cell
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
  
  //Open cells around a cell
  function openAround(row,col) {
    for (var i = -1; i < 2; i++) {
      if (hiddenBoard[row+i] !== undefined) {
        for (var j = -1; j < 2; j++) {
          if ((hiddenBoard[row+i][col+j] !== undefined) && (openBoard[row+i][col+j] !== openBoard[row][col])) {
                    open(row+i,col+j);
          }
        }
      }
    }
  }

  // Update values of the board in html
  var updateValues = function () {
    for (i = 0; i < 5; i++) {
      for (j = 0; j < 5; j++) {
        if (openBoard[i][j] !== "") {
          $('#tableBody tr:nth-child(' + (i+1) + ') td:nth-child(' + (j+1) + ') ').text(openBoard[i][j])
        }
      }
    }
  }

  // Play game by choosing a cell
  var play = function(row,col) {
    open(row,col);
    updateValues();
  }

  //click event
  // var loadClick = function() {
  //   for (i = 0; i < 4; i++) {
  //       for (j = 0; j < 4; j++) {
  //         $('#tableBody tr:nth-child(' + (i+1) + ') td:nth-child(' + (j+1) + ') ').click(function(){play(i,j)})
  //   }
  // }

// Click events to cells
  $('#tableBody td').click(function() {
    var col = $(this).index()
    var row = $(this).parent().index()
    play(row,col);

  })

});
