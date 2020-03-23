// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const { crypto } = require('crypto');
const { http } = require('http');
const { https } = require('https');
const { querystring } = require('querystring');

class EchoBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            //await context.sendActivity(`You said '${ queryVendorInfo(context) }'`);
            console.log('enter onMessage');
            await this.queryVendorInfo(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
                if (membersAdded[cnt].id !== context.activity.recipient.id) {
                    await context.sendActivity('Hello and welcome and Try Vendor V0!');
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
    
    async queryVendorInfo(context) {
        console.log('enter queryVendorInfo');
        let vend_name_pp = context.activity.text;
        console.log('enter vend_name_pp');        
        
        let path = encodeURI('/gateway/p1-service?app_code=vendor-service&invoke_method=/api/vendor/vendorNamePattern/{patternName}/headers&paths={\"patternName\":\"'+ 'abc' + '\"}\"');
        
        return requestRemoteByGetUser(path, user).then(function(result){
            let items=JSON.parse(result);
                    
            if(!items.hasOwnProperty('message')){
                return 'I am sorry, I cannot find any related information. ';
            }
            if(!items.message.hasOwnProperty('data')){
                return 'I am sorry, I cannot find any related information. ';
            }
            if(!items.message.data.hasOwnProperty('content')){
                return 'I am sorry, I cannot find any related information. ';
            }

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
            return resultvendor;
        }).catch(function(error){
            return 'I am sorry, I cannot find any related information. ';
        });	
    }
}
  
function requestRemoteByGetUser(url, user) {
    return new Promise((resolve, reject) => {    
      const options = {
        hostname: snxHost,
        port: 443,
        path: url,
        method: 'GET',
        headers: {
          'user': crypto.createHash('sha1').update(user).digest('base64')
        }
      };
      const request = https.get(options, res => {      
        res.setEncoding('utf8');
        let body = '';
        res.on('data', data => {
          body += data;
        });
        res.on('end', () => {
          resolve(body);    
        });
      });
      
      request.on('error', (err) => reject(err));    
    });
  }

module.exports.EchoBot = EchoBot;
