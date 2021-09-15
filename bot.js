require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const api = require('covid19-api');

const COUNTRIES_LIST = require('./constants.js')

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`
Hi ${ctx.message.from.first_name}
Find out statistics on Covid19
Enter the country name in English and get the data.
You may chech the whole list of countries using /help command
`, Markup.keyboard([
    ['US', 'Russia'],
    ['Ukraine', 'Kazakhstan'],
])
    .resize()
));

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};
    
    try {
    data = await api.getReportsByCountries(ctx.message.text);
    
    const formatData = `
    Country: ${data[0][0].country}
    Cases: ${data[0][0].cases}
    Deaths: ${data[0][0].deaths}
    Recovered: ${data[0][0].recovered}
    `;
    ctx.reply(formatData);
    } catch {
        console.log('Mistake');
        ctx.reply('Mistake, such country does not exist');
    }
});

bot.launch()

console.log('Bot launched')

