#!/bin/env node

var irc = require('irc');
var botName = 'dopefish';
var master = 'joo';

var bot = new irc.Client('irc.synyx.de', botName, {
    channels: ['#dopefish', '#fumarer'],
    port: 6668,
    userName: 'dopefish',
    realName: 'dope as fish dude!'
});

bot.addListener('error', function (message) {
    console.log('error: ', message);
});

bot.addListener('invite', function (channel, nick, message) {

    console.log('received invite from ' + nick + ' into ' + channel);

    if (nick === master) {
        bot.join(channel, function () {
            console.log('joined ' + channel);
            bot.say(channel, "servus!");
        });
    } else {
        bot.say(nick, 'nein, nein, nein');
        bot.say(nick, 'im channel ' + channel + ' sind nur langweiler!');
    }
});

bot.addListener('join', function (channel, nick, message) {

    console.log(nick + ' joined ' + channel);

    if (nick !== botName) {
        var greeting;
        if (nick === 'leo' || nick === 'NULLinger' || nick === 'Fabian') {
            greeting = 'dieser ' + nick + ' schon wieder ... O_o';
        } else if (nick.endsWith('1')) {
            greeting = 'hallo ' + nick + '111einself!!!1111';
        } else if (nick.endsWith('_')) {
            greeting = 'hallo __' + nick + '___';
        } else {
            greeting = 'hallo ' + nick;
        }
        bot.say(channel, greeting);
    }
});

bot.addListener('message#', function (nick, channel, text) {

    console.log(channel + '<' + nick + '>' + text);
    var payload = {bot: bot, nick: nick, channel: channel, master: master};

    if (text.startsWith('!rauchen')) {
        smokoWarning(payload);

    } else if (text.startsWith('!bier')) {
        beerTimeChecker(payload);

    } else if (text.toLowerCase().contains('bier') ||
        text.toLowerCase().contains('durst') ||
        text.toLowerCase().contains('trink')) {

        serveDrink(payload);

    } else if (text.startsWith('[ANN]')) {
        noiseDetector(payload);

    } else if (text.toLowerCase().contains('wasser')) {
        waterDetector(payload);
    } else if (text.startsWith('!help')) {
        pleaseHelp(payload);
    } else if (text.startsWith('!leave')) {
        leaveChannel(payload);
    }
});

/**
 * @param {Object} params.bot
 * @param {String} params.nick
 * @param {String} params.channel
 * @param {String} params.master
 */
var leaveChannel = function (params) {

    var bot = params.bot;
    var nick = params.nick;
    var channel = params.channel;
    var master = params.master;

    var lala = [
        'so ... ich packs dann mal',
        'pfüati gott',
        'cya',
        'pfüati',
        'tschau',
        'ich gehe nun zur spassseite -.-'
    ];

    if (nick === master) {
        var index = getRandomInt(0, lala.length - 1);
        bot.part(channel, lala[index], function () {
            console.log('left channel ' + channel);
        });
    } else {
        bot.say(nick, 'du hättest wohl gern, dass ich aus ' + channel + ' verschwinde!?');
    }
};

/**
 * @param {Object} params.bot
 * @param {String} params.nick
 */
var pleaseHelp  = function (params) {

    var bot = params.bot;
    var nick = params.nick;

    bot.say(nick, 'du brauchst also hilfe?');
    bot.say(nick, 'hm ...');
    bot.say(nick, 'vielleicht hilft dir ja mein source code weiter ...');
    bot.say(nick, 'git clone https://github.com/grafjo/dopefish.git');
};

/**
 * @param {Object} params.bot
 * @param {String} params.nick
 * @param {String} params.channel
 */
var waterDetector  = function (params) {

    var bot = params.bot;
    var nick = params.nick;
    var channel = params.channel;

    bot.say(channel, nick + ': h2o - nur im klo!');
    serveDrink(params);
};

/**
 * @param {Object} params.bot
 * @param {String} params.channel
 */
