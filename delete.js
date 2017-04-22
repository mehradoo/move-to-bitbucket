var fs = require("fs-extra");

var request = require('request');

var settings = require("./settings.json");
var lineReader = require('readline').createInterface({
    input: fs.createReadStream('input.txt')
});

var bitbucketApiUrl = settings.bitbucket_api_url;

execDeleteBitbucketRepo = (repoName, callback) => {
    console.log('deleting repo ' + repoName + ' from Bitbucket');
    request
        .delete({
            url: bitbucketApiUrl + '/repositories/' + settings.bitbucket_account + '/' + repoName,
        }, callback)
        .auth(settings.bitbucket_username, settings.bitbucket_password, true);
};

lineReader.on('line', function (line) {
    console.log('Processing :', line);

    let repoName = line;

    execDeleteBitbucketRepo(repoName, function (error, response, body) {
        if (error) {
            console.log('error:', error);
            throw "cannot delete repo from bitbucket";
        }

        if (body) console.log('body:', body);
        //TODO: check status code
        console.log('Finished processing ', line, ' with status code:', response && response.statusCode);
    });

});





