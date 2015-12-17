window.addEventListener('load',function(){
  var ROW = 15,
      sence = document.getElementById('sence'),
      tips = document.getElementById('tips'),

      //白棋数据 { '1_2':{x:1,y:2} }
      whitetable = {},

      //黑棋数据 { '1_2':{x:1,y:2} }
      blacktable = {},

      //ai当前落子
      cur;

  //创建场景
  (function(){
    var i,j,row,col,block;
    for ( i = 0;  i < ROW;  i++){
      row = document.createElement('div');
      row.className = 'row';
      row.style.top = 20 + 40*i + 'px';
      sence.appendChild(row);

      col = document.createElement('div');
      col.className = 'col';
      col.style.left = 20 + 40*i + 'px';
      sence.appendChild(col);
      for (  j = 0; j < ROW; j++){
	block  = document.createElement('div');
	block.className = 'block';
	block.id = i + '_' + j;
	sence.appendChild(block);
      }
    }
  })();

  //ai计算落子点
  var ai = function(){
    var x = Math.floor(Math.random()*15);
    var y = Math.floor(Math.random()*15);
    while( blacktable[ x + '_'+ y ] || whitetable[ x + '_'+ y ] ){
      x = Math.floor(Math.random()*15);
      y = Math.floor(Math.random()*15);
    }
    return {x:x,y:y};
  }
  var xy2id  = function(x,y){
    return x + '_' + y;
  }

  //判断是否连5
  var  isHasWinner= function(dic,id) {
    var x = Number(id.split('_')[0]), y = Number(id.split('_')[1]),
	hang = 1,shu = 1, zuoxiexian = 1, youxiexian = 1,
	tx,ty; //游标

    tx = x; ty = y; while(dic[ xy2id(tx,ty+1) ]){hang++; ty++;}
    tx = x; ty = y; while(dic[ xy2id(tx,ty-1) ]){hang++;ty--; }

    tx = x; ty = y; while(dic[ xy2id(tx+1,ty) ]){shu++;tx++;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty) ]){shu++;tx--;}

    tx = x; ty = y; while(dic[ xy2id(tx+1,ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty-1) ]){zuoxiexian++;tx--;ty--;}

    tx = x; ty = y; while(dic[ xy2id(tx+1,ty-1) ]){youxiexian++;tx++;ty--;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty+1) ]){youxiexian++;tx--;ty++;}

    return  (hang >= 5 || shu >= 5 || youxiexian >= 5 || zuoxiexian>=5);
  };

  sence.addEventListener('click',function(e){
    if(e.target == this || !e.target.id || whitetable[e.target.id] || blacktable[e.target.id] ){
      return false;
    };
    var t = e.target.id.split('_');
    blacktable[e.target.id] = { x:t[0], y:t[1] };
    e.target.className = 'block black';

    if( isHasWinner(blacktable,e.target.id) ){
      alert('you win');
      return false;
    }

    var white = ai();
    whitetable[ xy2id(white.x,white.y) ] = white;

    if(cur){
      cur.className = 'block white';
    }
    var el = document.getElementById(white.x + '_' + white.y );
    el.className = 'block white current';
    cur = el;

    if( isHasWinner(whitetable,xy2id(white.x,white.y) ) ){
      alert('computer win');
      return false;
    }
  },false);

},false);
