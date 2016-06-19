const request = require('request');
const exec = require('child_process').exec;
var ticket = 524;
var url = 'http://www.qlcoder.com/train/handsomerank?_token=9P5Dye2eWhZ8ax8U6L4E8zF4VVodAocQa2eK4MxZ&user=%E6%9D%8E%E6%9D%B0&checkcode='

exec('pm2 start 34.js',(error, stdout, stderr)=>{
  console.log('start');
})

setInterval(function(){
  request(url, function (error, response, body) {
      var patrn=/杰(.*)"的/gmi;
      body = body.match(patrn)[0];
      var len = body.length;
      body = parseInt(body.substring(1,len-2));
      if(body > ticket){
        ticket = body;
        exec('pm2 stop all && pm2 start 34.js',(error, stdout, stderr)=>{
          console.log('restart');
        })
      }
      console.log(body)
  })
},2000)
