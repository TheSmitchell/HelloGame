var user;
var all = "left up right down A B";
var treeMatrix;

var treeRandomize = function ()
{
  var cols = $('#canvas').width() / 16;
  var rows = $('#canvas').height() / 16;
  treeMatrix = new Array();

  var num = Math.floor((Math.random() * 100)+(Math.random() * 100));

  for (i=0;i<num;++i) {
    do {
      x = Math.floor(Math.random() * 100 % (cols+10)) - 5;
      y = Math.floor(Math.random() * 100 % (rows+10)) - 5;
    } while ( x < 8 && y < 8)
    treeMatrix.push([x,y]);
  }

  treeMatrix.sort(function(a,b) {
    if (a[1] > b[1]) {
      return 1;
    }
    if (a[1] < b[1]) {
      return -1;
    }
    if (a[0] > b[0]) {
      return 1;
    }
    if (a[0] < b[0]) {
      return -1;
    }
    return 0;
  });
}

$(document).ready( function () {
  treeRandomize();
  insertBackground();
  insertUser('dude');
  insertForeground();

  $('#viewport').attr('tabindex',-1).focus().keydown(keyHandler);
});

var insertUser = function(who)
{
  var canvas = $('#canvas');
  var ele = $('<div id="user" class="sprites ' + who + ' down A"></div>');
  ele.css('left',32);
  ele.css('top',32);
  canvas.append(ele);
  user = $('#user');

}

var insertBackground = function()
{
  var canvas = $('#canvas');
  var wide = 32;
  var high = 32;
  var tileW = canvas.width()/wide;
  var tileH = canvas.height()/high;

  for (x=0;x<tileW;++x) { for (y=0;y<tileH;y++) {
    var ele = $('<div class="bground grassA"></div>');
    ele.css('left',(x*wide));
    ele.css('top',(y*high));
    canvas.append(ele);
  }}
  
  for (i=0;i<treeMatrix.length;++i) {
    var treeMid = $('<div class="bground tree mid A"></div>');
    var treeBot = $('<div class="bground tree bot A"></div>');
    treeMid.css('left',treeMatrix[i][0]*16);
    treeMid.css('top',treeMatrix[i][1]*16 + 16*3);
    treeBot.css('left',treeMatrix[i][0]*16);
    treeBot.css('top',treeMatrix[i][1]*16 + 16*4);
    canvas.append(treeMid);
    canvas.append(treeBot);
  }
}

var insertForeground = function()
{
  var canvas = $('#canvas');
  for (i=0;i<treeMatrix.length;++i) {
    var treeTop = $('<div class="fground tree top A"></div>');
    treeTop.css('left',treeMatrix[i][0]*16);
    treeTop.css('top',treeMatrix[i][1]*16);
    canvas.append(treeTop);
  }
}

var keyHandler = function(event)
{
  switch (event.which) {
    case 37:
    case 38:
    case 39:
    case 40:
      event.preventDefault(); 
      break;
    default: return;
  }

  moveUser(event.which);
  toggleUser(event.which);
}

var moveUser = function (dir)
{
  var dist = 16;
  var left = false;
  switch (dir) {
    case 37: left=true;
    case 38: dist = -dist; break;
    case 39: left=true;
    case 40: break;
  }

  var cL = user.position().left;
  var cT = user.position().top;
  var nL = cL;
  var nT = cT;

  if (left) {
    nL = Math.max(Math.min(nL+dist, $('#canvas').width() - user.width()), 0);
  } else {
    nT = Math.max(Math.min(nT+dist, $('#canvas').height() - user.height()),0);
  }

  
  if (!collides({left: nL, top: nT},user.width(),user.height())) {
    user.css('left',nL);
    user.css('top',nT);
  }
}

var collides = function (newPos,width,height)
{
  var pL = newPos.left;
  var pT = newPos.top + (height*0.5);
  var pR = newPos.left + width;
  var pB = newPos.top + height;

  var blocks = $('.tree.mid');
  for (i=0;i<blocks.length;++i) {
    var block = $(blocks[i]);
    var bT = block.position().top;
    var bL = block.position().left;
    var bR = bL + block.width();
    var bB = bT + block.height();
    if ((pL < bR && pR > bL) && (pT < bB && pB > bT))
    {
      return true;
    }
  }
  return false;
}

var toggleUser = function (dir) 
{
  var d='left';
  var t='A';
  switch (dir) {
    case 37: break;
    case 38: d='up';break;
    case 39: d='right';break;
    case 40: d='down';break;
  }
  if (user.hasClass('A')) t='B';

  user.removeClass(all);
  user.addClass(d).addClass(t);
}
