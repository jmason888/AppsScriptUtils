/**
 * @file         Utility Functions & Methods for Apps Script
 * @author       James Mason
 * @version      1.51
 * @description  Fix stuff that is missing or not working in Apps Script classes,
 *   or in Apps Script inplementations of standard classes.
 *   (In the latter case, I can add to the prototype, in the former case,
 *   I declare regular functions with the object as first arg.)
 */
/*
 * @repo         https://github.com/jmason888/AppsScriptUtils
 * @date         2018-09-25_18:38:23 (date +%Y-%m-%d_%H:%M:%S)
 * @commit       {COMMIT}
 */

 
/*
 * TODO: split this into different files by section
 */



/*
 * DOM
 */
 
/**
 * Find the children of a DOM element with a specified name.
 * @param {HTMLElement}       entry   The parent element.
 * @param {String}            name    The name to lok for.
 * @returns {HTMLCollection}          A list of the matching children.
 * @function
 */
function getChildren(entry, name) {
  // (for when we don't want to use jQuery)
  return entry.getChildren().filter(function(e) { return e.getName()==name });
}



/*
 * Number
 */

// NB: Why does Apps Script not import this?
/**
 * Check if a number is an integer.
 * @param {number}      x   The number to check.
 * @returns {boolean}       True if the number is an integer.
 * @function
 * @memberof Number
 */
Number.isInteger = function(x) {
  return (typeof x === 'number') && (x % 1 === 0);
}

/**
 * Integer division.
 * @param {number}      n   The number to be divided.
 * @param {number}      d   The number to divide by.
 * @returns {number}        The (integer) quotient.
 * @function
 */
function DIV(n, d) {
  return Math.floor(n / d);
}


/*
 * Array
 */
 
/**
 * Make a sequence, like the R function of the same name.
 * @param {number} from|count    The count (for 0..count-1) with 1 arg, or the number to start at.
 * @param {number} to            The number to stop at (inclusive).
 * @param {number} by            The difference between adacent items (default: 1.
 * @returns {Array}              The sequence, as a Array of numbers.
 * @function
 * @memberof Array
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
 
// NB: Why does Apps Script not import this?
/**
 * Repeat this String many times
 * @param {number}     n   How many times to repeat.
 * @returns {String}       The longer string.
 * @function
 * @memberof String.prototype
 */
String.prototype.repeat= function(n){
    n= n || 1;
    return Array(n+1).join(this);
}

// NB: Why does Apps Script not import this?
/**
 * Split this large String into chunks with specified max length
 * @param {number}     length   Maximum length of any chunk.
 * @returns {Array}             An array containing the chunks (Strings).
 * @function
 * @memberof String.prototype
 */
String.prototype.chunk= function(length){
  var regExp = new RegExp( ('(.|[\r\n]){1,' + length + "}"), 'g');
  return this.match(regExp); 
}

/**
 * Convert this String to boolean
 * @returns {boolean}       True IFF string contains a "truthy" value.
 * @function
 * @memberof String.prototype
 */
String.prototype.asBoolean = function(){
  var reTrue = RegExp('true','i');
  return reTrue.test(this);
}



/*
 * Date
 */
// NB: Why are the Apps Script enums not useful?
//    (ScriptApp.WeekDay.* resolve to STRINGS, and
//     ScriptApp.Month.* doesn't seem to exist)

/**
 * Enum for day of week values.
 * @enum {number}
 * @memberof Date
 */
Date.DAY = Object.freeze({ // days since Sunday
  SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6
});

/**
 * Enum for zero-based month numbers.
 * @enum {number}
 * @memberof Date
 */
Date.MON = Object.freeze({ // one less than usual month numbers
  JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4,  JUN: 5,
  JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
});

/**
 * Format date in yyyy-MM-dd form.
 * @param {string}     tz   Timezone (null means Script Timezone).
 * @returns {string}        The formatted date.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.toISOLocalDate = function(tz) {
  if (! tz) {
    tz = Session.getScriptTimeZone();
  }
  // this.toISOString().substr(0,10);  // This is always in UTC
  return Utilities.formatDate(this, tz, "yyyy-MM-dd");
}
                                 
/**
 * Parse date in yyyy-MM-dd form.
 * @param {string}     dateStr   A string in the format yyyy-MM-dd.
 * @returns {date}               A new date object with the result.
 * @function
 * @memberof Date
 */
Date.parseISOLocalDate = function(dateStr) {
  // Implicitly uses getScriptTimeZone() in new Date()
  var m = dateStr.match(/^(\d\d\d\d)-([01]\d)-([0-3]\d)$/);
  if (m == null || m.length < 4 || m[1] < 1 ||
      m[2] < 1 || m[2] > 12 ||
      m[3] < 1 || m[3] > 31 ) {
    throw ("Invalid date: " + dateStr);
  }
  return new Date(m[1], m[2] - 1, m[3])
}

/**
 * Add a whole number of days to the date.
 * @param {number}     days   The number of days to add (negative to subtract)
 * @returns {date} A new date object with the result.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * Add a whole number of weeks to the date.
 * @param {number}     weeks   The number of weeks to add (negative to subtract)
 * @returns {date} A new date object with the result.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.addWeeks = function(weeks) {
    return this.addDays(weeks*7);
}

/**
 * Add a whole number of months to the date.
 * @param {number}     months   The number of months to add (negative to subtract)
 * @returns {date} A new date object with the result.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.addMonths = function(months) {
    var date = new Date(this.valueOf());
    date.setMonth(date.getMonth() + months);
    return date;
}

/**
 * The specified day in the current week of the object.
 * @param {number}     dayOfWeek   The day of the week (0 = SUNDAY).
 * @returns {date} A new date object with the result.
 * @function
 * @memberof Date.prototype
 */
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

/**
 * Computes monthly recurrences.
 * @param {number}            months   The number of months between events.
 * @param {number}            mod      For months>1, what month in the cycle should it occur on, as remainder.
 * @param {number}            day      The day on which the event occurs (1-31).
 * @returns {date} A new date object with the date of the recurrence.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.recurrenceMonthly =  function(months, mod, day) {
  mod = (mod-1+months) % months; // because month numbering is weird and we mean mod in natural months

  var result = new Date(this.getTime());
  result.setMonth(result.getMonth()-(result.getMonth()%months)+mod, day);
  if (result < this) {
    result.setMonth(result.getMonth() + months);
  }
  
  return result;
}

/**
 * Computes yearly recurrences.
 * @param {number}            years    The number of years between events.
 * @param {number}            mod      For years>1, what year in the cycle should it occur on, as remainder.
 * @param {number}            month    The month in which the event occurs (1-12).
 * @param {number}           day      The day on which the event occurs (1-31).
 * @returns {date} A new date object with the date of the recurrence.
 * @function
 * @memberof Date.prototype
 */
Date.prototype.recurrenceYearly = function(years, mod, month, day) {
  mod = mod % years;

  var result = new Date(this.getTime());
  result.setFullYear(result.getFullYear()-(result.getYear()%years)+mod, month-1, day);
  if (result < this) {
    result.setFullYear(result.getFullYear() + years);
  }

  return result;
}
