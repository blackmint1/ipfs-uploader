
const fs = require("fs")
const path = require("path")
const IPFS = require('ipfs-mini');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

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
    var fs = require('fs');
    const buf = fs.readFile(process.argv[2], function (err, data) {
      if (err) throw err;
      resolve(data);
    });
  });
}

async function run() {
  try{
    const buf = await getBufferFromFile(process.argv[2]);
    const hash = await ipfs.add(buf)
    console.log("HASH for this file:")
    console.log(hash)
    let url = `https://ipfs.io/ipfs/${hash}`
    console.log(`Url --> ${url}`)
  } catch(error){
    console.log(error)
  }
}

run()