var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb://root:root@ds163705.mlab.com:63705/learning-node'

var Message = mongoose.model('Message', {
	name: String,
	message: String
})

app.get('/messages', (req, res) =>{
	Message.find({}, (err, messages) => {
		res.send(messages)
	})
})

app.post('/messages', async (req, res) =>{
	//var message = new Message(req.body)
	/*message.save((err) => {
		if(err)
			sendStatus(500)
		
		Message.findOne({message: 'badword'}, (err, censored) => {
			if(censored){
				console.log('censored words found', censored)
				Message.remove({_id: censored.id}, (err) =>{
					console.log('Removed censored message')
				})
			}
		})
		io.emit('message', req.body)
		res.sendStatus(200)
	})*/
	
	/*message.save()
	.then(() => {
		console.log('Saved')
		return Message.findOne({message: 'badword'})
	})
	.then(censored => {
		if(censored){
				console.log('censored words found', censored)
				return Message.remove({_id: censored.id})
		}
		io.emit('message', req.body)
		res.sendStatus(200)
	})
	.catch((err) => {
		res.sendStatus(500)
		return console.error(err)
	})*/
	try{
		//throw 'some error'
		var message = new Message(req.body)
		var savedMessage = await message.save()
		console.log('Saved')
	
		var censored = await Message.findOne({message: 'badword'})
	
		if(censored)
			await Message.remove({_id: censored.id})
		else
			io.emit('message', req.body)
	
		res.sendStatus(200)
	}catch(error){
		res.sendStatus(500)
		return console.error(error)
	} finally {
		// console.log('message post called')
	}
})

io.on('connection',(socket) => {
	console.log('a user connected')
})

mongoose.connect(dbUrl, {useMongoClient: true},(err) => {
	console.log('mongo db connection', err)
})

var server = http.listen(3000, () => {
    console.log('server is listening on port', server.address().port)
})