export default function renderScreen(screen,game,renderScreen, requestAnimationFrame,playerID){
    
    const context = screen.getContext('2d')
    context.clearRect(0,0,game.state.screen.width,game.state.screen.height)
    
    let num = 0

    for (let r = 0;  r < 15 ; r++) {
        for(let c = 0; c < 15; c++){
            if((r + c) % 2 === 0) {
                context.fillStyle = '#3B89F6';
                context.fillRect(r, c, 1, 1);
                if(r < 15 && c < 15){
                    
                    game.map.black[num++] = { x: r, y: c}
                }
            } 
            else{
                context.fillStyle = 'white';
                game.map.white[num++] = { x: r, y: c}
                
            }
          
        }
    }
    for(const players in game.state.players){

        
        let player = game.state.players[players]
        if(players == playerID){
            context.fillStyle = '#CCa'
            context.fillRect(player.x,player.y,1,1)
        }
        else{
            context.fillStyle = '#62656C'
            context.fillRect(player.x,player.y,1,1)

        }
        
    }
    for(const bots in game.state.bots){

        const bot = game.state.bots[bots]

        context.fillStyle = '#ff0000dc'
        context.fillRect(bot.x, bot.y, 1, 1)
    }
    for(const indexIncolor in game.state.incolors){

        const incolor = game.state.incolors[indexIncolor]
        context.fillStyle = '#158b11b9'
        context.fillRect(incolor.x, incolor.y, 1, 1)
    }
    for(const indexFruit in game.state.fruits){
        const fruitID = game.state.fruits[indexFruit]
        context.fillStyle = '#FDD000'
        context.fillRect(fruitID.x, fruitID.y, 1, 1)
    }
    for(const indexSpeed in game.state.speedsPlayer){
        const speedID = game.state.speedsPlayer[indexSpeed]
        context.fillStyle = '#9e1559b9'
        context.fillRect(speedID.x, speedID.y, 1, 1)
    }
    
    requestAnimationFrame(() => {

        renderScreen(screen,game,renderScreen,requestAnimationFrame,playerID)

    })
}