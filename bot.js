// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { http } = require('http');
const { https } = require('https');
const { querystring } = require('querystring');
const { host } = 'image.synnex-china.com';
const { snxHost } = 'https://ec.synnex.com';
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
        
        let path = encodeURI('https://ec.synnex.com/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"'+ 'abc' + '\"}\"');
        console.log('--------------search Path:' + path);
        await context.sendActivity(`You said '${ path }'`);
        let msg = await requestRemoteByGetUser(path , 'ethanh');
    }
    
    async requestRemoteByGetUser(url, user) {
        let result = '';
        $.ajax({
            type: 'GET',
            url: url,
            data: '',
            success: function (data) {
               if(data.state==200){
                   result = data.msg;
               }else{
                   result = 'Not Found';
               }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
                result = 'Not Found';
            },
            complete: function(XMLHttpRequest, textStatus) {
            }
         });
        
        return result;
    }
}

module.exports.EchoBot = EchoBot;
