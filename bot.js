// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');

const https = require('https');

const snxHost = 'https://ec.synnex.com';

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            //await context.sendActivity(`You said '${ context.activity.text }'`);
            await this.queryVendorInfo(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome and!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    async queryVendorInfo(context) {
        let vend_name = context.activity.text;
        console.log('--------------search vend_name:' + vend_name);

        let url = encodeURI('/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"' + 'abc' + '\"}\"');
        console.log('--------------search Path:' + url);
        await context.sendActivity(`You said '${url}'`);

        let finalresult = '';
        await context.sendActivity(`Result '${finalresult}'`);

        finalresult = await requestRemoteByGetUser(url, 'ethanh');
        
        await context.sendActivity(`Result '${finalresult}'`);
    }
}

function requestRemoteByGetUser(url, user) {
    console.log('enter Remote Call By GET');
    return new Promise((resolve, reject) => {    
      const options = {
        hostname: snxHost,
        port: 443,
        path: url,
        method: 'GET'
      };
      const request = https.get(options, res => {      
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          console.log("Pure Result is : "+body); 
          resolve(body);   
        });
      });
      
      request.on('error', (err) => reject(err));    
    });
}

module.exports.EchoBot = EchoBot;
