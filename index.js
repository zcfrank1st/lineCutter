var line = require('line-reader');
var fs = require('fs');

var options = {
  lineNum: 1000000
};

/**
 * 按行切分文件
 * @param lineNum
 **/
function lineCutter(fileName, lineNum) {
  var count = 1,
    thredhold = lineNum || options.lineNum,
    sliceNum = 0;

  line.eachLine(fileName, function (line, last) {
    if (count > thredhold) {
      sliceNum = sliceNum + 1;
      count = 1;
      fs.writeFile(sliceNum + '_split.txt', line + '\n', {flag: 'a'},function (err) {
        if (err) throw err;
        count = count + 1;
      });
    } else {
      fs.writeFile(sliceNum + '_split.txt', line + '\n', {flag: 'a'}, function (err) {
        if (err) throw err;
        count = count + 1;
      });
    }
    if (!last) {
      count = count + 1;
    } else {
      console.log('lineCutter finish cutting!');
    }
  });
}

lineCutter('./test/1.txt', 10);