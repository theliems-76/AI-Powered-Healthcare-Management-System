const fs = require('fs');
const path = require('path');

const dir = 'd:/Healthcare_Web_Project/frontend_app/src';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // First do the complex HTML replacement
    content = content.replace(/Clinical<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">AI<\/span>/g, 'Hiệp Sĩ<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400"> Tiểu Đường<\/span>');

    // Then simple string replacements
    content = content.replace(/ClinicalAI/g, 'Hiệp Sĩ Tiểu Đường');
    content = content.replace(/Clinical AI/g, 'Hiệp Sĩ Tiểu Đường');
    content = content.replace(/admin@clinicalai\.com/g, 'admin@hiepsitieuduong.online');
    content = content.replace(/Clinical_AI_Report/g, 'HSTD_Report');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated: ' + filePath);
    }
}

function walkDir(d) {
    fs.readdirSync(d).forEach(f => {
        let fullPath = path.join(d, f);
        if (fs.statSync(fullPath).isDirectory()) walkDir(fullPath);
        else if (f.endsWith('.jsx') || f.endsWith('.js')) replaceInFile(fullPath);
    });
}

walkDir(dir);
