const express = require('express'); // for api framework
const basicAuth = require('express-basic-auth');
const mongoose = require('mongoose'); // for access the models
const fileUpload = require('express-fileupload');
const fs = require('fs');
const util = require('util');
const cors = require('cors');
const app = express();
const cwd = process.cwd();
const env = process.env
mongoose.set('useCreateIndex', true); // mongoose default config settings
mongoose.connect(env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, }); // mention database name
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload());
app.use(cors());
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});


app.use(express.static(cwd + '/public'));
app.use(express.static(cwd + '/build'));

app.use(async(req, res, next) => {
    var url = req.url;
    console.log("url",url)
    const uriArray = url.split('/');
    if (uriArray[1] !== 'api') {
        const redaFile = util.promisify(fs.readFile)
        if (uriArray[1] == "media") {
            const pathImage = uriArray[4];
            console.log("pathImage",pathImage)
            var extension = pathImage.split('.').pop();
            url = url.split('?');
            url = url[0];
            var extension_exp = extension.split('?');
            if(extension_exp.length==2)
            {
                extension = extension_exp[0]
            }
            const contentType = 'image/' + extension;
            const file = "." + url;
            // console.log(file)
            fileToLoad = fs.readFileSync(file);
            res.writeHead(200, { 'Content-Type': contentType });
            return res.end(fileToLoad, 'binary');
        } 
       
        else if(uriArray[1] == "admin")
        {
            try {
                var text = await readFile(cwd + '/build/index.html', 'utf8')
                return res.send(text)
            } catch (error) {
                return res.send(error.message)
            }
         } 
    }
    next()
});
/* Api Based Routes Middlewares */

/* Get method validation Middleware */
app.use((req, res, next) => {
    if (req.method.toLowerCase() !== 'post') {
        res.send({
            status: false,
            message: "Get method not allowed",
            data: null
        })
        return res.end()
    }
    next()
})

/* Basic Auth Middleware */
app.use(
    basicAuth({
        users: {
            [env.API_BASIC_AUTH_USERNAME]: env.API_BASIC_AUTH_PASSWORD
        },
        unauthorizedResponse: (req) => {
            return {
                status: false,
                message: 'Basic auth failed',
                data: null
            }
        }
    })
)
 
/* Api Response Middleware */
app.use((req, res, next) => {

    res.apiResponse = (status, message, data = null) => {
        // var message = __(message);
        res.send({
            status,
            message,
            data
        })
        return res.end()
    }
    var contype = req.headers['content-type'];

    if ((!contype || contype.indexOf('multipart/form-data') !== 0) && !req.body.params) {
        return res.apiResponse(false, "Params is required")
    }
    var params = req.body.params

    if ((typeof params).toLowerCase() !== 'object') {
        try {
            if (params != undefined) {
                params = JSON.parse(params)
            }

        } catch (e) {
            return res.apiResponse(false, "Params is not a valid JSON")
        }
        if ((typeof params).toLowerCase() !== 'object' && (typeof params).toLowerCase() !== 'undefined') {
            return res.apiResponse(false, "Params is not a valid JSON")
        }
    }
    req.bodyParams = params
    next()
})

/* Api Routes */
app.get('/api', function(req, res) {
    res.apiResponse(true, "Basic auth working")
})

const authroutes=require('./routes/auth')
const usersroutes=require("./routes/users")
const categoryroutes=require("./routes/category")
const setting=require("./routes/setting")
const static=require("./routes/staticpage")

app.use('/api/auth' ,authroutes)
app.use('/api/user',usersroutes)
app.use('/api/category',categoryroutes)
app.use("/api/setting",setting)
app.use("/api/static",static)



app.use((req, res, next) => {
    console.log(req)
    return res.send('404');
});

module.exports = app;
