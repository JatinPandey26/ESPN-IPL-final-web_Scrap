const request = require('request');
const Cheerio = require("cheerio");

let scoreCardURL = "https://www.espn.in/cricket/series/8048/scorecard/1254116/delhi-capitals-vs-kolkata-knight-riders-qualifier-2-indian-premier-league-2021";
request(scoreCardURL, cb);

function cb(error, response, html) {
    if (error) {
        console.log("Error : Please fix it");
    }
    else {
        let selTool = Cheerio.load(html);
        mostWicketTakingBowlerInWT(selTool);

    }

}


function mostWicketTakingBowlerInWT(selTool) {
    let maxWickets = 0;
    let maxWicketsBowler = 0;
    let maxWicketsBowlerRuns = 10000;
    let bowlers = selTool("#gp-inning-01 tbody tr");
    for (let i = 0; i < bowlers.length; i++) {

        let performance = selTool(bowlers[i]).find("td");

        let dataWickets = selTool(performance[5]).text();
        let dataRuns = selTool(performance[4]).text();

        if (dataWickets > maxWickets) {
            maxWickets = dataWickets;
            maxWicketsBowler = i;
            maxWicketsBowlerRuns = dataRuns;
        }

        if(dataWickets == maxWickets){

        if(maxWicketsBowlerRuns > dataRuns){
            maxWicketsBowlerRuns = dataRuns;
            maxWicketsBowler = i;
        } 

        }

       

    }
    let bowlerName = selTool(bowlers[maxWicketsBowler]).find("td a").text();
 console.log(`${bowlerName} taken most wickets from winning team -> ${maxWickets}`);

}