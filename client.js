// Reading the file using default fs npm package
const { getJsonFromCsv } = require("convert-csv-to-json/src/csvToJson");
const fs = require("fs");
csv = fs.readFileSync("./data.csv")

// Convert the data to String and split it in an array
const array = csv.toString().split('\n');


// All the rows of the CSV will be converted to JSON objects which will be added to result in an array
let result = [];
let headers = ['service', 'location', 'failure_ratio', 'avg_latency', 'tail_latency', 'usage', 'lat' , 'long'];

// Since headers are separated, we need to traverse remaining n-1 rows.
for (let i = 1; i < array.length; i++) {
	let obj = {}

	// Create an empty object to later add values of the current row to it Declare string str as current array
	// value to change the delimiter and store the generated string in a new string s
	let str = array[i]
	let s = ''

	// By Default, we get the comma separated values of a cell in quotes " " so we use flag to keep track of quotes and
	// split the string accordingly If we encounter opening quote (") then we keep commas as it is otherwise
	// we replace them with pipe | We keep adding the characters we traverse to a String s
	let flag = 0
	for (let ch of str) {
		if (ch === '"' && flag === 0) {
			flag = 1
		}
		else if (ch === '"' && flag == 1) flag = 0
		if (ch === ',' && flag === 0) ch = '|'
        if (ch === '\r') ch = ''
		if (ch !== '"') s += ch
	}

	// Split the string using pipe delimiter | and store the values in a properties array
	let properties = s.split("|")

	// For each header, if the value contains multiple comma separated data, then we
	// store it in the form of array otherwise directly the value is stored
	for (let j in headers) {
		if (properties[j].includes(",")) {
			obj[headers[j]] = properties[j]
				.split(",").map(item => item.trim())
		}
		else obj[headers[j]] = properties[j]
	}

	// Add the generated object to our result array
	result.push(obj)
}

// Convert the resultant array to json and
// generate the JSON output file.
for(var i = 0; i < result.length; i++){
    var obj = result[i];
    for(var prop in obj){
        if(obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];   
        }
    }
}
let json = JSON.stringify(result);
 // console.log(json);
 // fs.writeFileSync('output.json', json);


const UDP = require('dgram')

const client = UDP.createSocket('udp4')

const port = 2222

const hostname = 'localhost'

client.on('message', (message, info) => {
  // get the information about server address, port, and size of packet received.

  console.log('Address: ', info.address, 'Port: ', info.port, 'Size: ', info.size)

  //read message from server

  console.log('Message from server', message.toString())
})

// Send data
 const packet = Buffer.from('This is a message from client')
 //const packet = json

client.send(json, port, hostname, (err) => {
  if (err) {
    console.error('Failed to send packet !!')
  } else {
    console.log('Packet send !!')
  }
})