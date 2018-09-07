/***
 *** SYNC:    several projects
 *** REPO:    https://github.com/jmason888/AppsScriptUtils
 *** VERSION: 1.5
 *** DATE:    2018-09-07_12:24:45 (date +%Y-%m-%d_%H:%M:%S)
 *** COMMIT:  
 ***/

/*
 * Utility Functions & Methods:
 *
 * Fix stuff that is missing or not working in Apps Script classes,
 * or in Apps Script inplementations of standard classes.
 * (In the latter case, I can add to the prototype, in the former case,
 *  I declare regular functions with the object as first arg.)
 */



/*
 * DOM
 */
function getChildren(entry, name) {
  return entry.getChildren().filter(function(e) { return e.getName()==name });
}



/*
 * Number
 *
 * Why does Apps Script not import static functions from Number?
 */
Number.isInteger = function(x) {
  return (typeof x === 'number') && (x % 1 === 0);
}
// if (tryString && (typeof x === 'string')) { return /^\d+$/.test(x); }

function DIV(n, d) {
  return Math.floor(n / d);
}


/*
 * Array
 */
Array.seq = function(from, to, by) {
  if (from == null) { return []; }
  var count;
  if (to == null) {
    count = from;
    from = 0;
  } else {
    count = 1+to-from;
  }
  if (by == null) {
    by = 1;
  } else {
    count = Math.ceil(count/by);
  }
  
  return (Array.apply(null, Array(count)).map(function(x, i) { return (Math.floor(from+i*by)); }))
}



/*
 * String
 */
String.prototype.repeat= function(n){
    n= n || 1;
    return Array(n+1).join(this);
}

// Split a large string into chunks with specified max length
String.prototype.chunk= function(length){
  var regExp = new RegExp( ('(.|[\r\n]){1,' + length + "}"), 'g');
  return this.match(regExp); 
}

// String to boolean
String.prototype.asBoolean = function(){
  var reTrue = RegExp('true','i');
  return reTrue.test(this);
}



/*
 * Date
 */
// Useful enums
Date.DAY = Object.freeze({ // days since Sunday
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
});
Date.MON = Object.freeze({ // one less than usual month numbers
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4,  JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
});

// Return date in 2018-12-25 form
Date.prototype.toISODate = function(){
  return this.toISOString().substr(0,10);
}

// Parse date in 2018-12-25 form
Date.parseISODate = function(dateStr) {
  var m = dateStr.match(/^(\d\d\d\d)-([01]\d)-([0-3]\d)$/);
  if (m == null || m.length < 4 || m[1] < 1 ||
      m[2] < 1 || m[2] > 12 ||
      m[3] < 1 || m[3] > 31 ) {
    throw ("Invalid date: " + dateStr);
  }
  return new Date(m[1], m[2] - 1, m[3])
}

// Negative arguments work for subtracting days
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

// Negative arguments work for subtracting weeks
Date.prototype.addWeeks = function(weeks) {
    return this.addDays(weeks*7);
}

// Negative arguments work for subtracting months
Date.prototype.addMonths = function(months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
}

Date.prototype.dayInSameWeek = function(dayOfWeek) {
  if (dayOfWeek == null) {
    // Returns the previous Sunday
    return this.addDays(- this.getDay());
  } else if (dayOfWeek < Date.DAY.SUN || dayOfWeek > Date.DAY.SAT) {
    throw ("Day of week out of bounds: " + dayOfWeek);
  } else {
    // Returns the requested day (0=Sun..6=Sat) of the same week
    return this.addDays(- this.getDay() + dayOfWeek);
  }
}
