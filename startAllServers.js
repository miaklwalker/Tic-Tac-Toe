const child_process = require("child_process");
let interfaces = require('os').networkInterfaces();

let address = interfaces["Wi-Fi"].filter(inter=>{
    let family = inter.family
    if(family === "IPv4"){
        return inter
    }else{
        console.log(inter)
    }
})
let serverAddress = address[0].address
const commands = [
    {
        name:"Server",
        command:`(cd server && start nodemon index.js)`
    },
    {
        name:"Client",
        command:`(cd src && start live-server )`
    },
]

function runCommand (command, name, callback) {
    child_process.exec(command,(error,stdout,stderr)=>{
        if(stderr){
            callback(stderr)
        }else{
            callback(null,`Sucessfully executed ${name}`);
        }
    })
}

function main () {
    commands.forEach(element=>{
        runCommand(element.command,element.name,(err,res)=>{
            if(err){
                console.error(err);
            }else{
                console.log(res);
            }
        })
    })
}
main();