// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { http } = require('http');
const { https } = require('https');
const { querystring } = require('querystring');
const { host } = 'image.synnex-china.com';
const { snxHost } = 'ec.synnex.com';
const { snxDomain } = 'mycis.synnex.org';

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
        
        let path = encodeURI('/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"'+ vend_name + '\"}\"');
        console.log('--------------search Path:' + path);
        await context.sendActivity(`You said '${ path }'`);
        let msg = requestRemoteByGetUser(path, 'ethanh');
    }
}

function requestRemoteByGetUser(url, user) {
    const options = {
      hostname: snxHost,
      port: 443,
      path: url,
      method: 'GET',
      headers: {
        'user': crypto.createHash('sha1').update(user).digest('base64')
      }
    };
    let result = '';
    
    return result;
}

module.exports.EchoBot = EchoBot;
