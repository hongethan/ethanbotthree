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

        return requestRemoteByGetUser(path, 'ethanh').then(function(result){
            let items=JSON.parse(result);
            console.log('--------------Result :' + items.toString());
            console.log('--------------Result is items PART :' + (items instanceof Array));		
                    
            if(!items.hasOwnProperty('message')){
                finalresult = 'I am sorry, I cannot find any related information. ';
            }else if(!items.message.hasOwnProperty('data')){
                finalresult = 'I am sorry, I cannot find any related information. ';
            }else if(!items.message.data.hasOwnProperty('content')){
                finalresult = 'I am sorry, I cannot find any related information. ';
            }else{
    
                var array = [];
                if(!(items.message.data.content instanceof Array)){
                    array.push(items.message.data.content);
                }else{
                    array = items.message.data.content;
                }
                
                var resultvendor = 'Vendor Information: ' + '  \n\t\r';
                for(var pos=0; pos < array.length; pos++){
                    resultvendor = resultvendor + array[pos].vendNo + '---' + array[pos].vendName + '  \n\t\r';
                }
                
                if(array.length < 1){
                    resultvendor = resultvendor + 'Not Found';
                }
                finalresult = resultvendor;
            }
        }).catch(function(error){
            console.log(error);
            finalresult = 'I am sorry, I cannot find any related information. ';
        });	
        await context.sendActivity(`Result '${finalresult}'`);
    }
}

function requestRemoteByGetUser(url, user) {
    console.log('enter Remote Call By GET');
    return new Promise((resolve, reject) => {     
    });
  }

module.exports.EchoBot = EchoBot;
