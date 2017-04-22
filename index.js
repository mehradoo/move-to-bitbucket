var execSync = require('child_process').execSync;
var fs = require("fs-extra");

var request = require('request');

var settings = require("./settings.json");
var lineReader = require('readline').createInterface({
    input: fs.createReadStream('input.txt')
});

var bitbucketApiUrl = settings.bitbucket_api_url;
var sourceRepoUrlPrefix = settings.source_repo_url_prefix;
var bitbucketRepoUrlPrefix = settings.bitbucket_repo_url_prefix;

var workingFolder = "./tmp";
execSetupTempFolder = () => {
    fs.removeSync(workingFolder);
    fs.mkdirSync(workingFolder);
};

execClone = (repoName) => {
    console.log('cloning repo ' + repoName);
    let cloneUrl = sourceRepoUrlPrefix + repoName + ".git"; //TODO: create template
    execSync("git clone --mirror " + cloneUrl, {cwd: workingFolder, stdio: [0, 1, 2]});
};

execCreateBitbucketRepo = (repoName, callback) => {
    console.log('creating repo ' + repoName + ' in Bitbucket');
    // curl -k -X POST --user username:password "https://api.bitbucket.org/2.0/accountName/repositories/repo_name"
    request
        .post({
            url: bitbucketApiUrl + '/repositories/' + settings.bitbucket_account + '/' + repoName,
            form: {"scm": "git", "is_private": "true", "fork_policy": "no_public_forks"}
        }, callback)
        .auth(settings.bitbucket_username, settings.bitbucket_password, true);
};

execPushToBitbucket = (repoName) => {
    console.log('pushing ' + repoName + ' to Bitbucket');

    // git remote set-url --push origin git@bitbucket.org:username/repo
    // git push --mirror

    execSync("git remote set-url --push origin  " + bitbucketRepoUrlPrefix + repoName + ".git", { //TODO: create template
        stdio: [0, 1, 2],
        cwd: workingFolder + '/' + repoName + ".git" //TODO: create template
    });

    // execSync("git fetch -p origin", {
    //     stdio: [0, 1, 2],
    //     cwd: workingFolder + '/' + repoName + ".git" //TODO: create template
    // });

    execSync("git push --mirror", {
        stdio: [0, 1, 2],
        cwd: workingFolder + '/' + repoName + ".git" //TODO: create template
    });
};

execSetupTempFolder();

lineReader.on('line', function (line) {

    let repoName = line;

    execCreateBitbucketRepo(repoName, function (error, response, body) {
        console.log('Created repo:', repoName);
        if (error) {
            console.error('error:', error);
            if (settings.stop_on_error) throw "cannot create repo in bitbucket";
        }

        //TODO: check status code
        console.log('statusCode:', response && response.statusCode);
        if (body) console.log('body:', body);

        execClone(repoName);

        try {
            execPushToBitbucket(repoName);
        } catch (err) {
            console.error(err);
            if (settings.stop_on_error) throw "error when pushing to bitbucket";
        }
        console.log('Finished processing ', line);
    });

});





