var osu = require('node-os-utils')
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs')
const app = express();
const port = 5000;
const path = require('path');
const { response } = require('express');
const { os } = require('node-os-utils');
var oscheck = require('os');
const nodeDiskInfo = require('node-disk-info');
const systemDisk = require('system-disk');
let books = [];

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/cpu', (req, res) => {           //cpu API
  var cpu = osu.cpu

  var count = cpu.count() 
  var response={
    model:cpu.model(),core:count,usage: 0
  }
  cpu.usage()
  .then(info => {
    response.usage=info
  })

    res.send(response);
});
app.get('/ram', (req, res) => {
  var mem = osu.mem
  mem.info()
  .then(info => {
    res.send(info);
  })
    
});
app.get('/net', (req, res) => {
  var netstat = osu.netstat
  
  netstat.stats()
  .then(info => {
    res.send(info);
  })
    
});
app.get('/ip', (req, res) => {
res.send(oscheck.networkInterfaces())
});
app.get('/misc', (req, res) => {
  var osCmd = osu.osCmd
  var response={}
  osCmd.whoami()
    .then(userName => {
      res.send({user:userName, uptime:os.uptime(), arch:os.arch(), os:response.oss, ip:os.ip()})
    })
  
});
app.get('/drive', (req, res) => {

  // sync way
try {
  const disks = nodeDiskInfo.getDiskInfoSync();
  printResults('SYNC WAY', disks);
} catch (e) {
  console.error(e);
}

function printResults(title, disks) {

  res.send(disks)

}
});

app.get('/', (req, res) => {
  
fs.readFile('index.html', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  
  res.send(data)
})

});
app.get('/network', (req, res) => {
  
  fs.readFile('network/net.html', 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    
    res.send(data)
  })
  
  });
  app.get('/disk', (req, res) => {
  
    fs.readFile('drive/drive.html', 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      
      res.send(data)
    })
    
    });
app.use(express.static('js'));
app.use(express.static('network'));
app.use(express.static('css'));
app.use(express.static('drive'));
app.listen(port, () => console.log(`Server controller on port ${port}!`));


