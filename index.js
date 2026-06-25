// This file is created automatically to fix the Render deployment issue.
// Render tries to run "node index.js" by default, so this file simply forwards it to the actual server file.
require('./src/server.js');
