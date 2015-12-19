window.addEventListener('load',function(){
  var ROW = 15,
      sence = document.getElementById('sence'),
      tips = document.getElementById('tips'),

      //白棋数据 { '1_2':{x:1,y:2} }
      whitetable = {},

      //黑棋数据 { '1_2':{x:1,y:2} }
      blacktable = {},

      //空白位置 默认填满
      blanks = {},

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
        blanks[block.id] = {x:i,y:j};
        sence.appendChild(block);
      }
    }
  })();


  // AI 评估给定的一个空白位置 的威胁值 或 优势值
  var pinggu = function(x,y,dic){
    var tx,ty,hang=0,shu=0,zuoxiexian=0,youxiexian=0;
    tx = x; ty = y; while(dic[ xy2id(tx,ty+1) ]){hang++;ty++;}
    tx = x; ty = y; while(dic[ xy2id(tx,ty-1) ]){hang++;ty--; }
    tx = x; ty = y; while(dic[ xy2id(tx+1,ty) ]){shu++;tx++;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty) ]){shu++;tx--;}
    tx = x; ty = y; while(dic[ xy2id(tx+1,ty+1) ]){zuoxiexian++;tx++;ty++;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty-1) ]){zuoxiexian++;tx--;ty--;}
    tx = x; ty = y; while(dic[ xy2id(tx+1,ty-1) ]){youxiexian++;tx++;ty--;}
    tx = x; ty = y; while(dic[ xy2id(tx-1,ty+1) ]){youxiexian++;tx--;ty++;}
    return  Math.max(hang,shu,zuoxiexian,youxiexian);
  }

  //ai计算落子点
  var ai = function(){
    //1.傻傻的AI
    // var x = Math.floor(Math.random()*15);
    // var y = Math.floor(Math.random()*15);
    // while( blacktable[ x + '_'+ y ] || whitetable[ x + '_'+ y ] ){
    //   x = Math.floor(Math.random()*15);
    //   y = Math.floor(Math.random()*15);
    // }
    // return {x:x,y:y}

    //2.只知道堵的AI
    //遍历所有空白点  为每一个空白点计算一个黑棋对AI的威胁值  取其中最大的值作为AI的落子点
    // var index;
    // var max = -1;
    // for (var b in blanks){
    //   var weixie = pinggu(blanks[b].x,blanks[b].y,blacktable);
    //   if( weixie > max ){
    //     max = weixie; index = b;
    //   }
    // }
    // return blanks[index];

    //3.会根据情况决定堵还是进攻的AI  依然弱爆
    var index, index2;
    var max = -1, max2 = -1;
    for (var b in blanks){
      var weixie = pinggu(blanks[b].x,blanks[b].y,blacktable);
      if( weixie > max ){
        max = weixie; index = b;
      }
      var youshi = pinggu(blanks[b].x,blanks[b].y,whitetable);
      if( youshi > max2 ){
        max2 = youshi; index2 = b;
      }
    }
    if(max2+1 > max ){
      return blanks[index2];
    }else{
      return blanks[index];
    }

    //4.
  }

  var xy2id  = function(x,y){
    return x + '_' + y;
  }
  //判断是否连5
  var  isHasWinner= function(dic,id) {
    var x = Number(id.split('_')[0]), y = Number(id.split('_')[1]);
    return pinggu(x,y,dic) + 1 >=5;
  };

  sence.addEventListener('click',function(e){
    if(e.target == this || !e.target.id || whitetable[e.target.id] || blacktable[e.target.id] ){
      return false;
    };
    var t = e.target.id.split('_');
    blacktable[e.target.id] = { x:t[0], y:t[1] };
    delete blanks[e.target.id];
    e.target.className = 'block black';

    if( isHasWinner(blacktable,e.target.id) ){
      alert('you win');
      return false;
    }

    var white = ai();

    whitetable[ xy2id(white.x,white.y) ] = white;
    delete blanks[xy2id(white.x,white.y)];

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
