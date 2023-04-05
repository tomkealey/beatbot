const express = require('express');
const fs = require('fs');

const beatFile = fs.readFileSync('beats.json');
const beats = JSON.parse(beatFile);
const daysInBeat = 14;

function beatFromDate(dateString, daysOffset) {
  if(daysOffset === null || daysOffset === '' || daysOffset === undefined)
  {
    daysOffset = 0;
  }
  const result = beats.find(element => 
  {
    let StartDate = formatDate(new Date(element.StartDate))
    let EndDate = formatDate(new Date(element.EndDate))
    
    let myDate = new Date(dateString);
    let newDate = formatDate(myDate.setDate(myDate.getDate() + daysOffset));
    
    if(newDate >= StartDate && newDate <= EndDate)
      {
          return element;
      }
  });
  return result;
}

function getQuarterInfo(quarter, year){
  if(year === null || year === '' || year === undefined)
    {
      year = new Date().getFullYear()
    }
  let yearVals = beats.filter(element => year == new Date(element.StartDate).getFullYear())
  let quarterVals = yearVals.filter(element => quarter == element.Quarter);
  return `The dates for Q${quarter} [${year}] Beats ${quarterVals[0].Beat}-${quarterVals[quarterVals.length-1].Beat} are ${formatDate(quarterVals[0].StartDate)} to ${formatDate(quarterVals[quarterVals.length-1].EndDate)}`  
}

function getWeekInfo(week, year){
    if(year === null || year === '' || year === undefined) 
    {
      year = new Date().getFullYear()
    }
  let yearVals = beats.filter(element => year == new Date(element.StartDate).getFullYear())
  let beat = Math.ceil(week / 2)
  let beatVals = yearVals.filter(element => beat == element.Beat)
  return `w${week} corresponds to Q${beatVals[0].Quarter} [${year}] Beat ${beat} and runs ${formatDate(beatVals[0].StartDate)} to ${formatDate(beatVals[beatVals.length-1].EndDate)}`  
}

function getBeatInfo(beat, year){
    if(year === null || year === '' || year === undefined) 
    {
      year = new Date().getFullYear()
    }
  let yearVals = beats.filter(element => year == new Date(element.StartDate).getFullYear())
  let beatVals = yearVals.filter(element => beat == element.Beat)
  return `The dates for Q${beatVals[0].Quarter} [${year}] Beat ${beat} are ${formatDate(beatVals[0].StartDate)} to ${formatDate(beatVals[beatVals.length-1].EndDate)}`  
}

function nextHack(currentBeat, hackBeat, year){
  if(year === null || year === '' || year === undefined) 
    {
      year = new Date().getFullYear()
    }

  let yearVals = beats.filter(element => year == new Date(element.StartDate).getFullYear())
  let beatVals = yearVals.filter(element => hackBeat == element.Beat)
  let beatStartDate = beatVals[0].StartDate;
  let hackStartDate = formatDate(addDays(beatStartDate, 3));
    
  return `\_We hack on every 5th beat at the end of the first week for 2 days.\_\n\It's currently Beat ${currentBeat}. \*The next hackathon is during Beat ${hackBeat} and starts ${hackStartDate}\*`;  
}

function getHelpInfo(){
  let help = `These are the available BeatBot commands:
  \`/beat help|h\` - display this help text
  \`/beat now\` - display the current beat
  \`/beat next|n\` - display the next beat e.g. /beat next
  \`/beat date|d <date>\` - displays the beat on that date e.g. /beat d 2021-06-15
  \`/beat beat|b <beat 1-26> <year>\` - displays the beat start and end dates (\_optional: <year>\_) e.g. /beat b 12
  \`/beat week|w <week 1-52> <year>\` - displays the beat start and end dates (\_optional: <year>\_) e.g. /beat w 32
  \`/beat quarter|q <quarter 1-4> <year>\` - displays the quarter start and end dates (\_optional: <year>\_) e.g. /beat q 3 
  \`/beat hack\` - displays the beat and start date of the next hackathon e.g. /beat hack `
        
  return help
}

function formatDate(dateString){
  let newDate = new Date(dateString).toISOString().substring(0, 10);
  return newDate
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const beatService = {
  getHelp: () => {
    return getHelpInfo();
  },
  getCurrentBeat: () => {
    let beatObject = beatFromDate(new Date());
    let currentBeat = `It's Q${beatObject.Quarter} Beat ${beatObject.Beat} now. This beat ends on ${formatDate(beatObject.EndDate)}`;
    return currentBeat;
  },
  getNextBeat: () => {
    let beatObject = beatFromDate(new Date(), daysInBeat);
    let nextBeat = `It's Q${beatObject.Quarter} Beat ${beatObject.Beat} next. That beat starts on ${formatDate(beatObject.StartDate)}`;
    return nextBeat;
  },
  getBeatFromDate: (dateString) => {
    let beatObject = beatFromDate(dateString)
    let beat = `It's Q${beatObject.Quarter} Beat ${beatObject.Beat} on ${formatDate(dateString)}`
    return beat;
  },
  getBeatDates: (beat, year) => {
    return getBeatInfo(beat, year)
  },
  getWeekDates: (week, year) => {
    return getWeekInfo(week, year)
  },
  getQuarterDates: (quarter, year) => {
    return getQuarterInfo(quarter, year);
  },
  getNextHack: () => {
    let beatObject = beatFromDate(new Date());
    let currentBeat = beatObject.Beat;
    // we hack on every 5th beat
    let hackBeat = Math.ceil(currentBeat/5)*5;
    return nextHack(currentBeat, hackBeat);
  }

}

module.exports = beatService;