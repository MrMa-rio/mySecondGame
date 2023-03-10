import express from 'express'
import http from 'http'
import  Server  from 'socket.io'
import createGame from './public/game.js'


const app = express()
const server = http.createServer(app)
const sockets = new Server(server)
const game = createGame()

app.use(express.static('public'))

game.subscribe((command) => {
    console.log(`Emitindo ${command.type}`)
    sockets.emit(command.type, command)
})

sockets.on('connection', (socket) => {
    const playerID = socket.id

    game.addPlayer({playerID: playerID})
    
    socket.emit('state', game.state)
    
    socket.on('disconnect', () =>{
        
        game.removePlayer({playerID: playerID})
        game.removeBot()
        console.log(`Jogador ID:${playerID} desconectado`)
    })
    socket.on('move-Player', (command) => {
        command.playerID = playerID
        command.type = 'move-Player'
        game.movePlayer(command)
    })
    console.log(`ID:${playerID} CONNECTED SERVIDOR`);
})
    game.start()
    game.deleteAuto()
server.listen('3000');