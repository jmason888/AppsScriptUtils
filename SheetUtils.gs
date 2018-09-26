/**
 * @file         Additional Utility Functions for use in Google Sheets
 * @author       James Mason
 * @version      1.51
 */
/*
 * @repo         https://github.com/jmason888/AppsScriptUtils
 * @date         2018-09-25_{TIME} (date +%Y-%m-%d_%H:%M:%S)
 * @commit       {COMMIT}
 */





/**
 * Get the association between names and columns for the current spreadsheet.
 * @param {Range}             range        The range to search: this determines the columns, the row is always the first row.
 * @param {Boolean}           zeroBased    Are the column numbers zero-based (like an Array), or one-base (like spreadsheet columns)?
 * @returns {Object}                       An object used as a map from names to columns.
 * @function
 */
function getNames(range, zeroBased) {
  var header = range.getSheet().getRange(1, range.getColumn(), 1, range.getNumColumns()).getValues()[0];
  return header.reduce(function(acc, val, ind) {
    acc[val.replace(/ /g, "").toLowerCase()] = ind + (zeroBased ? 0 : 1);
    return acc;
  }, {} )
}

/**
 * Read a Control Parameter from the spreadsheet.
 * @param {Spreadsheet}          spreadsheet  The current Spreadsheet object (must have a "CTRL" named range).
 * @param {String}               name         The name of the control parameter.
 * @returns {Array|Date|number}               The current value of the control parameter.
 * @function
 */
function getControlParam(spreadsheet, name) {
  var range = spreadsheet.getRangeByName("CTRL");
  var reName = RegExp("^" + name + ":?$");
  return range.getValues()
              .filter(function(r) {
                return reName.test(r[0]);
              })[0][1];
}

/**
 * Write a Control Parameter to the spreadsheet.
 * @param {Spreadsheet}          spreadsheet  The current Spreadsheet object (must have a "CTRL" named range).
 * @param {String}               name         The name of the control parameter.
 * @param {Array|Date|number}    val          The new value of the control parameter.
 * @function
 */
function setControlParam(spreadsheet, name, val) {
  var range = getNamedRange(spreadsheet, "CTRL");
  var row = range.getValues()
                 .map(function(r, idx, ary) {
                   if (r[0] == name) {
                     return idx+1;
                   } else {
                     return null;
                   }})
                 .filter(Boolean)[0];
  range.getCell(row, 2).setValue(val);
  return val;
}

/**
 * Compute the intersection (overlap) between two Ranges.
 * @param {Range}        r1    A range to intersect.
 * @param {Range}        r2    A range to intersect.
 * @returns {Range}            The intersection.
 * @function
 */
function rangeIntersection(r1, r2) {
  if (r1.getSheet().getSheetId() != r2.getSheet().getSheetId()) {
    return null;
  }
  var startRow    = Math.max(r1.getRow(),        r2.getRow());
  var endRow      = Math.min(r1.getLastRow(),    r2.getLastRow());
  var startColumn = Math.max(r1.getColumn(),     r2.getColumn());
  var endColumn   = Math.min(r1.getLastColumn(), r2.getLastColumn());
  if (startRow > endRow || startColumn > endColumn) {
    return null;
  }
  return r1.getSheet().getRange(startRow, startColumn, endRow - startRow + 1, endColumn - startColumn + 1);
}

