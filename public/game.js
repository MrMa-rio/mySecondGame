

export default function createGame(){
    let observers = []
    let isTrueIncolor = false
    const state = {
        players: {}, //
        bots: {}, //
        speedsPlayer: {}, //
        incolors: {}, //
        freezes: {},
        fruits: {}, //
        screen: {width: 15, height: 15}
    }
    let map = {
        black: {},
        white: {},
    }
    function start(){
        setInterval(addIncolor, 8000)
        setInterval(addFruit,500)
        setInterval(addSpeed, 3500)
        setInterval(moveBot,1500)
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
        setInterval(() =>{
            for(const indexSpeed in state.speeds){
                delete state.speeds[indexSpeed]

                notifyAll({
                    type: 'remove-Speed',
                    speedID: indexSpeed
                })
            }
        },40000)
    }
    function addPlayer(command){
        if(Object.keys(state.players).length < 1){
            
            const playerID = command.playerID
            const positionX = 'positionX' in command ? command.positionX : Math.floor(Math.random() * state.screen.width)
            const positionY = 'positionY' in command ? command.positionY : Math.floor(Math.random() * state.screen.height)
            const velocity = 'velocity' in command ? command.velocity : 500
            const points = 'points' in command ? command.points : 0
            state.players[playerID] = {
                x: positionX,
                y: positionY,
                velocity: velocity,
                points: points
            
            }
            addBot()
            notifyAll({
                type: 'add-Player',
                playerID: playerID,
                positionX: positionX,
                positionY: positionY,
                velocity: velocity,
                points: points,
            })
            }
        
    }
    function removePlayer(command){
        delete state.players[command.playerID]

        notifyAll({
            type: 'remove-Player',
            playerID: command.playerID
        })
    }
    function addBot(command){
        if(Object.keys(state.bots).length < 1){
            
            const botID = command ? command.botID : Math.floor(Math.random() * 1000)
            const positionX = command ? command.positionX : Math.floor(Math.random() * state.screen.width)
            const positionY = command ? command.positionY : Math.floor(Math.random() * state.screen.height)
            const distancePlayer = command ? command.distancePlayer : state.screen.width + state.screen.height
            
            
            state.bots[botID] = {
                x: positionX,
                y: positionY,
                distancePlayer: distancePlayer,
            }
            
            notifyAll({
                type: 'add-Bot',
                botID: botID,
                positionX: positionX,
                positionY: positionY,
                distancePlayer: distancePlayer,
                
            })
        }
    }
    function removeBot(){
        for(const indexBot in state.bots){
            
            delete state.bots[indexBot]

            notifyAll({
                type: 'remove-Bot',
                botID: indexBot
            })
        }
        
        
        
    }
    function addFruit(command){
        if(Object.keys(state.fruits).length < 3){
            const fruitID = command ? command.fruitID : Math.floor(Math.random() * 10000000)
            const positionX = command ? command.positionX : Math.floor(Math.random() * state.screen.width)
            const positionY = command ? command.positionY : Math.floor(Math.random() * state.screen.height)

            state.fruits[fruitID] = {
                x: positionX,
                y: positionY,
            }
            notifyAll({ 
                type: 'add-Fruit',
                fruitID: fruitID,
                positionX: positionX,
                positionY: positionY
            })
        }
    }
    function removeFruit(command){

        const fruitID = command.fruitID
        delete state.fruits[fruitID]
        
        notifyAll({ 
            type:'remove-Fruit', 
            fruitID:fruitID,
            
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
    function addSpeed(command){
        if(Object.keys(state.speedsPlayer).length < 2){
            const speedID = command ? command.speedID : Math.floor(Math.random() * 1000)
            const positionX = command ? command.positionX : Math.floor(Math.random() * state.screen.width)
            const positionY = command ? command.positionY : Math.floor(Math.random() * state.screen.height)

            state.speedsPlayer[speedID] = {

                speedID: speedID,
                x: positionX,
                y: positionY,
            }

            notifyAll({
                type: 'add-Speed',
                speedID: speedID,
                positionX: positionX,
                positionY: positionY
            })
        }
    }
    function removeSpeed(command){

        if(command){
            delete state.speedsPlayer[command.speedID]

            notifyAll({
                type: 'remove-Speed',
                speedID: command.speedID
            })
        }
    }
    function setChangeSpeed(playerID,currentPlayer){
        if(playerID.velocity > 0){
            playerID.velocity = playerID.velocity - 500
        }
        notifyAll({
            type: 'change-Speed-Player',
            playerID: currentPlayer,
            velocity: playerID.velocity
        })
    }
    function winPoints(currentPlayer,playerID){
        console.log(`${currentPlayer} ganhou 1 PONTO!!`)
        playerID.points = playerID.points + 1
        console.log(state.players)
        notifyAll({
            type: 'win-Points',
            playerID: currentPlayer,
            points: state.players[currentPlayer].points,
        })
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
                if(!isTrueIncolor){
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
            e(player,validation){
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
            d(player,validation){
                
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
            
            setTimeout(() => {
                moveFunction(player,isTrueIncolor)
                checkPositionColor(playerID)
                checkForIncolorColision(playerID)
                checkForFruitCollision(playerID)
                checkForSpeedCollision(playerID)
            },player.velocity) 
        }
    }
    function moveBot(){
        let distancePlayer
        let distanceX
        let distanceY
        
        for(const indexBot in state.bots){
    
            const botID = state.bots[indexBot]
            for(const indexPlayer in state.players){
                
                const playerID = state.players[indexPlayer]
                
                checkForBotCollision(playerID,indexPlayer, botID)

                distancePlayer = (botID.x - playerID.x) + (botID.y - playerID.y)
                
                if(distancePlayer < 0){
                    
                    distancePlayer = distancePlayer - distancePlayer - distancePlayer //convertendo valores negativos para positivos
                }
                
                if(distancePlayer < botID.distancePlayer){
                    
                    botID.distancePlayer = distancePlayer
                    distanceX = (botID.x - playerID.x)
                    distanceY = (botID.y - playerID.y)
                    distancePlayer = botID.distancePlayer
                }
                if(distancePlayer > botID.distancePlayer){

                    botID.distancePlayer = distancePlayer
                    distanceX = (playerID.x - botID.x)
                    distanceY = (playerID.y - botID.y)
                    distancePlayer = botID.distancePlayer

                }
                
                if(distancePlayer == botID.distancePlayer){
                    
                    botID.distancePlayer = distancePlayer
                    
                        if(botID.y < playerID.y){
                            botID.y++
                        }
                        if(botID.x > playerID.x){
                            botID.x--
                        }
                        if(botID.y > playerID.y){
                            botID.y--
                        }
                        if(botID.x < playerID.x){
                            botID.x++
                        }
                    
                    distancePlayer = botID.distancePlayer
                }
                notifyAll({

                    type: 'move-Bot',
                    botID: indexBot,
                    positionX: botID.x,
                    positionY: botID.y,
                    distancePlayer: botID.distancePlayer
                    
                })
            }
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
                        isTrueIncolor = true
                    }
                }
                if(isTrueIncolor){
                    setTimeout(() => {
                        isTrueIncolor = false
                    },5000)
                }
                
            }
        }

    }
    function checkForFruitCollision(currentPlayer){

        const playerID = state.players[currentPlayer]
        for(const fruitID in state.fruits){
            const fruit = state.fruits[fruitID]
            
            if(playerID.x === fruit.x && playerID.y === fruit.y){

                console.log(`Colisao entre ${currentPlayer} e ${fruitID}`)
                
                removeFruit({fruitID: fruitID})
                winPoints(currentPlayer,playerID)
            }
        }
    }
    function checkForSpeedCollision(currentPlayer){

        const playerID = state.players[currentPlayer]
        for(const speedID in state.speeds){
            const speed = state.speeds[speedID]
            if(playerID.x === speed.x && playerID.y === speed.y){
                removeSpeed({speedID: speedID})
                setChangeSpeed(playerID, currentPlayer)
            }
        }
    }
    function checkForBotCollision(playerID,indexPlayer, botID){

        if(botID.x == playerID.x && botID.y == playerID.y){

            const velocity = 2500
            const points = 0
            const x = Math.floor(Math.random() * state.screen.width)
            const y = Math.floor(Math.random() * state.screen.height)

            state.players[indexPlayer] = {
                velocity: velocity,
                points: points,
                x: x,
                y: y,
            }

            notifyAll({
                type: 'bot-player-colision',
                playerID: indexPlayer,
                velocity: velocity,
                points: points,
                x: x,
                y: y,

            })
            console.log(state.players[indexPlayer])
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
        addBot,
        removeBot,
        moveBot,
        addFruit,
        removeFruit,
        addIncolor,
        removeIncolor,
        addSpeed,
        removeSpeed,
        subscribe,
        unsubscribe,
        setState,
        notifyAll,
    }
}
            