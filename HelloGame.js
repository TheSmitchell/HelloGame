var user;
var all = "left up right down A B";
var treeMatrix;

var treeRandomize = function ()
{
  treeMatrix = new Array();

  var num = Math.ceil(Math.random() * 100);

  for (i=0;i<num;++i) {
    var x = Math.floor(Math.random() * 100 % 20);
    var y = Math.floor(Math.random() * 100 % 30);
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
  canvas.append('<div id="user" class="sprites ' + who + ' down A"></div>');
  user = $('#user');

}

var insertBackground = function()
{
  var canvas = $('#canvas');
  var wide = 16;
  var high = 16;
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
    treeMid.css('top',treeMatrix[i][1]*16 + 16*2);
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
    var treeTop = $('<div class="fground tree top A"><div>');
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

  var pos = (left?'left':'top');
  var curPos = (left?user.position().left:user.position().top);
  var curAlt = (left?user.position().top:user.position().left);0
  var minPos = 0;
  var maxPos = (left?$('#canvas').width():$('#canvas').height()) - 16;
  var newPos = Math.max(Math.min(curPos + dist,maxPos),minPos);
  var trees = $('.tree.mid');
  for (i=0;i<trees.length;++i) {
    var tree = $(trees[i]);
    var treePos = (left?tree.position().left:tree.position().top);
    var treeAlt = (left?tree.position().top:tree.position().left);
    var treeLen = (left?tree.width():tree.height());
    var treeLAl = (left?tree.height():tree.width());
    console.log('treePos: ' + treePos + ' x ' + (treePos+treeLen));
    if ((newPos+8 > treePos && newPos+8 < (treePos + treeLen)) && (curAlt+8 > treeAlt && curAlt+8 < (treeAlt + treeLAl))) {
      return;
    }
  }
  user.css(pos,newPos);
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
