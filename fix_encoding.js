const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');
content = content.replace(/Sem Responsvel/g, 'Sem Responsável');
content = content.replace(/Sem Respons\ufffdvel/g, 'Sem Responsável');
content = content.replace(/Sem Respons.vel/g, 'Sem Responsável');
fs.writeFileSync('js/app.js', content, 'utf8');
