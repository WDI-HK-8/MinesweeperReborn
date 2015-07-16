'use strict';

$(document).ready(function(){

var hiddenBoard = [];
var openBoard = [];
var gameOver = false;
var nbRows = 4;
var nbCols = 4;
var percentMines = 0.15;
var flagsLeft = Math.floor((nbCols*nbRows)*percentMines);

loadTable(nbRows,nbCols,percentMines);

// Level 1
function levelOne() {
  $('#tableBody').children().remove();
  loadTable(4,4,0.15);
  gameOver = false;
}

// Level 2
function levelTwo() {
  $('#tableBody').children().remove();
  loadTable(8,8,0.15);
  gameOver = false;
}

// Level 3
function levelThree() {
  $('#tableBody').children().remove();
  loadTable(12,12,0.15);
  gameOver = false;
}

// Level 4
function levelFour() {
  $('#tableBody').children().remove();
  loadTable(20,20,0.15);
  gameOver = false;
}

// Check win
function checkWin() {
  if (flagsLeft === 0) {
    for (var i = 0; i < hiddenBoard.length; i++) {
      for (var j = 0; j < hiddenBoard[i].length; j++) {
        if ( (hiddenBoard[i][j] === 'X') && (openBoard[i][j] === 'F') ) {
          console.log("YOU WIN !!!");
          $('#game-name').addClass('game-win animated zoomIn').text('You win.');
          setTimeout(function() {
            $('#game-name').removeClass('game-win animated zoomIn').text('Minesweeper Reborn');
          },2000);
          $('td').addClass("animated tada zoomIn")
          setTimeout(function() {
            $('td').removeClass('animated tada zoomIn');
          },1500);
          gameOver = true;
        }
      }
    }
  }
}

//Flags left functions
function addFlag() {
  flagsLeft++;
}

function minusFlag() {
  flagsLeft--;
}

// Flag/Unflag a cell
function flagCell(row,col) {
  if (openBoard[row][col] === "") {
    openBoard[row][col] = 'F';
    minusFlag();
    console.log(flagsLeft, ' flags left');
  } else if (openBoard[row][col] === 'F') {
    openBoard[row][col] = "";
    addFlag();
    console.log(flagsLeft,' flags left');
  }
  updateValues();
  checkWin();
}

// Show bomb cells
var showBombs = function() {
  for (var i = 0; i < hiddenBoard.length; i++) {
    for (var j = 0; j < hiddenBoard[i].length; j++) {
      var cellPosition = $('#tableBody tr:nth-child(' + (i+1) + ') td:nth-child(' + (j+1) + ') ');
      if ( (hiddenBoard[i][j] === 'X') && (openBoard[i][j] === '') ) {
        openBoard[i][j] = 'X';
        cellPosition.addClass("opened-bomb");
      } 
    }
  }
}

// Reset table
function resetTable() {
  $('#tableBody').children().remove();
  loadTable(nbRows,nbCols,percentMines);
  gameOver = false;
}

// Load board table
function loadTable(row,col,percentMines){
  loadBoardArray(row,col,percentMines);
  console.log('hiddenBoard array loaded');
  loadOpenBoardArray();
  console.log('openBoard array loaded');
  createTable();
  console.log('table grid loaded');
  nbCols = col;
  nbRows = row;
  percentMines = percentMines;
  $('#flags-left').text(flagsLeft + ' flags left');
}

// Create board table
function createTable() {
  for (var i = 0; i < hiddenBoard.length; i++) {
    $('#tableBody').append('<tr></tr>');
  }
  for (var j = 0; j < hiddenBoard[0].length; j++) {
    $('#tableBody tr').append('<td></td>');
  }
}

// Load openBoard empty cells
function loadOpenBoardArray() {
  for (var i = 0; i<hiddenBoard.length; i++) {
    openBoard[i] = [];
      for (var j= 0; j<hiddenBoard[i].length; j++) {
          openBoard[i][j] = "";
      }
  }
}

// Load hiddenBoard cells
function loadBoardArray(row,col,percentMines) {
  var nbMines = Math.floor((row*col)*percentMines);
  flagsLeft = nbMines;
  console.log('Loaded', nbMines, 'mines.')
  hiddenBoard = [];
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
    console.log('Game over. You just blew up into pieces.');
    $('#game-name').addClass('game-over animated zoomIn').text('You lost. Just blew up.');
    setTimeout(function() {
      $('#game-name').removeClass('game-over animated zoomIn').text('Minesweeper Reborn');
    },2000);
    gameOver = true;
    showBombs();
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
  for (var i = 0; i < openBoard.length; i++) {
    for (var j = 0; j < openBoard[i].length; j++) {
      var cellPosition = $('#tableBody tr:nth-child(' + (i+1) + ') td:nth-child(' + (j+1) + ') ');
      switch (openBoard[i][j]) {
        case 0:
          cellPosition.addClass("opened-zero animated fadeIn");
          break;
        case 1:
          cellPosition.addClass("opened-one animated fadeIn").text(openBoard[i][j]);
          break;
        case 2:
          cellPosition.addClass("opened-two animated fadeIn").text(openBoard[i][j]);
          break;
        case 3:
          cellPosition.addClass("opened-three animated fadeIn").text(openBoard[i][j]);
          break;
        case 4:
          cellPosition.addClass("opened-four animated fadeIn").text(openBoard[i][j]);
          break;
        case "X":
          cellPosition.addClass("opened-bomb animated fadeIn").append('<span class="glyphicon glyphicon-fire"></span>');
          $('td').addClass("animated shake zoomIn")
          setTimeout(function() {
            $('td').removeClass('animated shake zoomIn');
          },1500);
          break;
        case "F":
          cellPosition.addClass("flag-bomb animated fadeIn").children().remove();
          cellPosition.append('<span class="glyphicon glyphicon-flag"></span>');
          break;
        case "":
          cellPosition.removeClass("flag-bomb animated fadeIn").children().remove();
          break;
      }
    }
  }
}

// Play game by choosing a cell
var play = function(row,col) {
  open(row,col);
  updateValues();
}

// Play/Open click event
$(document).on('click','#tableBody td',function() {
  if (gameOver === false) {
    var col = $(this).index();
    var row = $(this).parent().index();
    if (openBoard[row][col] !== 'F') {
      play(row,col);
    }
  }
});

// Flag/Unflag click event
$(document).on('mousedown','#tableBody td',function(e) {
  if (e.button === 2) {
    if (gameOver === false) {
      var col = $(this).index();
      var row = $(this).parent().index();
      flagCell(row,col);
      $('#flags-left').text(flagsLeft + ' flags left');
    }
  }
});

// Prevent context menu for right click
$(document).on("contextmenu",'#tableBody td',function(e) {
    e.preventDefault();
});

// Reset button
$(document).on('click','#reset',function() {
  resetTable();
});

  // Level 1 button
$(document).on('click','#levelOne',function() {
  levelOne();
});

  // Level 2 button
$(document).on('click','#levelTwo',function() {
  levelTwo();
});

  // Level 3 button
$(document).on('click','#levelThree',function() {
  levelThree();
});

  // Level 4 button
$(document).on('click','#levelFour',function() {
  levelFour();
});


});