var noiseDetector = function (params) {

    var bot = params.bot;
    var channel = params.channel;

    bot.say(channel, 'wer will mich hier aufwecken? ich schlafe tief und fest!');
    bot.action(channel, 'tzz tzzzzz tzzzzzzz tzzz tzzz tzzzzz ...');
};

/**
 * @param {Object} params.bot
 * @param {String} params.channel
 */
var beerTimeChecker = function (params) {

    var bot = params.bot;
    var channel = params.channel;

    var currentHour = new Date().getUTCHours() + 2;
    if (currentHour > 8 && currentHour < 16) {
        bot.say(channel, 'kein bier vor vier');
    } else {
        bot.say(channel, 'bier in massen genießen - alles andere ist verantwortungslos!');
    }
};

/**
 * @param {Object} params.bot
 * @param {String} params.channel
 */
var smokoWarning = function (params) {

    var bot = params.bot;
    var channel = params.channel;

    var warnings = [
        'Rauchen fügt Ihnen und den Menschen in Ihrer Umgebung erheblichen Schaden zu.',
        'Rauchen kann tödlich sein.',
        'Rauchen ist tödlich.',
        'Raucher sterben früher',
        'Rauchen lässt Ihre Haut altern.',
        'Rauchen verursacht tödlichen Lungenkrebs.',
        'Rauchen in der Schwangerschaft schadet Ihrem Kind.',
        'Schützen Sie Kinder - lassen Sie sie nicht Ihren Tabakrauch einatmen!',
        'Ihr Arzt oder Apotheker kann Ihnen dabei helfen, das Rauchen aufzugeben',
        'Rauchen macht sehr schnell abhängig: Fangen Sie gar nicht erst an!',
        'Wer das Rauchen aufgibt, verringert das Risiko tödlicher Herz- und Lungenerkrankungen',
        'Rauchen kann zu einem langsamen und schmerzhaften Tod führen',
        'Hier finden Sie Hilfe, wenn Sie das Rauchen aufgeben möchten: Tel. 06221-424200 Befragen Sie Ihren Arzt oder Apotheker',
        'Rauchen kann zu Durchblutungsstörungen führen und verursacht Impotenz',
        'Rauchen führt zur Verstopfung der Arterien und verursacht Herzinfarkte und Schlaganfälle.',
        'Rauchen kann die Spermatozoen schädigen und schränkt die Fruchtbarkeit ein.',
        'Rauchen enthält Benzol, Nitrosamine, Formaldehyd und Blausäure.'
    ];

    var index = getRandomInt(0, warnings.length - 1);
    bot.action(channel, warnings[index]);
};


/**
 * @param {Object} params.bot
 * @param {String} params.nick
 * @param {String} params.channel
 */
var serveDrink = function (params) {

    var bot = params.bot;
    var nick = params.nick;
    var channel = params.channel;

    var fridge = [
        'einen heißen jasmine tee',
        'einen heißen kaba',
        'ein glas v.o.d.k.a',
        'ein kaltes bier',
        'ein kaltes pils',
        'eine tasse kaffee',
        'ein kühles blondes',
        'ein veganes apfelsaft-schorle',
        'einen frisch gemixten mojito',
        'einen mojito mit extra viel minze'
    ];

    // Fabian trinkt gerne jasmine tee
    var drink = (nick === 'Fabian') ? 0 : getRandomInt(0, fridge.length - 1);
    bot.action(channel, 'reicht ' + nick + ' ' + fridge[drink]);
};


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        }
    });
}

if (!String.prototype.endsWith) {
    Object.defineProperty(String.prototype, 'endsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || this.length;
            position = position - searchString.length;
            var lastIndex = this.lastIndexOf(searchString);
            return lastIndex !== -1 && lastIndex === position;
        }
    });
}

if (!('contains' in String.prototype)) {
    String.prototype.contains = function (str, startIndex) {
        return -1 !== String.prototype.indexOf.call(this, str, startIndex);
    };
}