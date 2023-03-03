import createGame from "./game.js"
import createKeyboardListener from "./KeyboardListener.js"
import renderScreen from "./renderScreen.js"



const socket = io()
const game = createGame()
const KeyboardListener = createKeyboardListener(document)
KeyboardListener.subscribe(game.movePlayer)
game.tutorials(document)

socket.on('connect', () => {
    const playerID = socket.id
    console.log(`Jogador conectado no Cliente com o ID:${playerID}`)
    const screen = document.getElementById('screen')

    renderScreen(screen, game, renderScreen, requestAnimationFrame, playerID)
    
    socket.on('disconnect', () => {

        KeyboardListener.unsubscribe(game.movePlayer);   
    })
})
socket.on('state', (state) => {

    const playerID = socket.id
    game.setState(state)
    KeyboardListener.registerPlayerID(playerID)
    KeyboardListener.subscribe((command) =>{

        socket.emit('move-Player', command)
    })
})
socket.on('add-Player', (command) => {
    game.addPlayer(command)
    game.secondScreen()
})
socket.on('remove-Player', (command) =>{
    game.removePlayer(command)
    console.log(`REMOVENDO ${command.playerID} POR DESCONEXÂO`)
})
socket.on('add-Bot', (command) =>{
    game.addBot(command)
    
})
socket.on('add-Incolor', (command) => {
    game.addIncolor(command)
})
socket.on('remove-Incolor', (command) =>{
    game.removeIncolor(command)
})
socket.on('add-Fruit', (command) => {
    game.addFruit(command)
    
})
socket.on('remove-Fruit', (command) => {
    game.removeFruit(command)
})
socket.on('add-Speed', (command) => {
    game.addSpeed(command)
})
socket.on('remove-Speed', (command) =>{
    game.removeSpeed(command)
    
})
socket.on('move-Player', (command) => {

    const playerID = socket.id
    if(playerID !== command.playerID){ 
        
        game.movePlayer(command)
    }
   console.log(game.state.players)
})
socket.on('move-Bot', (command) =>{
    
    const botID = game.state.bots[command.botID]
    botID.x = command.positionX
    botID.y = command.positionY
    botID.distancePlayer = command.distancePlayer
})
socket.on('win-Points', (command) =>{
    
    const playerID = command.playerID
    const points = command.points
    const sound = document.createElement('audio')
    if(points % 10 == 0){
        sound.src = './sound/collect-100-green.mp3'
    }
    else{
        sound.src = './sound/collect-sound.mp3'
    }
    
    sound.play()
    game.state.players[playerID].points = points
})
socket.on('change-Speed-Player', (command) =>{
    const playerID = command.playerID
    const velocity = command.velocity
    game.state.players[playerID].velocity = velocity
})
socket.on('bot-player-colision', ((command) =>{
    console.log(command)
    game.state.players[command.playerID] = {
        x: command.x,
        y: command.y, 
        points: command.points,
        velocity: command.velocity,
        
    }

}))
socket.on('incolor-colision', () =>{
    let sec = 7
    setInterval(() =>{

        game.time(sec)
        sec--
        if(sec < 0){
            clearInterval()
        }
    },1000)
    
    
    
})


