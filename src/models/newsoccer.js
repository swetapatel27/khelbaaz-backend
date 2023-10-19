var dbConn = require("./../../config/db");
const moment = require("moment");
const axios = require("axios");

require("dotenv").config();

var NewSoccerMaster = function (market) {
  this.event_id = market.event_id;
};

NewSoccerMaster.saveMarkets = async function () {
  const res = await axios.get(
    process.env.BOOK2_API_URL + "socker"
  );
  const result2 = {};

  const response = res.data;
  if (response.success) {
    if( response.data.t1.length > 0 ){
        // return response.data.t1;
        // const result = response.data.t1.filter(function (market) {
        //   return market.m == "1";
        // });
        const result = response.data.t1;
        // return result;
        // Use Promise.all to handle multiple async calls concurrently
        const promises = result.map(async function (market) {
            //console.log(market);
            let m1 = null;
            m1 = await saveTomarket(market);
            const eventData = await geteventsData(market.gmid);
            var ed = await saveEventData(eventData);
            result2[market.gmid] = ed;
        });

        // Wait for all promises to resolve
        await Promise.all(promises);
    }
    return result2;
  }
  return { 'status': "something went wrong" };
}

const geteventsData = async (event_id) => {
    try {
      const res = await axios.get(
        process.env.BOOK2_API_URL + "getOdds?eventId=" + event_id
      );
  
      const response = res.data;
      if (response.status == 200) {
        const data = response.data;
  
        if (data && Array.isArray(data) && data.length > 0) {
          return data;
        } else {
          return null;
        }
      } else {
        throw new Error("API request was not successful for event_id: " + event_id);
      }
    } catch (error) {
      console.error("Error in geteventsData:", error);
      throw error; // Re-throw the error so it can be caught in the calling function
    }
  }

const saveEventData = async (data) => {
    const market = data[0];
    if (market === null || typeof market === 'undefined') return true;
    try {
        const result = await new Promise((resolve, reject) => {
            const runner = getRunners(market.ename);
            // return resolve(runner);
            const section = filterSections(market.section);
            // status - ACTIVE/SUSPENDED/OPEN
            // return resolve(section);
            const r1back = extractOdds(section[0].odds, 'back');
            const r1lay = extractOdds(section[0].odds, 'lay');
            const r2back = extractOdds(section[1].odds, 'back');
            const r2lay = extractOdds(section[1].odds, 'lay');
            const r3back = extractOdds(section[2].odds, 'back');
            const r3lay = extractOdds(section[2].odds, 'lay');
            const data = [
                market.gmid,
                market.mid,
                runner[0],
                runner[1],
                runner[2],
                market.status.toUpperCase(),
                market.iplay?1:0,
                r1back.price,
                r1back.size,
                r1lay.price,
                r1lay.size,
                r2back.price,
                r2back.size,
                r2lay.price,
                r2lay.size,
                r3back.price,
                r3back.size,
                r3lay.price,
                r3lay.size,
                market.gmid,
                market.mid,
                runner[0],
                runner[1],
                runner[2],
                market.status.toUpperCase(),
                market.iplay?1:0,
                r1back.price,
                r1back.size,
                r1lay.price,
                r1lay.size,
                r2back.price,
                r2back.size,
                r2lay.price,
                r2lay.size,
                r3back.price,
                r3back.size,
                r3lay.price,
                r3lay.size,
            ];
            dbConn.query("insert into soccerodds(event_id,market_id,runner1,runner2,runner3,status,inplay,back0_price,back0_size,lay0_price,lay0_size,back1_price,back1_size,lay1_price,lay1_size,back2_price,back2_size,lay2_price,lay2_size)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) on duplicate key update event_id=?,market_id=?,runner1=?,runner2=?,runner3=?,status=?,inplay=?,back0_price=?,back0_size=?,lay0_price=?,lay0_size=?,back1_price=?,back1_size=?,lay1_price=?,lay1_size=?,back2_price=?,back2_size=?,lay2_price=?,lay2_size=?",
            data,
            (err, res)=>{
                if (err) {
                console.log(err);
                reject(err);
                } else {
                resolve(data);
                }
            });
        });
        return result;
    } catch (err) {
        console.log(err);
    }
}
const saveTomarket = async (market) => {
    // const section = market.section;
    try {
        const result = await new Promise((resolve, reject) => {
            const runner = getRunners(market.ename);
            const data = [
                market.gmid,
                market.ename,
                market.mid,
                market.mname,
                moment(market.stime).format("YYYY-MM-DD HH:mm:ss"),
                runner[0],
                runner[1],
                runner[2],
                market.gmid,
                market.ename,
                market.mid,
                market.mname,
                moment(market.stime).format("YYYY-MM-DD HH:mm:ss"),
                runner[0],
                runner[1],
                runner[2],
            ];
            //dbConn.query("REPLACE INTO soccermarkets(event_id,event_name,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?)",
            dbConn.query("INSERT INTO soccermarkets(event_id,event_name,market_id,market_name,start_time,runner1,runner2,runner3) values(?,?,?,?,?,?,?,?) on duplicate key update event_id=?,event_name=?,market_id=?,market_name=?,start_time=?,runner1=?,runner2=?,runner3=?",
            data,
            (err, res)=>{
                if (err) {
                console.log(err);
                reject(err);
                } else {
                resolve(data);
                }
            });
        });
        return result;
    } catch (err) {
        console.log(err);
    }
}

function filterSections(sectionArray){
    sectionArray.sort((a, b) => {
        if (a.nat === "The Draw") return 1;
        if (b.nat === "The Draw") return -1;
        return a.nat.localeCompare(b.nat);
    });
    // sectionArray.sort((a, b) => a.sno - b.sno)
  
    return sectionArray;
}

function getRunners_old(text){
    const res = text.split("-");
    var ename=res.map(s => s.trim());
    if(ename[1]==null){
        const res1 = text.split(" v ");
        ename=res1.map(s => s.trim());
    }
    return [ename[0], ename[1], "The Draw"];
}
function getRunners(text){
  const words = text.split(' ');
  const teamNames = [];
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i].trim();
    if (currentWord && currentWord !== '-' && currentWord.toLowerCase() !== 'v') {
      let teamName = currentWord;
      for (let j = i + 1; j < words.length; j++) {
        const nextWord = words[j].trim();
        if (nextWord && nextWord !== '-' && nextWord.toLowerCase() !== 'v') {
          teamName += ' ' + nextWord;
          i = j;
        } else {
          break;
        }
      }
      teamNames.push(teamName);
    }
  }
  teamNames.push("The Draw");
  return teamNames;
}

function extractOdds(oddsArray, otype) {
    let price;
    let size;
    for (const odds of oddsArray) {
        if (odds.otype === otype) {
            price = odds.odds;
            size = odds.size;
            break; // Stop when the first match is found
        }
    }
    return { price, size };
}

module.exports = NewSoccerMaster;
