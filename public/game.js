export default function createGame(){
    let observers = []
    let validation = false
    const state = {
        players: {},
        bots: {},
        speeds: {},
        incolors: {},
        freezes: {},
        fruits: {},
        screen: {width: 15, height: 15}
    }
    let map = {
        black: {},
        white: {},
        
    }
    function start(){
        setInterval(addIncolor, 8000)
    }
    function deleteAuto(){
        setInterval(() => {
            for(const incolor in state.incolors){
                delete state.incolors[incolor]
                
                notifyAll({
                    type: 'remove-Incolor',
                    incolorID: incolor
                })
            }
        },16000)
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
    function addIncolor(command){
        if(Object.keys(state.incolors).length < 1){

            const incolorID = command ? command.incolorID : Math.floor(Math.random() * 10000000)
            const positionX = command ? command.positionX : Math.floor(Math.random() * state.screen.width)
            const positionY = command ? command.positionY : Math.floor(Math.random() * state.screen.height)

            state.incolors[incolorID] = {
                x: positionX,
                y: positionY,
            }
        
            notifyAll({
                type: 'add-Incolor',
                incolorID: incolorID,
                positionX: positionX,
                positionY: positionY,
            })
        }
    }
    function removeIncolor(command){
        if(command){
            delete state.incolors[command.incolorID]
            
            notifyAll({
                type: 'remove-Incolor',
                incolorID: command.incolorID
            }) 
            
        }
    }
    function subscribe(observerFunction){
        observers.push(observerFunction)
    }
    function unsubscribe(observerFunction){
        observers = observers.filter(result => result !== observerFunction )
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
                        player.y = 0
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
                        player.x = 0
                    }
                }
                
            },
            q(player){
                if(!validation){
                    if(player.y > 0 && player.x > 0){
                    player.y = player.y - 1
                    player.x = player.x - 1
                    
                }
                }
                
                
            },
            w(player,validation){
                
                if(validation){
                    if(player.y > 0){

                        player.y = player.y - 1
                    }
                    else{
                        player.y = player.y + (state.screen.height - 1)
                    }
                }
                
            },
            e(player){
                if(!validation){
                    if(player.y >= 0 && player.x < state.screen.width - 1 && player.y > 0){
                        player.y = player.y - 1
                        player.x = player.x + 1
                    }
                }
                
                
            },
            a(player,validation){
                if(validation){
                   if(player.x > 0){
                            player.x = player.x - 1
                        }
                        else{
                            player.x = player.x + (state.screen.width - 1)
                        }
                }
                else{
                    if(player.y >= 0 && player.x > 0 && player.y < state.screen.height - 1){
                        player.y = player.y + 1
                        player.x = player.x - 1
                    }
                }
                
            },
            s(player, validation){

                if(validation){
                    if(player.y + 1 < state.screen.height){
                        player.y = player.y + 1
                    }
                    else{
                        player.y = 0
                    }
                }
                
            },
            d(player){
                
                if(validation){

                    if(player.x + 1 < state.screen.width){
                        player.x = player.x + 1
                    }
                    else{
                        player.x = 0
                    }
                }
                else{
                    if(player.y >= 0 && player.x < state.screen.width - 1 && player.y < state.screen.height - 1 ){
                        player.y = player.y + 1
                        player.x = player.x + 1
                    }
                }


            },
        }
        const player = state.players[command.playerID]
        const playerID = command.playerID
        const keyPress = command.keyPress
        
        const moveFunction = acceptMoves[keyPress]
        
        if(player && moveFunction){
            
            moveFunction(player,validation)
            checkPositionColor(playerID)
            checkForIncolorColision(playerID)
            
            //console.log(state.players)
        }
    }
    function checkPositionColor(currentPlayer){

        for(const positionB in map.black){
            const posBlack = map.black[positionB]
            for(const playerID in state.players){
                if(currentPlayer == playerID){
                    const player = state.players[playerID]
                if(player.x === posBlack.x && player.y === posBlack.y){
                    //console.log('area Black')
                    return
                }
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
        
    }
    function checkForIncolorColision(currentPlayer){

        for(const indexPlayer in state.players){
            const player = state.players[indexPlayer]
            for(const indexIncolor in state.incolors){

                const incolor = state.incolors[indexIncolor]

                if(indexPlayer === currentPlayer){
                    if(player.x === incolor.x && player.y === incolor.y){
                        removeIncolor({incolorID:indexIncolor})
                        validation = true
                    }
                }
                
            }
        }

    }
    return {
        state,
        map,
        start,
        deleteAuto,
        movePlayer,
        addPlayer,
        removePlayer,
        addIncolor,
        removeIncolor,
        subscribe,
        unsubscribe,
        setState,
        notifyAll,
        
        
    }
}