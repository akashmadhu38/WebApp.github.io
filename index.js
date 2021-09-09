const http = require("http");
const fs = require("fs");
var requests = require("requests");

const homeFile = fs.readFileSync("home.html","utf-8");
const replaceVal = (tempVal,orgVal) =>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}
const server = http.createServer((req,res) =>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kochi&appid=2111d66f7052d55e52966ed48f8eac5d')
.on("data", (chunk) => {
    const objdata = JSON.parse(chunk);
    const arrData = [objdata];
  const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
  res.write(realTimeData);

})
.on('end', (err) => {
  if (err) return console.log('connection closed due to errors', err);
  res.end();

});
    }
});

server.listen(3000,"127.0.0.1");