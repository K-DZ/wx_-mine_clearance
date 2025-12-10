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
    remainingCells: 0,   //this value is used for checking if the game is finished
    // (when remainingCells = number of grids - num_mine
    showLevelSelect: true
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
      showLevelSelect: false
    });
  },

  init_game(){
    const { rows, cols, num_mine } = this.data;// 对象解构赋值：rows = this.data.rows; cols = this.data.cols......
    const board = this.create_new_board(rows, cols)
    this.set_mines(board, num_mine)
    this.set_help_nums(board)   //this function helps to calculate the number should be shown on the grid.
  },

  create_new_board(rows, cols){
    const board = [];
    for(let r = 0; r < rows; r++){
      const row_array = [];   //create an arraylist for each row
      for(let c = 0; c < cols; c++){
        const grid = {
          row: r,
          col: c,
          unclickable: false,
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

      if (board[r][c].has_mine == false) {
        board[r][c].has_mine = true;
        count++;
      }
    }
  },


  /* set_help_nums(board){
    const { rows, cols } = this.data;
    for(let r = 0; r < rows; r++){
      for(let c = 0; c < cols; c++){
        const grid = board[r][c];
        if(!grid.has_mine){
          continue;
        }
        else{
          if(){
        grid.help_num += 1;
      }
        }
      }
    }
  }, */

  /* flag(){
    
  }, */


  onLevelChoose(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ levelKey: key });
    this.select_level(key);
    this.init_game();
  },

  //生命周期函数--监听页面初次渲染完成
  onReady() {

  },

  //生命周期函数--监听页面显示
  onShow() {

  },

  //生命周期函数--监听页面卸载
  onUnload() {

  },

  //用户点击右上角分享
  onShareAppMessage() {

  }
})