/**
 * Lanello Heights — landing page web app.
 * Masaito Homes · Brgy. Pasong Camachile II, General Trias, Cavite.
 */

var SHEET_NAME = 'Inquiries';
var SHEET_PROP = 'INQUIRY_SHEET_ID';
var MODELS = ['Abbie', 'Brenda', 'Chelsea'];

function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Lanello Heights | Pre-selling homes in General Trias, Cavite')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Pulls another project file (styles, script) into the template. */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/** Returns a data URI stored in media/<name>.html. */
function img(name) {
  return include('media/' + name).trim();
}

/**
 * Called from the page via google.script.run.
 * @param {{name:string, mobile:string, model:string, website?:string}} form
 * @return {{ok:boolean, message:string}}
 */
function submitInquiry(form) {
  form = form || {};

  // Honeypot: real visitors never see or fill this field.
  if (form.website) return { ok: true, message: 'Thanks! We will be in touch.' };

  var name = String(form.name || '').replace(/\s+/g, ' ').trim();
  var mobile = normalizeMobile_(form.mobile);
  var model = String(form.model || '').trim();

  if (name.length < 2 || name.length > 80 || !/^[\p{L}][\p{L} .,'-]*$/u.test(name)) {
    throw new Error('Please enter your full name (letters only).');
  }
  if (!mobile) {
    throw new Error('Please enter a valid PH mobile number, e.g. 0917 123 4567.');
  }
  if (MODELS.indexOf(model) === -1) {
    throw new Error('Please choose a model: Abbie, Brenda, or Chelsea.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    getSheet_().appendRow([safeCell_(name), safeCell_(mobile), model, new Date()]);
  } finally {
    lock.releaseLock();
  }

  return {
    ok: true,
    message: 'Thank you, ' + name.split(' ')[0] + '! A buyer assistance officer will text you soon about the ' + model + '.'
  };
}

/** Accepts 09XXXXXXXXX, 9XXXXXXXXX, 639XXXXXXXXX, +639XXXXXXXXX (spaces/dashes ok). Returns +639XXXXXXXXX or ''. */
function normalizeMobile_(raw) {
  var digits = String(raw || '').replace(/[\s\-().]/g, '');
  var m = digits.match(/^(?:\+?63|0)?(9\d{9})$/);
  return m ? '+63' + m[1] : '';
}

/** Stops spreadsheet formula injection (=, +, -, @ at the start of a cell). */
function safeCell_(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function getSheet_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty(SHEET_PROP);
  var ss;
  if (id) {
    try { ss = SpreadsheetApp.openById(id); } catch (e) { ss = null; }
  }
  if (!ss) {
    ss = SpreadsheetApp.create('Lanello Heights — Inquiries');
    props.setProperty(SHEET_PROP, ss.getId());
  }
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Name', 'Mobile', 'Model', 'Timestamp']);
    sheet.setFrozenRows(1);
    sheet.getRange('A1:D1').setFontWeight('bold');
  }
  return sheet;
}

/**
 * Run once from the Apps Script editor before deploying: authorizes the
 * Sheets scope and creates the inquiries spreadsheet. Its URL is logged.
 * To use an existing sheet instead, set Script Property INQUIRY_SHEET_ID.
 */
function setup() {
  var sheet = getSheet_();
  Logger.log('Inquiries sheet: ' + sheet.getParent().getUrl());
}
