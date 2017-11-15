// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('message', message => {
  if (message.content === '!help') {
    message.channel.send('In lucru');
  }
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(``);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
   
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Se incarca...");
    m.edit(`Ping-ul tau este ${Math.round(client.ping)}ms`);
  }
   
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Pentru a executa aceasta comanda, trebuie sa ai gradul de Administrator sau Moderator!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Va rugam sa mentionati un membru din acest grup!");
    if(!member.kickable) 
      return message.reply("Nu il poti da afara pe acest membru!");
    
    // slice(1) removes the first part, which here should be the user mention!
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Va rugam sa scrieti un motiv!");
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${message.author.tag} l-a dat afara pe ${member.user.tag} cu motivul ${reason}`);
 
  }
  
module.exports.run = async (bot, message, args) => {
        let info = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if(!info) return message.channel.sendMessage("You did not specify a user Mention");
      let member = message.mentions.members.first();
      let mention = message.mentions.users.first();
      let embed = new Discord.RichEmbed()
        .setDescription(`This is the info about **@${mention.username}#${mention.discriminator}**`)
        .setColor('RANDOM')
        .setThumbnail(`${member.user.avatarURL}`)
        .addField("**Username : **", `${mention.username}`, true)
        .addField("**User Discriminator :**", `#${mention.discriminator}`, true)
        .addField("**User ID :**", `${member.id}`, true)
        .addField("**Playing :**", `${member.user.presence.game === null ? "No Game" : member.user.presence.game.name}`, true) 
        .addField("**NickName :**", `${member.nickname}`, true)
        .addField("**Roles :**", `${member.roles.map(r => r.name).join(" -> ")}`)
        .addField("**Joined Guild :**", `${message.guild.joinedAt}`)
        .addField("**Joined Discord :**", `${member.user.createdAt}`)
        .setFooter(`User that triggered command -> ${message.author.username}#${mention.discriminator}`)
      message.channel.send({ embed: embed});
        console.log(`${message.author.username} has used the UserInfo command`)
      return;
      
}

module.exports.config = {
  command: "!userinfo"
}
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["Administrator" , "Moderator"].includes(r.name)) )
      return message.reply("Ai nevoie de gradul Administrator/Owner pentru a executa aceasta comanda!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Va rugam mentionati un membru din grup!");
    if(!member.bannable) 
      return message.reply("Nu il poti bana pe acest membru!");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Va rugam scrieti un motiv!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} a primit ban de la ${message.author.tag} pentru ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100000000000)
      return message.reply("Va rugam mentionati un numar de mesaje!");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Aceasta comanda este in lucru!`));
  }
	  
});

client.login(config.token);
           
