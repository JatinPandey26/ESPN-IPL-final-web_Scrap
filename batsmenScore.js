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
const path = require('path');



let mainUrl = "https://www.espncricinfo.com/series/ipl-2021-1249214/match-results";

request(mainUrl,cb);

function cb(error, response, html) {
    if (!error) {

        let selTool = cheerio.load(html);

        let match_list = selTool('.card.content-block.league-scores-container .match-score-block' ).find('.match-info-link-FIXTURES');
        let cnt = 0;
        for(let i = 0 ; i < match_list.length ; i++){
          
            let url = selTool(match_list[i]).attr('href');
            console.log(url);
            if(url.charAt(0) == '/') cnt++;
            // eachMatchSummary(url);
        }
        console.log(cnt);
    }
}
function eachMatchSummary(url){


request(url, cb);

function cb(error, response, html) {
    if (!error) {

        let $ = cheerio.load(html);
        getBatsmenScore($);
    }
}
let Match = "";
function getBatsmenScore($) {

    let teams = $(".match-info.match-info-MATCH.match-info-MATCH-half-width .teams .team");
    
    let winningTeamName;

    for (let i = 0; i < teams.length; i++) {
            let teamsArr =  $(teams[i]).find('.name-detail .name-link');
            Match += teamsArr.text() + " ";
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
Match = Match.split(" ").join("_");  
   writeInExcelFile(playersObjectArray);


}

function writeInExcelFile(playersObjectArray){



// writing xlxs 

if(fs.existsSync('Match_Summary') == false) fs.mkdirSync("Match_Summary");
let subFolderPath = path.join(__dirname,'Match_Summary',Match);
if(fs.existsSync(subFolderPath) == false) fs.mkdirSync(subFolderPath);

let stringData = JSON.stringify(playersObjectArray);
let jsonFilePath = path.join(subFolderPath,'stats.json') 
fs.writeFileSync(jsonFilePath,stringData);

let data = require(jsonFilePath);
console.log(data);
let wb = xlsx.utils.book_new();
let ws = xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb,ws,"stat_1");

let xlsxFilePath = path.join(subFolderPath,'playerStats.xlsx');

xlsx.writeFile(wb,xlsxFilePath);

}
}
