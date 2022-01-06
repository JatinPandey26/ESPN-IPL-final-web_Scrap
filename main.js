 let commentaryURL = "https://www.espn.in/cricket/series/8048/commentary/1254117/chennai-super-kings-vs-kolkata-knight-riders-final-indian-premier-league-2021";
const request = require('request');
const cheerio = require('cheerio');
const { getSystemErrorMap } = require('util');

request(commentaryURL,cb);

function cb(error,response,html){
    if(error){
        console.log("Error : Please fix it");
    }
    else{

    handleHtml(html);

    }

}

function handleHtml(html){

let selTool = cheerio.load(html);

lastBallCommentary(selTool);

}

function lastBallCommentary(selTool){
    let content = selTool(".content match-commentary__content,.commentary-item pre , .description ");
  
    let data = selTool(content[0]).text();
    console.log("Last Ball -> " + data);
    console.log("-----------------------------");
    
}

