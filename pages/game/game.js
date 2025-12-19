// pages/game.js
Page({
  data: {
    // table of level with parameters
    // store in an Array list so that game.wxml can render it conveniently
    levels: [
      {key:"level_1",label:"LV1", rows: 9, cols: 9, num_mine: 10},
      {key:"level_2",label:"LV2", rows: 9, cols: 12, num_mine: 20},
      {key:"level_3",label:"LV3", rows: 12, cols: 12, num_mine: 30},
      {key:"level_4",label:"LV4", rows: 16, cols: 16, num_mine: 50},
      {key:"level_5",label:"LV5", rows: 20, cols: 24, num_mine: 99}],

    // init the parameters of this game
    levelKey:"level_1",
    rows: 9,
    cols: 9,
    num_mine: 10,

    board: [],  // create an empty arraylist for push the grids into a board

    gameOver: false,
    win: false,
    remainingGrids: 0,
    showLevelSelect: true,
    actionMode: 'click' // defualt mode should be click
  },

  /*
  当showLevelSelect: true时，此函数用以获取用户选择的难度等级（level1-5），
  并setData确定rows，cols，num_mine，以及showLevelSelect: false从而进入游戏界面。
  */
  select_level(levelKey){
    // ask the user for choosing the level of this game
    const levels = this.data.levels;

    // const level = levels.find(l => l.key === levelKey);
    // .find()函数用来找到一个元素，上面例子中就是元素l.key需要等于levelKey(三个等号表示值和数据类型全部相等)
    let cur_level = null;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].key === levelKey) {
        cur_level = levels[i];
        break;
      }
    }

    if (!cur_level) return; // protect, prevent exceptions like cur_level = null

    this.setData({
      rows: cur_level.rows,
      cols: cur_level.cols,
      num_mine: cur_level.num_mine,
      showLevelSelect: false
    });
  },

  /* 
  此函数用来初始化游戏。
  包括调用set_mines(board, num_mine)布雷，以及setData重新设置
  board, gameOver:false, win:false, remainingGrids:rows*cols-num_mine属性。
  */
  init_game(){
    const { rows, cols, num_mine } = this.data;// 对象解构赋值：rows = this.data.rows; cols = this.data.cols......
    const board = this.create_new_board(rows, cols)
    this.set_mines(board, num_mine)
    // this.set_help_nums(board)   // this function helps to calculate the number should be shown on the grid.
    this.setData({ 
      board,
      gameOver:false,
      win:false,
      remainingGrids:rows*cols-num_mine // this data can only be calculated after setting level
     });
  },

  /* 
  此函数用来生成新的游戏盘面。
  通过创建一个空的ArrayList board，使用双层嵌套循环将board做成二维数组，
  在game.wxml文件中渲染为游戏盘面。同时此函数定义每一个格子grid以及其属性row: r, col: c,
  reveal: false, has_mine: false, has_flag: false, help_num: 0。
  */
  create_new_board(rows, cols){
    const board = [];
    for(let r = 0; r < rows; r++){
      const row_array = [];   // create an empty arraylist for each row
      for(let c = 0; c < cols; c++){

        // set the initial attribute of each grid
        const grid = {
          row: r,
          col: c,
          reveal: false,
          has_mine: false,
          has_flag: false,
          help_num: 0
        }
        row_array.push(grid);
      }
      board.push(row_array);
    }
    return board;
  },

  /* 
  此函数通过使用Math.random来在随机格子布雷，通过while (count < num_mine)来保证布雷数等于num_mine,
  并通过if判断来保证没有重复布雷在同一个格子。
  */
  set_mines(board, num_mine) {
    const { rows, cols} = this.data;

    let count = 0;
    while (count < num_mine) {
      const r = Math.floor(Math.random() * rows); // get the random row and col
      const c = Math.floor(Math.random() * cols);

      //avoid set mine in same grid
      if (board[r][c].has_mine === false) {
        board[r][c].has_mine = true;
        count++;
      }
    }
  },

  /* 
  此函数用来在没有雷的格子上显示正确的数字。
  通过init_game()函数获得remainingGrids，使用四个if语句保证检查的格子不会超出棋盘，
  以及不会重复查到已经revealed的格子和有雷的格子。
  检查时用双层嵌套for循环遍历board[r][c]周围的8个格子，每检查到一个雷board[r][c].help_num+=1。
  检查完周边8个格子后board[r][c].reveal = true;并setData使remainingGrids-1。
  之后if(board[r][c].help_num===0)则需要从周边8个格子的第一个开始递归调用set_help_nums(i,j,board)
  直到点开的空白区域的最外围都是不为0的数字。
  */
  set_help_nums(r,c,board){
    let remainingGrids = this.data.remainingGrids;

    // check the situation of bound and if the grid is already revealed, or if the grid has a mine
    if(r < 0 || r >= board.length) return;
    if(c < 0 || c >= board[0].length) return;
    if(board[r][c].reveal) return;
    if(board[r][c].has_mine) return;

    // check the grids around board[r][c] which is clicked
    // board[r][c].help_num+=1 when a mine is checked
    for(let i= (r===0 ? r: r-1); i<= (r === board.length-1? r : r+1); i++){
      for(let j= (c===0 ? c : c-1); j<= (c === board[0].length-1 ? c : c+1); j++){
        if (i === r && j === c) continue;
        if(board[i][j].has_mine){
          board[r][c].help_num+=1
        }
      }
    }

    // reveal board[r][c] after get the help number and show it, remainingGrids-1
    board[r][c].reveal = true;
    this.setData({remainingGrids: remainingGrids-1})

    // when help number is 0, the 8 grids around it should be checked samely(using recurssion)
    if(board[r][c].help_num===0){
      for(let i= (r===0? r: r-1); i<= (r === board.length? r : r+1); i++){
        if(i < 0 || i >= board.length) continue;
        for(let j= (c===0? c : c-1); j<=(c === board[0].length ? c : c+1); j++){
          if(j < 0 || j >= board[0].length) continue;
          if (i === r && j === c) continue;
          // this.setData({board: board})
          this.set_help_nums(i, j, board)
        }
      }
    }
  },

  /*
  此函数在用户选择难度，点击12345其中一个难度的按钮时触发，获得对应level的参数，
  并传给this.select_level(key)，之后调用init_game()来初始化游戏（至此游戏可以开始）。
  */
  onLevelChoose(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ levelKey: key });
    this.select_level(key);
    this.init_game();
  },

  /* 
  此函数在点击Click按钮时触发，将actionMode设置为'click'。
  */
  onClick(){
    this.setData({ actionMode: 'click' });
  },

  /*
  此函数在点击Flag按钮时触发，将actionMode设置为'flag'。
  */
  onFlag(){
    this.setData({ actionMode: 'flag' });
  },

  /*
  此函数在点击Reset按钮时触发，用来重新设置游戏难度。
  通过设置showLevelSelect为true来让选择难度界面显示给用户。
  */
  onReset(){
    this.setData({
      actionMode: 'click',
      showLevelSelect: true})
  },

  /*
  此函数在用户点击到有雷的格子时，onGridTap()函数将调用它。
  在将格子reveal显示雷后设置gameOver为true并调用微信小程序的函数wx.showModal({})弹出弹框，
  给用户提供重试和重选两个选项。
  */
  onMine(e){
    const r = e.currentTarget.dataset.row;
    const c = e.currentTarget.dataset.col;
    const board = this.data.board;
    const grid = board[r][c];
    grid.reveal = true;
    this.setData({gameOver : true})
    // wx.showModal({}) is a function from WeChat which can pop-up dialog with two buttons
    wx.showModal({
      title: 'Game Over',
      confirmText: '重试',  //查看文档时关注限制相关的描述，之前调用失败就是最多接受4个字符
      cancelText: '重选',
      success: (res) =>{
        if (res.confirm) {
          this.init_game();
        }
        else if (res.cancel) {
          this.onReset();
        }
      }
    });
  },

  /*
  用户点击格子触发onGridTapd()后，若此格子为最后一个没有雷的格子则触发此函数。
  revel最后一个没有雷的格子后，将win设置为true并调用微信小程序的函数wx.showModal({})弹出弹框，
  同样给用户提供重试和重选两个选项。
  */
  onWin(e){
    const r = e.currentTarget.dataset.row;
    const c = e.currentTarget.dataset.col;
    const board = this.data.board;
    const grid = board[r][c];
    grid.reveal = true;
    this.setData({win: true})
    wx.showModal({
      title: 'WIN!!!',
      confirmText: '重试',
      cancelText: '重选',
      success: (res) =>{
        if (res.confirm) {
          this.init_game();
        }
        else if (res.cancel) {
          this.onReset();
        }
      }
    });
  },

  /* 
  用户点击格子触发onGridTap()后，若此格子没有雷且不是最后一个格子时将被onGridTap()调用。
  此函数将获得r，c以及当前board，之后调用set_help_nums()让set_help_nums()函数自己递归调用自己
  完成设置help number的任务。最后将setData新board。
  */
  onEmpty(e){

    // console.log('onEmpty 被调用');
    const r = parseInt(e.currentTarget.dataset.row);
    const c = parseInt(e.currentTarget.dataset.col);
    const board = this.data.board;

    /* console.log(`点击位置: ${r} ${c}`);
    console.log(`board:`, board ? '存在' : 'null');
    console.log(`board大小: ${board ? board.length : 0} x ${board && board[0] ? board[0].length : 0}`);
    
    if (!board || !Array.isArray(board)) {
        console.error('错误：board 无效');
        return;
    }
    
    if (r < 0 || r >= board.length) {
        console.error(`行索引越界: r=${r}, board.length=${board.length}`);
        return;
    }
    
    const row = board[r];
    if (!row || !Array.isArray(row)) {
        console.error(`错误：第 ${r} 行无效`);
        return;
    }
    
    if (c < 0 || c >= row.length) {
        console.error(`列索引越界: c=${c}, row.length=${row.length}`);
        return;
    }
    
    console.log(`格子:`, row[c]); */

    this.set_help_nums(r, c, board);

    this.setData({
      // remainingGrids: this.data.remainingGrids-1,
      board: board
    });
  },

  /*
  用户点击某个格子时触发此函数。
  获取当前r，c，actionMode，remainingGrids，board，如果actionMode为click则判断有无雷，
  有则调用onMine()，没有则判断remainingGrids是否为1，是则调用onWin()，不是则调用onEmpty。
  若actionMode为flag则设置grid.has_flag = !grid.has_flag并让game.wxml文件渲染为插旗。
  最后setData设置board。
  */
  onGridTap(e) {
    const r = e.currentTarget.dataset.row;
    const c = e.currentTarget.dataset.col;
    const mode = this.data.actionMode;
    const remainingGrids = this.data.remainingGrids;
    const board = this.data.board;
    const grid = board[r][c];

    if(grid.reveal) return;

    if (mode === 'click') {
      if(grid.has_mine){
        this.onMine(e);
      }
      else if(remainingGrids === 1){
        this.onWin(e)
      }
      this.onEmpty(e);
    } 
    else if (mode === 'flag') {
      if (grid.reveal) return;
      grid.has_flag = !grid.has_flag;
    }
    this.setData({ board });
  },
})