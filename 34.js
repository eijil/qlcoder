//喜刷刷
const md5 = require('md5');
const request = require('request');
const cluster = require('cluster');
const fs = require('fs');
//分成8个线程来跑
// const array = [
//   [100000,10000000],
//   [10000000,20000000],
//   [20000000,30000000],
//   [30000000,40000000],
//   [40000000,50000000],
//   [50000000,60000000],
//   [60000000,70000000],
//   [80000000,99999999]
// ]
const array = [
  [10000000,15000000],
  [15000000,20000000],
  [20000000,25000000],
  [30000000,35000000],
  [40000000,45000000],
  [50000000,55000000],
  [60000000,70000000],
  [75000000,80000000]

]
const date = '20160620';
const username = '李杰';

if (cluster.isMaster) {

  for (var i = 0; i < array.length; i++) {
    cluster.fork();
  }
} else if (cluster.isWorker) {
    var id = cluster.worker.id -1;
    var i = array[id][0];
    var ticket = 1;
    var url = 'http://www.qlcoder.com/train/handsomerank?_token=9P5Dye2eWhZ8ax8U6L4E8zF4VVodAocQa2eK4MxZ&user=%E6%9D%8E%E6%9D%B0&checkcode='

    //get ticket
    var getTicket = new Promise(function(resolve, reject){
        request(url, function (error, response, body) {
            var patrn=/杰(.*)"的/gmi;
            body = body.match(patrn)[0];
            var len = body.length;
            body = parseInt(body.substring(1,len-2));
            resolve(body);
        })
    })
    var checkMD5 = function* (){
      for(i;i<array[id][1];i++){
        var strmd5 = md5(date + username + ticket + i);
        if(strmd5.substring(0,6) == '000000'){
          console.log(id+':'+date + username + ticket + i +':'+strmd5);
          yield request(url+i, function (error, response, body) {
              console.log(ticket);
          })
        }
      }
    }

    getTicket.then(function(data){
        ticket = data;
        var g = checkMD5();
        g.next();
    })

}
