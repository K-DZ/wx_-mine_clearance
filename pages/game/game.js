// pages/game.js
//option
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

    // init the parameter of this game
    levelKey:"level_1",
    rows: 9,
    cols: 9,
    num_mine: 10,

    board: [],  //create an empty arraylist for push the grids into a board
    gameOver: false,
    win: false,
    remainingGrids: 0,   //this value is used for checking if the game is finished
    // (when remainingGrids = number of grids - num_mine
    showLevelSelect: true,
    actionMode: 'click'
  },

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

    if (!cur_level) return; //protect, prevent exceptions like cur_level = null

    this.setData({
      rows: cur_level.rows,
      cols: cur_level.cols,
      num_mine: cur_level.num_mine,
      // remainingGrids:cur_level.rows*cur_level.cols-cur_level.num_mine,
      showLevelSelect: false
    });
  },

  init_game(){
    const { rows, cols, num_mine } = this.data;// 对象解构赋值：rows = this.data.rows; cols = this.data.cols......
    const board = this.create_new_board(rows, cols)
    this.set_mines(board, num_mine)
    //this.set_help_nums(board)   //this function helps to calculate the number should be shown on the grid.
    this.setData({ 
      board,
      gameOver:false,
      win:false
     });
  },

  create_new_board(rows, cols){
    const board = [];
    for(let r = 0; r < rows; r++){
      const row_array = [];   //create an arraylist for each row
      for(let c = 0; c < cols; c++){
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

  set_mines(board, num_mine) {
    const { rows, cols} = this.data;

    let count = 0;
    while (count < num_mine) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (board[r][c].has_mine === false) {
        board[r][c].has_mine = true;
        count++;
      }
    }
  },

  set_help_nums(r,c,board){
    if(r < 0 || r >= board.length) return;
    if(c < 0 || c >= board[0].length) return;
    if(board[r][c].reveal) return;
    if(board[r][c].has_mine) return;

    for(let i= (r===0 ? r: r-1); i<= (r === board.length-1? r : r+1); i++){
      for(let j= (c===0 ? c : c-1); j<= (c === board[0].length-1 ? c : c+1); j++){
        if (i === r && j === c) continue;
        if(board[i][j].has_mine){
          board[r][c].help_num+=1
        }
      }
    }

    board[r][c].reveal = true;

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


  onLevelChoose(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ levelKey: key });
    this.select_level(key);
    this.init_game();
  },

  onClick(){
    this.setData({ actionMode: 'click' });
  },

  onFlag(){
    this.setData({ actionMode: 'flag' });
  },

  onReset(){
    this.setData({
      actionMode: 'click',
      showLevelSelect: true})
  },

  onMine(e){
    const r = e.currentTarget.dataset.row;
    const c = e.currentTarget.dataset.col;
    const mode = this.data.actionMode;
    const board = this.data.board;
    const grid = board[r][c];
    grid.reveal = true;
    this.setData({gameOver : true})
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
    return;
  },

  onEmpty(e){
    console.log('onEmpty 被调用');
    
    const r = parseInt(e.currentTarget.dataset.row);
    const c = parseInt(e.currentTarget.dataset.col);
    
    // 获取 board 并检查
    const board = this.data.board;
    console.log(`点击位置: ${r} ${c}`);
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
    
    console.log(`格子:`, row[c]);
    
    // 调用递归函数
    this.set_help_nums(r, c, board);
    
    // 更新视图
    this.setData({
      // remainingGrids: this.data.remainingGrids-1,
        board: board
    });
    /* for(let i= r>0? r-1: r; i<=r+1; i++){
      for(let j= c>0? c-1 : c; j<=c+1; j++){
        // let temp = [];
        // temp.push(board[])
        if(board[i][j].has_mine){
          board[r][c].help_num+=1
        }
      }
    }

    if(board[r][c].help_num===0){
      for(let i= r>0? r-1: r; i<=r+1; i++){
        for(let j= c>0? c-1 : c; j<=c+1; j++){
          board[i][j].reveal = true;
          if (i === r && j === c) {
            continue;
          }
          this.set_help_nums(board[i][j])
        }
      }
    } */
  },

  onGridTap(e) {
    const r = e.currentTarget.dataset.row;
    const c = e.currentTarget.dataset.col;
    const mode = this.data.actionMode;
    const board = this.data.board;
    const grid = board[r][c];
    // let remainingGrids = r*c-this.data.num_mine;
    if(grid.reveal) return;

    if (mode === 'click') {
      if(grid.has_mine){
        this.onMine(e);
      }
      this.onEmpty(e);
      /* else if(remainingGrids === 0){
        this.setData({win: true})
      } */
    } 
    else if (mode === 'flag') {
      if (grid.reveal) return;
      grid.has_flag = !grid.has_flag;
    }
      this.setData({ board });
  },
})