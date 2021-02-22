
const fs = require("fs")
const path = require("path")
/* const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); */
var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI('rising-star-ipfs.eastus.azurecontainer.io', '5001', {protocol: 'http'})
//const ipfsClient = require('ipfs-http-client')

function getAllFiles(dirPath, originalPath, arrayOfFiles) {
  files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []
  originalPath = originalPath || path.resolve(dirPath, "..")

  folder = path.relative(originalPath, path.join(dirPath, "/"))

  arrayOfFiles.push({
      path: folder.replace(/\\/g, "/"),
      mtime: fs.statSync(folder).mtime
  })

  files.forEach(function (file) {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
          arrayOfFiles = getAllFiles(dirPath + "/" + file, originalPath, arrayOfFiles)
      } else {
          file = path.join(dirPath, "/", file)

          arrayOfFiles.push({
              path: path.relative(originalPath, file).replace(/\\/g, "/"),
              content: fs.readFileSync(file),
              mtime: fs.statSync(file).mtime
          })
      }
  })

  return arrayOfFiles
}

function getBufferFromFile(filePath){
  return new Promise((resolve, reject) => {
    var data = new Buffer(fs.readFileSync(filePath));
    resolve(data);
  });
}

async function run() {
  try{
    const buf = await getBufferFromFile(process.argv[2]);
    ipfs.add(buf, function (err,file){
      if(err){
          console.log(err);
      }
      console.log("HASH for this file:")
      console.log(file[0].hash)
      let url = `https://ipfs.io/ipfs/${file[0].hash}`
      console.log(`Url --> ${url}`)
    })

  } catch(error){
    console.log(error)
  }
}

run()