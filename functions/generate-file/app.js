const fs = require("fs");
// require json-2-csv module
const converter = require('json-2-csv');

function generateCSVFile() {
    // declare a JSON array
    const todos = [
        {
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
        },
        {
            "id": 2,
            "title": "quis ut nam facilis et officia qui",
            "completed": false
        },
        {
            "id": 3,
            "title": "fugiat veniam minus",
            "completed": false
        }];
    return new Promise((resolve) => {
        // convert JSON array to CSV string
        converter.json2csv(todos, (err, csv) => {
            if (err) {
                throw err;
            }
            // write CSV to a file
            fs.writeFileSync('/tmp/todos.csv', csv);
            resolve(csv)
        });
    });
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
exports.lambdaHandler = async (event, context) => {
    // Get the price of the stock provided as input
    await sleep(31000);
    await generateCSVFile();
    const fileStream = fs.readFileSync("/tmp/todos.csv")
    // get size of the file
    const { size } = fs.statSync("/tmp/todos.csv");

    let res = {
        statusCode: 200,
        isBase64Encoded: true,
        headers: {
            'Content-Type': 'text/csv',
            'Content-Length': size
        },
        body: fileStream.toString('base64')
    }
    console.log(res)
    // Return data
    return res
};
