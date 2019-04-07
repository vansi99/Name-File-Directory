const express = require('express');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const os = require("os");
const cors = require("cors");

app.use(morgan(':remote-addr - [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(cors());
const port = 3000;
const fs = require("fs");

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/files', (req, res) => {
    try {

        let { path } = req.query;
        
        if(!path){
            path = os.homedir()+"/";
        }
        console.log(path);

        let items = fs.readdirSync(path);

        items = items.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));
        let listPath = [];

        for (let i = 0; i < items.length; i++) {
            let file = path + items[i];
            if (fs.statSync(file).isDirectory()) {
                listPath.push({
                    name: file,
                    folder: 1
                })
            } else {
                listPath.push({
                    name: file,
                    folder: 0
                });
            }
        }

        res.json(listPath);

    } catch (err) {
        console.log(err.message);
    }
})

app.listen(port, () => console.log(`Get name of file in directory app listening on port ${port}!`));

module.exports = app;