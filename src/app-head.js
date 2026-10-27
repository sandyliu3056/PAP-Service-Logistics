(function () {
  "use strict";
  /* ---------- small helpers ----------
     $  : lenient lookup — returns an inert stand-in when the element is absent, so the
          map, chart and tool modules can be reused on pages that do not contain them.
     $id: strict lookup. */
  var DUMMY = {
    innerHTML: "", textContent: "", value: "", checked: false, hidden: true, scrollTop: 0, clientWidth: 0, clientHeight: 0, style: {},
    classList: { add: function () {}, remove: function () {}, toggle: function () {}, contains: function () { return false; } },
    setAttribute: function () {}, getAttribute: function () { return null; }, addEventListener: function () {},
    querySelector: function () { return null; }, querySelectorAll: function () { return []; }, insertAdjacentHTML: function () {},
    getBoundingClientRect: function () { return { left: 0, top: 0, width: 0, height: 0, right: 0, bottom: 0 }; }, focus: function () {}, scrollIntoView: function () {}, appendChild: function () {}
  };
  var $ = function (id) { return document.getElementById(id) || DUMMY; };
  var $id = function (id) { return document.getElementById(id); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  // bilingual pair: English first, then Chinese (the guide's order); the language mode hides one of them
  var B = function (zh, en) { return '<span class="en">' + en + '</span><span class="zh">' + zh + "</span>"; };
  var NA = function (zh, en) { return '<span class="na">' + B(zh, en) + "</span>"; };
  var flag = function (cc) { return cc ? '<img class="flag" src="flags/' + cc + '.svg" alt="" loading="lazy">' : ""; };
  var mark = function (v) { return v ? '<span class="mark-ok">✓</span>' : '<span class="no">—</span>'; };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode: do not remember */ } }
  };
  var root = document.documentElement;
  var LANG = "both";
