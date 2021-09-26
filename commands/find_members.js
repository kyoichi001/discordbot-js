

/**
 * 
 * @param {Array<Discord.Role>} roles
 * @param {Array<Discord.GuildMember>} members
 */
function buildEmbeds(roles, members) {
  return [
    new Discord.MessageEmbed().setTitle("検索対象のロール").setDescription(roles.map(e => `${e}`).join("\n")),
    new Discord.MessageEmbed().setTitle("検索結果").setDescription(members.map(e => `${e}`).join("\n")),
  ];
}
/**
 * 
 * @param {Array<[Discord.Role,boolean]>} roles
 * @param {Array<Discord.Member>} members
 */
function buildComponents(roles, customId) {
  return [
    new Discord.MessageActionRow().addComponents(
      new Discord.MessageSelectMenu()
      	.setCustomId(customId)
      	.setMinValues(0)
      	.setMaxValues(roles.length)
      	.addOptions(
          roles.map(([role, selected]) => ({
            label: role.name,
            value: role.id,
            default: selected,
          })
        )
      )
    )
  ]
}
/**
 * 
 * @param {Discord.Interaction} interaction 
 */
async function onInteraction(interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  if (!interaction.guildId) {
    await interaction.reply({
      content: "サーバーで実行する必要があります。"
    });
    return;
  }
  await interaction.reply({
    embeds: [ new Discord.MessageEmbed().setTitle("全メンバーを取得中") ],
    ephemeral: true,
  });
  const guild = interaction.guild;
  const allMembers = await guild.members.fetch();
  const customId = Math.random().toString(36).substring(7);
  /** @type {Array<Discord.GuildMember>} */
  let roles = [];
  await interaction.editReply({
    embeds: buildEmbeds([], []),
    components: buildComponents([...guild.roles.cache.values()].slice(0, 25).map(e => [e, false]), customId),
  });
  const collector = new Discord.InteractionCollector(client, {
    filter: (interaction) => interaction.isSelectMenu() && interaction.customId === customId,
    time: 15 * 60 * 1000,
  });
  /**
   * 
   * @param {Discord.SelectMenuInteraction} interaction 
   */
  async function onInteraction(interaction) {
    roles = (interaction.values ?? []).map(id => guild.roles.resolve(id));
    await interaction.update({
      embeds: buildEmbeds(roles, allMembers.filter(member => roles.every(e => member.roles.cache.has(e.id)))),
      components: buildComponents([...guild.roles.cache.values()].slice(0, 25).map(e => [e, roles.includes(e)]), customId)
    })
  }
  collector.on("collect", (interaction) => onInteraction(interaction).catch(console.error));
}
client.on("interactionCreate", (interaction) => onInteraction(interaction).catch(console.error));
client.login(process.env.DISCORD_TOKEN).catch(console.error);