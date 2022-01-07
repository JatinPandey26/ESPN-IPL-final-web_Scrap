class batsmanStats {
    constructor(name, runs, balls, fours, sixes) {
        this.name = name,
            this.runs = runs,
            this.balls = balls
        this.fours = fours,
            this.sixes = sixes
    }
}

const request = require('request');
const cheerio = require('cheerio');
const xlsx = require('xlsx');
const fs = require('fs');
let url = "https://www.espncricinfo.com/series/ipl-2021-1249214/delhi-capitals-vs-kolkata-knight-riders-qualifier-2-1254116/full-scorecard";

request(url, cb);

function cb(error, response, html) {
    if (!error) {

        let $ = cheerio.load(html);
        getBatsmenScore($);
    }
}

function getBatsmenScore($) {

    let teams = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .teams .team");

    let winningTeamName;

    for (let i = 0; i < teams.length; i++) {

        if ($(teams[i]).hasClass('team-gray') == false) {
            let contentArr = $(teams[i]).find('.name-detail .name-link');

            let data = contentArr.text();
            winningTeamName = data;
        }

    }

    let playersObjectArray = [];

    let teamsCollapseCard = $('.match-scorecard-page .Collapsible');  /// got playercards - 2 

    for (let i = 0; i < teamsCollapseCard.length; i++) {        /// get playersobjarray
        let data = $(teamsCollapseCard[i]).find('.header-title.label').text();
        let dataArray = data.split('INNINGS');


        if (dataArray[0].trim() == winningTeamName) {              // got winning team section

            console.log(dataArray[0]);
            let batsmenTableHead = $(teamsCollapseCard[i]).find('.table.batsman thead tr th'); // header of stats
            let batsmenTable = $(teamsCollapseCard[i]).find('.table.batsman tbody tr');        // player stat row


            for (let j = 0; j < batsmenTable.length; j++) {

                let obj = new batsmanStats();                          // obj created
                let batsmenStatArray = $(batsmenTable[j]).find('td');      // player - cols
                for (let s = 0; s < batsmenStatArray.length; s++) {
                    let data = $(batsmenStatArray[s]).text();          
                    let objfield = $(batsmenTableHead[s]).text();     // finding which class they belongs to 
                    if(objfield == 'BATTING') objfield = 'name'; 
                    else if(objfield == 'R') objfield = 'runs'; 
                    else if(objfield == 'B') objfield = 'balls'; 
                    else if(objfield == '4s') objfield = 'fours'; 
                    else if(objfield == '6s') objfield = 'sixes'; 
                    else continue;
                    obj[objfield] = data;                           // obj prop set
 
                }
                if(obj.name != 'Extras' && obj.name != 'undefined' && obj.name != ''){
                    playersObjectArray.push(obj);     // obj pushed to array
                }

            }


        }
// console.log(playersObjectArray);
    }
//    console.log(playersObjectArray);
   writeInExcelFile(playersObjectArray);

}

function writeInExcelFile(playersObjectArray){

let stringData = JSON.stringify(playersObjectArray);
fs.writeFileSync('./stats.json',stringData);

// writing xlxs 
let data = require('./stats.json');
console.log(data);
let wb = xlsx.utils.book_new();
let ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb,ws,"stat_1");
xlsx.writeFile(wb,"playerStats.xlsx") 

}


