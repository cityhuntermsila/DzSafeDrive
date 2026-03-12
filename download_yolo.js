const https = require('https');
const fs = require('fs');
const path = require('path');

const baseUrl = 'https://raw.githubusercontent.com/Hyuto/yolov8-tfjs/master/public/model/';
const dir = path.join(__dirname, 'public', 'yolov8n_web_model');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const files = [
    'model.json',
    'group1-shard1of4.bin',
    'group1-shard2of4.bin',
    'group1-shard3of4.bin',
    'group1-shard4of4.bin'
];

async function downloadFile(filename) {
    return new Promise((resolve, reject) => {
        const dest = path.join(dir, filename);
        const file = fs.createWriteStream(dest);
        
        console.log(`Downloading ${filename}...`);
        
        https.get(baseUrl + filename, (response) => {
            if (response.statusCode !== 200) {
                return reject(new Error(`Failed to get '${baseUrl + filename}' (${response.statusCode})`));
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function main() {
    for (const file of files) {
        try {
            await downloadFile(file);
        } catch (e) {
            console.error(e);
        }
    }
    console.log("Done");
}

main();
