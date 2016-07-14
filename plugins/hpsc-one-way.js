var Plugin = {
  filename : '',
  getName : function (){
    return 'HPSC Integration'
  },
  getFilename : function (){
    return 'hpsc-one-way.js'
  },
  isValid : function (file){
    return true;
  },
  start : function (){
    console.log ('[HP SC] Processing', this.filename)
  },
  setFilename : function (f){
    this.filename = f;
  }
};

module.exports = Plugin;