//require.paths.push(--dirname);
//require.paths.push(--dirname + "/deps");
//require.paths.push(--dirname + "/lib");
var reporter = require('nodeunit').reporters.default;
process.chdir(__dirname);
reporter.run(['test/chapp']);