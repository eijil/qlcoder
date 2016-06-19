//http://www.qlcoder.com/task/7560
const Horseman = require('node-horseman');
const pages = [0,25,50,75,100,125,150];
var sum =0;
pages.forEach((page) => {

    var horseman = new Horseman();
    horseman
        .open(`https://movie.douban.com/top250?start=${page}`)
        .evaluate(function(selector,page) {
            var score = 0;
            $(selector).each(function(i) {
                score += parseFloat($(this).text());
                if(page == 150 && i == 15){
                  return false;
                }
            })
            return score;
        }, '.rating_num',page)
        .then((score) => {
            console.log(sum+=score);
        })
        .close();

})
