import createGame from "./game.js"
import createKeyboardListener from "./KeyboardListener.js"
import renderScreen from "./renderScreen.js"


const socket = io()
const KeyboardListener = createKeyboardListener(document)

const game = createGame()

KeyboardListener.subscribe(game.movePlayer)
socket.on('connect', () => {
    const playerID = socket.id
    console.log(`Jogador conectado no Cliente com o ID:${playerID}`)
    const screen = document.getElementById('screen')

    renderScreen(screen,game,renderScreen,requestAnimationFrame)
    
})
socket.on('state', (state) => {

    const playerID = socket.id
    game.setState(state)
    //console.log(state)
    
    KeyboardListener.registerPlayerID(playerID)
    KeyboardListener.subscribe(game.movePlayer)
    KeyboardListener.subscribe((command) =>{

        socket.emit('move-Player', command)
    })
})
socket.on('remove-Player', (command) =>{
    game.removePlayer(command)
    console.log(`REMOVENDO ${command.playerID} POR DESCONEXÂO`)
})
socket.on('move-Player', (command) => {

    const playerID = socket.id
    if(playerID !== command.playerID){ // Verificação para que o jogador não receba a propria notificação
        game.movePlayer(command)
        
    }
    
})


