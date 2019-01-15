var _exec = require('child_process').exec;
// hexo version to verfiy  2.0 or 3.0
hexo.on('new', function(data){
_exec('start "" "C:\\Users\\40239\\AppData\\Local\\atom\\atom.exe" ' + data.path);
}); 