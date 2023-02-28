import createGame from "./game.js"
import createKeyboardListener from "./KeyboardListener.js"
import renderScreen from "./renderScreen.js"


const socket = io()
const game = createGame()
const KeyboardListener = createKeyboardListener(document)
KeyboardListener.subscribe(game.movePlayer)

socket.on('connect', () => {
    const playerID = socket.id
    console.log(`Jogador conectado no Cliente com o ID:${playerID}`)
    const screen = document.getElementById('screen')

    renderScreen(screen, game, renderScreen, requestAnimationFrame, playerID)
    
    socket.on('disconnect', () => {

        KeyboardListener.unsubscribe(game.movePlayer);   
    })
    //console.log(game.map)
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
})
socket.on('remove-Player', (command) =>{
    game.removePlayer(command)
    console.log(`REMOVENDO ${command.playerID} POR DESCONEXÂO`)
})
socket.on('add-Bot', (command) =>{
    game.addBot(command)
    console.log(game.state.bots)
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
    //console.log(command)
})
socket.on('add-Speed', (command) => {
    game.addSpeed(command)
})
socket.on('remove-Speed', (command) =>{
    game.removeSpeed(command)
    
})
socket.on('move-Player', (command) => {

    const playerID = socket.id
    if(playerID !== command.playerID){ // Verificação para que o jogador não receba a propria notificação
        
        game.movePlayer(command)
    }
   console.log(game.state.players)
})
socket.on('move-Bot', (command) =>{
    
    const botID = game.state.bots[command.botID]
    botID.x = command.positionX
    botID.y = command.positionY
    botID.distancePlayer = command.distancePlayer
    console.log(command)
})
socket.on('win-Points', (command) =>{
    console.log(command)
    const playerID = command.playerID
    const points = command.points
    game.state.players[playerID].points = points
})
socket.on('change-Speed-Player', (command) =>{
    const playerID = command.playerID
    const velocity = command.velocity
    game.state.players[playerID].velocity = velocity
})


