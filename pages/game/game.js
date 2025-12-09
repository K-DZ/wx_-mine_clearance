// pages/game.js
//option
Page({
  data: {
    // table of level with parameters
    levels: [
      {key:"level_1",label:"LV1", rows: 9, cols: 9, num_boom: 10},
      {key:"level_2",label:"LV2", rows: 9, cols: 12, num_boom: 20},
      {key:"level_3",label:"LV3", rows: 12, cols: 12, num_boom: 30},
      {key:"level_4",label:"LV4", rows: 16, cols: 16, num_boom: 50},
      {key:"level_5",label:"LV5", rows: 20, cols: 24, num_boom: 99}],

    // init the parameter of this game
    levelkey:"level_1",
    rows: 9,
    cols: 9,
    num_boom: 10,

    board: [],
    gameOver: false,
    win: false,
    // remainingCells: 0
  },
  select_level(){
    // ask the user for choosing the level of this game
    const levels = this.data.levels;
    const levelKey = this.data.levelKey;
    // const level = levels.find(l => l.key === levelKey);
    // .find()函数用来找到一个元素，上面例子中就是元素l.key需要等于levelKey(三个等号表示值和数据类型全部相等)
    let level = null;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].key === levelKey) {
        level = levels[i];
        break;
      }
    }

    if (!level) return;

    this.setData({
      rows: level.rows,
      cols: level.cols,
      num_boom: level.num_boom
    });
  },

  init_game(){
    const { rows, cols, num_boom } = this.data;
    const board = this.creat_new_board(rows, cols)
    this.set_booms(board)
    this.set_help_nums(board)
    
  },

  creat_new_board(rows, cols){
    const board = [];
    for(let r = 0; r < rows; r++){
      const row_array = [];
      for(let c = 0; c < cols; c++){
        const grid = {
          row: r,
          col: c,
          unclickable: false,
          has_boom: false,
          has_flag: false,
          // help_nums
        }
        row_array.push(grid);
      }
      board.push(row_array);
    }
    return board;
  },

  set_booms(board) {
    const { rows, cols, num_boom } = this.data;

    let count = 0;
    while (count < num_boom) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      if (board[r][c].has_boom == false) {
        board[r][c].has_boom = true;
        count++;
      }
    }
  },

  /* set_help_nums(board){
    for(grid in board){
      if(){

      }
    }
  },

  flag(){
    
  }, */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.select_level()
    this.init_game();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})