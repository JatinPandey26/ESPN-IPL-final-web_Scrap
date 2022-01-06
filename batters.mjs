import request from 'request';
import Cheerio from "Cheerio";

import chalk from 'chalk';



let scoreCardURL = "https://www.espn.in/cricket/series/8048/scorecard/1254117/chennai-super-kings-vs-kolkata-knight-riders-final-indian-premier-league-2021";
request(scoreCardURL, cb);

function cb(error, response, html) {
    if (error) {
        console.log("Error : Please fix it");
    }
    else {
        let selTool = Cheerio.load(html);
        batsmenBday(selTool);
        
    }

}

function batsmenBday(selTool){
    let scoreBoardRows = selTool("#gp-inning-00").find(".scorecard-section.batsmen").find(".flex-row");
    
    for(let i = 0 ; i < scoreBoardRows.length ; i++){
      
        let batsmen = selTool(scoreBoardRows[i]).find(".wrap.batsmen").find(".cell.batsmen").find("a");
        
        let batsmenName = selTool(batsmen).text();
        let batsmenProfileLink = selTool(batsmen).attr("href");
         
        if(batsmenProfileLink == undefined) continue;

        getBdayDate(batsmenProfileLink + "");
    }
    
}

function getBdayDate(batsmenProfileLink){
    request(batsmenProfileLink,cb);
    function cb(error, response, html) {
        if (error) {
            console.log("Error : Please fix it");
        }
        else {
            let selTool = Cheerio.load(html);
             
            let playerCard = selTool(".player_overview-grid div");
            let playerNameTab = selTool(playerCard[0]).find(".player-card-description.gray-900").text();
            let playerDatetab = selTool(playerCard[1]).find(".player-card-description.gray-900").text();

            console.log(chalk.blueBright(playerNameTab) + " was born on " + chalk.greenBright(playerDatetab)); 
            
        }
    
    }
}