const fs  =  require("fs");
fs.readdir("./test" ,(err , files)=>{
    let allText  =  "";
    files.forEach( file =>{
        allText += fs.readFile("./test/file1.txt")
    })
})