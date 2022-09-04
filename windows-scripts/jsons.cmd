# jsons = json sort
# take the json string from clipboard
# sort the keys in the json
# format with 2 space per tab
# put output back to clipboard
#
# please create `D:/tmp` folder before running this script
# this script assumes `pwsh` program is already present

@echo off
echo function jsons(obj, space = 2) {const allKeys = [];const seen = {};JSON.stringify(obj, function (key, value) {if (!(key in seen)) {allKeys.push(key);seen[key] = null;}return value;});allKeys.sort();return JSON.stringify(obj, allKeys, space);} > D:/app-data/tmp/tmp.js
echo let aa = >> D:/tmp/tmp.js
pwsh --command "Get-Clipboard" >> D:/tmp/tmp.js
echo ; >> D:/tmp/tmp.js
echo console.log(jsons(aa)); >> D:/tmp/tmp.js
node D:tmp/tmp.js > D:/tmp/output.json
type D:\tmp\output.json | clip
