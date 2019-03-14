# move-to-bitbucket
Move git repos to bitbucket

#### 1- Update input.txt
List your git repository names

#### 2 - Update settings.json
| Config Name | Description | Sample value |
| ------------- |-------------| -----|
| source_repo_url_prefix ||git@github.com:mehradoo/ |
| bitbucket_account || mehradoo |
| bitbucket_username |||
| bitbucket_password |||
| bitbucket_api_url || https://api.bitbucket.org/2.0 |
| bitbucket_repo_url_prefix || git@bitbucket.org:mehradoo/ |
| stop_on_error || false |

#### 3 - Install dependencies
Run `npm install`

#### 4 - Usage
Run `npm run copy` to copy your repositories to Bitbucket

Run `npm run delete` to delete repositories from Bitbucket
