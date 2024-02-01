const fs = require("fs")
const ascii = require("ascii-table")

module.exports = async (client) => {
    const table = new ascii().setHeading("Commands", "Status");
  
    let commandsArray = [];
  
    const commandsFolder = fs.readdirSync("./src/Commands");
    for (const folder of commandsFolder) {
      const commandFiles = fs
        .readdirSync(`./src/Commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
  
      for (const file of commandFiles) {
        const commandFile = require(`../Commands/${folder}/${file}`);
  
        const properties = { folder, ...commandFile };
        client.commands.set(commandFile.data.name, properties);
  
        commandsArray.push(commandFile.data.toJSON());
  
        table.addRow(commandFile.data.name, "loaded");
        continue;
      }
    }
  
    client.application.commands.set(commandsArray);
  
    return console.log(table.toString());
}