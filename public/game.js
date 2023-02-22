export default function createGame(){
    let observers = []
    const state = {
        players: {},
        bots: {},
        speed: {},
        incolor: {},
        freeze: {},
        screen: {width: 10, height: 10}
    }

    function addPlayer(command){

        const playerID = command.playerID
        const positionX = 'positionX' in command ? command.positionX : Math.floor(Math.random() * state.screen.width)
        const positionY = 'positionY' in command ? command.positionY : Math.floor(Math.random() * state.screen.height)
        
        state.players[playerID] = {
            x: positionX,
            y: positionY,
        
        }
        
        notifyAll({
            type: 'add-Player',
            playerID: playerID,
            positionX: positionX,
            positionY: positionY,
        })
    }

    function removePlayer(command){
        delete state.players[command.playerID]

        notifyAll({
            type: 'remove-Player',
            playerID: command.playerID
        })
    }

    function subscribe(observerFunction){
        observers.push(observerFunction)
    }
    function notifyAll(command){
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }
    function setState(newState){
        Object.assign(state, newState)
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptMoves = {

            ArrowUp(player){
                
                
                if(player.y > 0){

                    player.y = player.y - 0.5
                    
                }
                else{

                    player.y = player.y + (state.screen.height - 0.5)
                }
            },
            ArrowDown(player){

                if(player.y + 1 < state.screen.height){
                    player.y = player.y + 0.5
                }
                else{
                    player.y = 0
                }
            },
            ArrowLeft(player){

                if(player.x > 0){
                    player.x = player.x - 0.5
                }
                else{
                    player.x = player.x + (state.screen.width - 0.5)
                }
            },
            ArrowRight(player){

                if(player.x + 1 < state.screen.width){
                    player.x = player.x + 0.5
                }
                else{
                    player.x = 0
                }
            },
            q(player){

                if(player.y > 0 && player.x > 0){
                    player.y = player.y - 0.5
                    player.x = player.x - 0.5
                    
                }
                
            },
            e(player){

                if(player.y >= 0 && player.x < 9 && player.y > 0){
                    player.y = player.y - 0.5
                    player.x = player.x + 0.5
                }
                
            },
            a(player){

                if(player.y >= 0 && player.x > 0 && player.y < 9){
                    player.y = player.y + 0.5
                    player.x = player.x - 0.5
                    
                }
                
            },
            d(player){

                if(player.y >= 0 && player.x < 9 && player.y < 9 ){
                    player.y = player.y + 0.5
                    player.x = player.x + 0.5
                }
            },
        }
        const player = state.players[command.playerID]
        const playerID = command.playerID
        const keyPress = command.keyPress
        const moveFunction = acceptMoves[keyPress]

        if(player && moveFunction){
            moveFunction(player)
            //checkForFruitCollision(playerID)
        }
    }

    return {
        state,
        movePlayer,
        addPlayer,
        removePlayer,
        subscribe,
        setState,
        notifyAll,
    }
}