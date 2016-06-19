const md5 = require('md5');
const fs = require('fs');
const cluster = require('cluster');
const date = '20160620';
const username = '李杰';
const minCode = 100000;
const maxCode = 100000000;
const list = [
  [403,500],
  [501,600],
  [601,700],
  [701,750],
  [751,800],
  [801,850],
  [851,900],
  [901,1000]
]
if (cluster.isMaster) {
  for (var i = 0; i < list.length; i++) {
    cluster.fork();
  }
} else if (cluster.isWorker) {

    var tickets = [];
    var generateTickets = function(id){
      var i = list[id][0];
      for(i;i<list[id][1];i++){
        tickets.push(i);
      }
    }
    var saveCode = function(id){
      for(var i = minCode;i<maxCode;i++){
        for(var k in tickets){
          var ticket = tickets[k];
          var strmd5 = md5(date + username + ticket + i);
          if(strmd5.substring(0,6) == '000000'){
            tickets.splice(k,1);
            fs.appendFileSync(id +'.txt', ticket +' '+ i +'\n');
            console.log('id:'+id+' ticket：'+ ticket + ' code:'+i);
          }
        }
        if(tickets.length ==0){
          connsole.log('done');
          break;
        }
      }
    }
    var id = cluster.worker.id -1;
    generateTickets(id);
    saveCode(id);

}
