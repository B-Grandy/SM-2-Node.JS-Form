let express = require("express");
let bodyParser = require("body-parser");

let app = express();

var buf = {};

//File System
let fs = require("fs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (request, response) => response.sendFile(__dirname + "/index.html")); // sends index.html - server - from get request/ sends back to server (response.sendFile);

app.post("/data", (request, response) => {

    let postBody = request.body;
    let x = postBody.cusID;
    console.log(x);

    try {
        if (fs.existsSync("./data/" + x + '.txt')) {
            console.log("FOUND");

            let read = JSON.parse(fs.readFileSync("./data/" + x + ".txt", { encoding: 'utf8' }));
            postBody.cusID = read.cusID;
            postBody.first = read.first;
            postBody.last = read.last;
            postBody.address = read.address;
            postBody.city = read.city;
            postBody.province = read.province;
            postBody.postal = read.postal;
    
        } else {
            postBody.cusID = "Please enter a valid ID";
            postBody.first = "";
            postBody.last = "";
            postBody.address = "";
            postBody.city = "";
            postBody.province = "";
            postBody.postal = "";
            console.log('\x1b[31m', 'NO INFORMATION FOUND');
        }
    }
    catch (err) {
        console.error(err);
    }
    response.send(postBody);
    console.log(postBody);
});

// ADD TO TEXT FILE
app.post("/add", (request, response) => {

    let txtBody = request.body;
    buf = txtBody.cusID;
    console.log(buf);

    if (fs.existsSync("./data/" + buf + '.txt')) {
        console.log('\x1b[31m', "ERROR - CUSTOMER ID ON FILE ALREADY ");
    }
    else {
        fs.writeFile(("./data/" + buf + ".txt"), JSON.stringify(txtBody), function (err) {
            if (err) {
                console.log('\x1b[31m', err);
            } else {
                console.log("\x1b[32m", "Customer " + buf + " Successfully Added");
            }
        });
    }
    response.send(txtBody);
    console.log(txtBody);
}) 



// Delete Button
app.post("/deleteFile", (request, response) => {

    let deleteBody = request.body;
    let x = deleteBody.cusID;
    console.log(x);
    
        try {
            fs.unlinkSync("./data/" + x + '.txt');
            console.log("Delete Success for customer!");
        } catch (err) {
            console.log('\x1b[31m', "UNSUCCESFUL DELETE, NO CUSTOMER ID FOUND");
        }
    response.send(deleteBody);
    console.log(deleteBody);
});




app.post("/update", (request, response) => {

    let updateBody = request.body;
    let buf = updateBody.cusID;
    console.log(buf);

    if (fs.existsSync("./data/" + buf + '.txt')) {

        fs.writeFile(("./data/" + buf + ".txt"), JSON.stringify(updateBody), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("\x1b[32m", + "Customer has been Succesfully Updated");
            }
        });
   
    }
})


let port = process.env.PORT || 1337;

let server = app.listen(port, function () {
    console.log("\x1b[32m", "Server is Running on " + port + " listening for requests"  + " " + __dirname);
})