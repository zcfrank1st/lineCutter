var
  fs = require('fs'),
  _ = require('underscore'),
  line = require('line-reader'),
  xlsx = require('node-xlsx');

var options = {
  lineNum: 1000000
};

function genFile(sliceNum, line) {
  fs.writeFile(sliceNum + '_cutter_split.txt', line + '\n', {
    flag: 'a'
  }, function (err) {
    if (err) throw err;
  });
}


var cutter = module.exports;

/**
 * 按行切分普通文件
 * @param fileName
 * @param lineNum
 **/
cutter.simpleCutter =
  function simpleCutter(fileName, lineNum) {
    var
      count = 1,
      thredhold = lineNum || options.lineNum,
      sliceNum = 0;

    line.eachLine(fileName, function (line, last) {
      if (count > thredhold) {
        sliceNum = sliceNum + 1;
        count = 1;
        genFile(sliceNum, line);
      } else {
        genFile(sliceNum, line);
      }
      if (!last) {
        count = count + 1;
      } else {
        console.log('SimpleCutter finish cutting!');
      }
    });
};

/**
 * 按行切分 .xlsx 文件
 * @param fileName
 * @param lineNum
 **/
cutter.xlsxCutter =
  function xlsxCutter(fileName, lineNum) {
    var obj = xlsx.parse(fileName);
    var dataObj = _.filter(obj.worksheets, function filtNil(data) {
      return data.data.length !== 0
    });

    var lineArr = [],
      lineCount = 1,
      sliceNum = 0,
      thredhold = lineNum || options.lineNum;

    // 单sheet值存储
    dataObj[0].data.forEach(
      function (ele, index) {
        var line = "";
        for (var i = 0; i < ele.length; i++) {
          line = line + ele[i].value + '\t';
        }
        lineArr.push(line);
      }
    );

    var tag = 1;
    for (var i = 0; i < lineArr.length; i++) {
      if (tag > thredhold) {
        sliceNum = sliceNum + 1;
        tag = 1;
        genFile(sliceNum, lineArr[lineCount - 1]);
      } else {
        genFile(sliceNum, lineArr[lineCount - 1]);
      }
      lineCount = lineCount + 1;
      tag = tag + 1;
    }
};