  $(document).ready(function(){

  var hiddenBoard = [];
  var openBoard = [];


  // Erase table
  function eraseTable() {
    $('#tableBody').children().remove();
  }

  // Load board table
  function loadTable(row,col){
    loadBoardArray(row,col);
    loadOpenBoardArray(row,col);
    createTable(row,col);
  }

  // Create board table
  function createTable(row,col) {
    for (var i = 0; i < row; i++) {
      $('#tableBody').append('<tr></tr>');
    }
    for (var j= 0; j < col; j++) {
      $('#tableBody').children().append('<td></td>');
    }
  }

  // Load openBoard empty cells
  function loadOpenBoardArray(row,col) {
    for (var i = 0; i<row; i++) {
        openBoard[i] = [];
        for (var j= 0; j<col; j++) {
            openBoard[i][j] = "";
        }
    }
  }

  // Load hiddenBoard cells
  function loadBoardArray(row,col) {
      var nbMines = Math.floor((row*col)*0.2);
      for (var i = 0; i<row; i++) {
          hiddenBoard[i] = [];
          for (var j= 0; j<col; j++) {
              hiddenBoard[i][j] = 0;
          }
      }
      for (var x = 0; x < nbMines; x++) {
          randPosMine(row,col);
      }
  }

  // Random positions generator for hiddenBoard
  function rand(limit) {
      return Math.floor(Math.random()*limit);
  }

  // Random bomb positions in hiddenBoard and put numbers around them
  function randPosMine(row,col) {
      var randCol = rand(col);
      var randRow = rand(row);
      if (hiddenBoard[randRow][randCol] != 'X') {
          hiddenBoard[randRow][randCol] = 'X';
          addNumbAround(randRow,randCol);
      } else {
          console.log('position already taken');
          randPosMine(row,col);
      }
  }

  // Numbers generator around bombs
  function addNumbAround(row,col) {
      for (var i = -1; i < 2; i++) {
          if (hiddenBoard[row+i] !== undefined) {
              for (var j = -1; j < 2; j++) {
                  if ((hiddenBoard[row+i][col+j] !== undefined) && (hiddenBoard[row+i][col+j] !== hiddenBoard[row][col]) && (hiddenBoard[row+i][col+j]>= 0)) {
                      hiddenBoard[row+i][col+j]++;
                  }
              }
          }
      }
  }


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
  var updateValues = function() {
    for (i = 0; i < openBoard.length; i++) {
      for (j = 0; j < openBoard[i].length; j++) {
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


// Click events to cells
  $(document).on('click','#tableBody td',function() {
    var col = $(this).index()
    var row = $(this).parent().index()
    play(row,col);

  })

// Reset button
  $(document).on('click','#reset',function() {
    eraseTable();
    loadTable(10,10);
  })

loadTable(10,10);

});
