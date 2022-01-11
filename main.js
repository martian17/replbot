const Discord = require("discord.js");
let got = import("got");


let getClient = function(Discord){
    let flags = Discord.Intents.FLAGS;
    const client = new Discord.Client({
        intents: [
            flags.GUILDS, flags.GUILD_MESSAGES
        ] /*["GUILDS", "GUILD_MESSAGES"]*/
    });
    
    /*
    let wrapper = Object.create(client);
    
    let evts = {};
    let targets = "ready,message".split(",");
    targets.map(t=>{
        evts[t] = [];
        client.on(t,function(a,b,c,d,e,f){
            evts[t].map(cb=>{
                console.log("cb called");
                cb(a,b,c,d,e,f)
            });
        });
    });
    client.on = function(evt,cb){
        evts[evt].push(cb)
    };*/
    return client;
};


const client = getClient(Discord);
require('dotenv').config();
client.login(process.env.TOKEN);


let Bot = require("./bot.js");

let main = async function(){
    let bot = (new Bot(client,"."));
    
    
    let initmsgs = [];
    bot.onReady(()=>{
        console.log(`Logged in as ${client.user.tag}!`);
        /*const guilds = bot.client.guilds.cache;
        initmsgs.push("guilds: "+JSON.stringify(guilds.map(g=>g.name)));
        //sending it to every channels
        guilds.map(guild=>{
            //GUILD_CATEGORY
            //GUILD_CATEGORY
            //GUILD_TEXT
            //GUILD_VOICE
            guild.channels.cache.filter(channel=>{
                channel.type === "GUILD_TEXT";
            }).map(channel=>{
                console.log(channel.type);
                channel.send(initmsgs.join("\n"));
            });
        });*/
    });
    got = (await got).got;
    
    bot.sub("run").addFunc(async (msg,substr)=>{
        let code = substr.trim();
        let lang = "js"
        if(code.slice(0,3) === "```" && code.slice(-3) === "```"){
            code = code.slice(3,-3);
            let lines = code.split("\n");
            if(lines.length > 1){
                if(lines[0].length !== 0)lang = lines[0].trim();
                lines = lines.slice(1);
            }
            code = lines.join("\n");
        }else if(code.slice(0,1) === "`" && code.slice(-1) === "`"){
            code = code.slice(1,-1);
        }
        //msg.reply("running the code\n"+`\`\`\`${lang}\n${code}\`\`\``);
        console.log("got the code");
        console.log(code);
        let result;
        try{
            result = await got.post("https://emkc.org/api/v1/piston/execute",{
                json: {
                    language:lang,
                    source:code
                }
            }).json();
        }catch(err){
            msg.reply("Error connecting to the server");
            console.log(err);
            return;
        }
        msg.reply("```\n"+result.output+"\n```");
        /*if(result.ran){
            msg.reply("Execution Success\n```\n"+result.output+"\n```");
        }else{
            //msg.reply("Your code did not run\n"+JSON.stringify(result,null,4));
            msg.reply("Your code did not run\n```\n"+result.output+"\n```");
        }*/
        console.log(result);
    });
};

main();