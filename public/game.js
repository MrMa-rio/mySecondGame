export default function createGame(){
    let observers = []
    const state = {
        players: {},
        bots: {},
        speeds: {},
        incolors: {},
        freezes: {},
        fruits: {},
        screen: {width: 25, height: 25}
    }
    let map = {
        black: {},
        white: {},
        
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

            ArrowUp(player,validation){
                
                if(validation){
                    if(player.y > 0){

                        player.y = player.y - 1
                    }
                    else{
                        player.y = player.y + (state.screen.height - 1)
                    }
                }
                
            },
            ArrowDown(player, validation){

                if(validation){
                    if(player.y + 1 < state.screen.height){
                        player.y = player.y + 1
                    }
                    else{
                        player.y = 1
                    }
                }
                
            },
            ArrowLeft(player, validation){

                if(validation){
                    if(player.x > 0){
                        player.x = player.x - 1
                    }
                    else{
                        player.x = player.x + (state.screen.width - 1)
                    }
                }
                
            },
            ArrowRight(player, validation){
                if(validation){

                    if(player.x + 1 < state.screen.width){
                        player.x = player.x + 1
                    }
                    else{
                        player.x = 1
                    }
                }
                
            },
            q(player){

                if(player.y > 0 && player.x > 0){
                    player.y = player.y - 0.5
                    player.x = player.x - 0.5
                    
                }
                
            },
            e(player){

                if(player.y >= 0 && player.x < state.screen.width - 1 && player.y > 0){
                    player.y = player.y - 0.5
                    player.x = player.x + 0.5
                }
                
            },
            a(player){

                if(player.y >= 0 && player.x > 0 && player.y < state.screen.height - 1){
                    player.y = player.y + 0.5
                    player.x = player.x - 0.5
                    
                }
                
            },
            d(player){
                
                if(player.y >= 0 && player.x < state.screen.width - 1 && player.y < state.screen.height - 1 ){
                    player.y = player.y + 0.5
                    player.x = player.x + 0.5
                }
            },
        }
        const player = state.players[command.playerID]
        const playerID = command.playerID
        const keyPress = command.keyPress
        const moveFunction = acceptMoves[keyPress]
        const validation = false
        if(player && moveFunction){
            moveFunction(player,validation)
            checkPositionColor(playerID)
        }
    }
    function checkPositionColor(playerID){

        for(const positionB in map.black){
            const posBlack = map.black[positionB]
            for(const playerID in state.players){
                const player = state.players[playerID]
                if(player.x === posBlack.x && player.y === posBlack.y){
                    //console.log('area Black')
                    return
                }
            }
        }
        for(const positionW in map.white){
            const posWhite = map.white[positionW]
            for(const playerID in state.players){
                const player = state.players[playerID]
                if(player.x === posWhite.x && player.y === posWhite.y){
                    //console.log('area White')
                    return
                }
            }
        }
        console.log(state.players)
    }

    return {
        state,
        map,
        movePlayer,
        addPlayer,
        removePlayer,
        subscribe,
        setState,
        notifyAll,
        
        
    }
}