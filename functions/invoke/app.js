const AWS = require("aws-sdk");

exports.lambdaHandler = async (event, context) => {
    const stepFunctions = new AWS.StepFunctions({
        region: 'us-east-1'
    });
    console.log("Start invoke function")
    let errorMessage = "";
    let params = {
        stateMachineArn: "arn:aws:states:us-east-1:367988507966:stateMachine:StockTradingStateMachine-AciISuR7W5sj"
    };
    let statusParams = {
        "executionArn": ""
    };
    if(event['queryStringParameters'] && event['queryStringParameters']['executionArn']) {
        statusParams.executionArn = event['queryStringParameters']['executionArn']
    } else {
        // Start execution of step function
        await stepFunctions.startExecution(params).promise().then(res => {
            console.log("successfully");
            console.log(res);
            statusParams.executionArn = res.executionArn;
        }).catch(error => {
            console.log("failed:" + error);
            console.log(error);
            errorMessage = error;
        });
    }
    console.log(statusParams);

    // Get execution status
    if(errorMessage === ""){
        return stepFunctions.describeExecution(statusParams).promise().then(res => {
            console.log(`Your statemachine executed successfully`);
            const response = {
                statusCode: 200,
                body: JSON.stringify(res),
            };
            console.log(response)
            return response;
        }).catch(error => {
            console.log("failed:" + error);
            const response = {
                statusCode: 500,
                body: JSON.stringify(error),
            };
            return response;
        });
    }

    return errorMessage;
};
