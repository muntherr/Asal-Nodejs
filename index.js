const fs = require('fs'); // Return obejct and store it in fs: file system
const http = require('http');
const url = require('url');
const replaceTemplate = require('./final/modules/replaceTemplate');
const slugify = require('slugify'); // used to create slug: it is last part of url contains unique string
//////////////////////////////////////////////////////////////////////////
// Files
// Read data from files using Sync
// Blocking, synchronous
// const textIn = fs.readFileSync('./txt/input.txt','utf-8'); // Sync: Synchronous
// //console.log(textIn);

// const textOut = `This is what we know about avo : ${textIn}.\nCreated on ${Date.now()}` //'This is: ' + textIn
// fs.writeFileSync(`${__dirname}/txt/output.txt`, textOut);

//console.log('File Written');
// Synchronous called blocking
// Asynchronous non blocking run the code in the background
// Js is one single thread when i run the code it will run the code and the second one will waiting the first one to finished

// To handle CallbackHell we should using promies or async/await or ec6

// Read data from file using Async , non Blocking

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if(err) return console.log('Error');
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err, data2) => {
//         console.log(data2);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('Your file has been written');

//             })
//         });
//     });
// });
//     console.log('Will read file!');

////////////////////////////////////////////////////////////

//Server
// 1. Create the server
// The first methods need to read the file always when the user request a url, this method not efficient
// the second one read the file once and send the data when the user request any thing

const tempOverView = fs.readFileSync(
  `${__dirname}/final/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/final/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/final/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, 'utf-8');

const dataObject = JSON.parse(data);

// I can use this func. by create a new module to use the function in another  file  using module.exports
// const replaceTemplate = (temp, product) => {
//     console.log(`-------->>>>>> ${product.id}`);
//     let output = product.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.from);
//     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);
//     if (!product.organic) output  = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }

// Using Slugify to change the url last string
console.log(slugify('Freash Avocado', { lower: true }));
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // request , response

  const { query, pathname } = url.parse(req.url, true); //  To get the id for  each card
  console.log(query);
  //const path = req.url;
  //Overview pages
  if (pathname == '/overview' || pathname == '/') {
    res.writeHead(200, { 'Content-type': 'text/html' }); //This is the second
    const cardsHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    // console.log(cardsHtml);
    const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    //Routing
    res.writeHead(200, { 'Content-type': 'text/html' }); //This is the second

    const product = dataObject[query.id];
    console.log(product);

    const output = replaceTemplate(tempProduct, product);
    console.log(query);
    res.end(output);
  }
  // API
  else if (pathname == '/API') {
    res.writeHead(200, { 'Content-type': 'application/json' }); //This is the second
    res.end(data);

    // this is the first method
    // fs.readFile(`${__dirname}/final/dev-data/data.json`, 'utf-8', (err, data) => {

    //     const productd = JSON.parse(data);
    //     res.writeHead(200, { 'Content-type': 'application/json' });
    //     console.log(productd);
    //     res.end(data);

    // });
  }
  // Not Found
  else {
    res.writeHead('404', {
      'Content-type': 'text/html',
      'my-own-header': 'hello world',
    });
    res.end('<h1>Not found</h1>');
  }
  // res.end('Hello From the server'); // Return string response.
});
//2. Listen to the request

server.listen(8000, '127.0.0.1', () => {
  console.log('Lestining to request on port 8000');
}); // Port --> sub address from the local host

///
