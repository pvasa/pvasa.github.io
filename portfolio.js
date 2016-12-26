let // PORT and IP where server listens
    PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    IP = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || `0.0.0.0`,
    express = require(`express`), // Express server
    server = express(),
    compression = require(`compression`), // Compress network responses
    bodyParser = require(`body-parser`), // Encoded body parser
    nodemailer = require(`nodemailer`);

server.use(compression());

/**
 * Add security headers
 * https://www.npmjs.com/package/helmet
 */
let helmet = require(`helmet`);
server.use(helmet());

/**
 * Parse encoded bodies
 * https://www.npmjs.com/package/body-parser
 */
server.use( bodyParser.json() );       // to support JSON-encoded bodies
server.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Use pug for static content
server.set(`view engine`, `pug`);

server.locals.basedir = `${__dirname}`;

// Short paths for css, js, and assets dirs
server.use(`/assets`, express.static(__dirname + `/assets`));

server.get(`/`, function (req, res) {
    res.render(`index`);
});

// Redirect every get request to /
server.use(`/*`, function (req, res) {
    res.redirect(`/`);
});

server.post(`/`, function (req, res) {

    console.log(`REQUEST FOR MAIL: ${req.body}`);

    let transporter = nodemailer.createTransport(
        `smtps://priyank.vasa5%40gmail.com:Pr-G0ogle-Ma!l@smtp.gmail.com`),
        from = `${req.body.name} <${req.body.email}>`,
        subject = `Developer required by ${req.body.name}: ${req.body.subject}`;

    // setup e-mail data with unicode symbols
    let mailOptions = {
        from: from, // sender address
        to: "priyank.vasa5@gmail.com", // list of receivers
        subject: subject, // Subject line
        text: req.body.message // plaintext body
    };
    
    // send mail with defined transport object 
    transporter.sendMail(mailOptions, function(err, info) {
        if (err || !info) {
            res.status(300);
            console.log(`Error: ${err.message}`);
            res.send({"message": "error"});
        } else {
            res.status(200);
            console.log(`E-mail sent: ${info.response}`);
            res.send({"message": "success"});
        }
    });
});

server.listen(PORT, IP);