const express = require('express');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();

app.use(morgan(':remote-addr - [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(bodyParser.json({
    limit: '100mb'
}));
const port = 3000;
const fs = require("fs");

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/files', (req, res) => {
    try {

        const { path } = req.body;
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