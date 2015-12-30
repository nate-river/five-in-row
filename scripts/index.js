document.addEventListener('DOMContentLoaded',function(){
  ////////////////////////////////////////
  var ROW = 15,cur = null, //用来存放ai当前落子的div
      sence = document.getElementById('sence'),
      tips = document.getElementById('tips'),
      restart = document.getElementById('restart'),
      whitetable = {}, //白棋数据 { '1_2':{x:1,y:2}, '2_2':{x:1,y:2} }
      blacktable = {}, //黑棋数据 { '5_2':{x:5,y:2}, '6_2':{x:5,y:2} }
      blanks = {};     //空白位置 { '0_0':{x:0,y:0},......}


  ///////////////////////////////////////////
  (function(){
    var i,j,row,col,block;
    for ( i = 0;  i < ROW;  i++){
      row = document.createElement('div'); row.className = 'row';
      row.style.top = 20 + 40*i + 'px';    sence.appendChild(row);
      col = document.createElement('div'); col.className = 'col';
      col.style.left = 20 + 40*i + 'px';   sence.appendChild(col);
      for (  j = 0; j < ROW; j++){
  	block  = document.createElement('div');
  	block.className = 'block';
  	block.id = i + '_' + j;
  	blanks[block.id] = {x:i,y:j};
  	sence.appendChild(block);
      }
    }
  })();

  ////////////////////////////////////////////////
  var drop = function(color,position){
    var t = position.split('_'),
  	data = {x:t[0],y:t[1]},
  	el = null;
    delete blanks[ position ];


    if( color === 'black' ){
      blacktable[ position ]  = data;
      if( isHasWinner(blacktable,data.x,data.y) ){
  	tips.style.display = 'block';
  	sence.removeEventListener('click',senceClick);
      }
    }else if( color === 'white' ){
      whitetable[ position ]  = data;
      if( isHasWinner(whitetable,data.x,data.y) ){
  	tips.style.display = 'block';
  	sence.removeEventListener('click',senceClick);
      }
    }

    if(cur){
      cur.classList.remove('current');
    }
    el = document.getElementById(position);
    el.className = 'block qizi '+ color + ' current';
    cur = el;

    return false;
  };

  /////////////////////
  var  isHasWinner= function(im,x,y) {
    x = Number(x); y = Number(y);
    var tx,ty,hang=1,shu=1,zuoxiexian=1,youxiexian=1;
    tx = x; ty = y; while(im[ xy2id(tx,ty+1) ]){hang++;ty++;}
    tx = x; ty = y; while(im[ xy2id(tx,ty-1) ]){hang++;ty--; }
    tx = x; ty = y; while(im[ xy2id(tx+1,ty) ]){shu++;tx++;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty) ]){shu++;tx--;}
    tx = x; ty = y; while(im[ xy2id(tx+1,ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty-1) ]){zuoxiexian++;tx--;ty--;}
    tx = x; ty = y; while(im[ xy2id(tx+1,ty-1) ]){youxiexian++;tx++;ty--;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty+1) ]){youxiexian++;tx--;ty++;}
    return Math.max(hang,shu,zuoxiexian,youxiexian) >= 5;
  };

  /////////////////////////////////////////////////
  var senceClick  =  function(e){
    if(e.target == this || !e.target.id || whitetable[e.target.id] || blacktable[e.target.id] ){
      return false;
    };
    drop('black',e.target.id);
    var white = ai();
    drop('white',xy2id( white.x, white.y) );
    return true;
  };
  sence.addEventListener('click',senceClick,false);


  ///////////////////////////////
  var ai = function(){
    var index, index2;
    var max = -1, max2 = -1;
    for (var b in blanks){
      var weixie = pinggu(blanks[b].x,blanks[b].y,blacktable,whitetable);
      if( weixie > max ){
    	max = weixie;  index = b;
      }
      var youshi = pinggu(blanks[b].x,blanks[b].y,whitetable,blacktable);
      if( youshi > max2 ){
    	max2 = youshi; index2 = b;
      }
    }
    if( max2 > max ){
      return blanks[index2];
    }else{
      return blanks[index];
    }
  };

  ////////////////////////////////////////
  document.onclick = (function(){
    var k  = true;
    return function(e){
      if( e.target == sence || sence.contains(e.target) ){
  	return;
      }
      if(k){
  	sence.style.display = 'none';  k = false;
      }else{
  	sence.style.display = 'block'; k= true;
      }
    };
  })();


  ///////////////////////////////////////////
  restart.onclick =  function(e){
    var i , j, id;
    for ( i = 0;  i < ROW;  i++){
      for (  j = 0; j < ROW; j++){
  	id = i + '_' + j;
  	blanks[id] = {x:i,y:j};
      }
    }
    for(var el in whitetable){
      document.getElementById(el).className = 'block';
    }
    for ( el in blacktable){
      document.getElementById(el).className = 'block';
    }
    whitetable = {}; blacktable = {};
    tips.style.display = 'none';
    e.stopPropagation();
    sence.addEventListener('click',senceClick,false);
  };

  ////////////////////////////////////////////////////
  var xy2id  = function(x,y){
    return x + '_' + y;
  };
  //////////////////////
  var feishu = {'2-':10, '2+':1000, '3-':1500, '3+':10000, '4-':15000, '4+':100000, '5-':900000, '5+':1000000};
  ///////////////////////
  var pinggu = function(x,y,im,op){
    var T = {'2-':0, '2+':0, '3-':0, '3+':0, '4-':0, '4+':0, '5-':0, '5+':0};
    var tx,ty,hang=1,shu=1,zuoxiexian=1,youxiexian=1;
    tx = x; ty = y; while(im[ xy2id(tx,ty+1) ]){hang++;ty++;}
    tx = x; ty = y; while(im[ xy2id(tx,ty-1) ]){hang++;ty--; }
    if( op[xy2id(tx,ty+1)] || op[xy2id(tx,ty-1)] ){
      T[ hang + '-']++;
    }else{
      T[ hang + '+']++;
    }
    tx = x; ty = y; while(im[ xy2id(tx+1,ty) ]){shu++;tx++;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty) ]){shu++;tx--;}
    if( op[xy2id(tx+1,ty)] || op[xy2id(tx-1,ty)]  ){
      T[ shu + '-']++;
    }else{
      T[ shu + '+']++;
    }
    tx = x; ty = y; while(im[ xy2id(tx+1,ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty-1) ]){zuoxiexian++;tx--;ty--;}
    if( op[xy2id(tx+1,ty+1)] || op[xy2id(tx-1,ty-1)]  ){
      T[ zuoxiexian + '-']++;
    }else{
      T[ zuoxiexian + '+']++;
    }
    tx = x; ty = y; while(im[ xy2id(tx+1,ty-1) ]){youxiexian++;tx++;ty--;}
    tx = x; ty = y; while(im[ xy2id(tx-1,ty+1) ]){youxiexian++;tx--;ty++;}
    if( op[xy2id(tx+1,ty-1)] || op[xy2id(tx-1,ty+1)]  ){
      T[ youxiexian + '-']++;
    }else{
      T[ youxiexian + '+']++;
    }
    delete T['1+'];
    delete T['1-'];
    var score = 0;
    for(var i in T){
      score += feishu[i]*T[i];
    }
    return score;
  };
  restart.onmousedown  = function(e){e.preventDefault();};
  sence.onmousedown  = function(e){e.preventDefault();};

},false);
/////////////////////////////////////////////////////////////////////////
