export default function renderScreen(screen,game,renderScreen, requestAnimationFrame,playerID){
    
    const context = screen.getContext('2d')
    context.clearRect(0,0,game.state.screen.width,game.state.screen.height)
    
    let num = 0

    for (let r = 0;  r < 15 ; r++) {
        for(let c = 0; c < 15; c++){
            if((r + c) % 2 === 0) {
                context.fillStyle = '#5a1f1A';
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
            context.fillStyle = '#000'
            context.fillRect(player.x,player.y,1,1)
        }
        else{
            context.fillStyle = '#62656C'
            context.fillRect(player.x,player.y,1,1)

        }
        
    }
    for(const indexIncolor in game.state.incolors){

        const incolor = game.state.incolors[indexIncolor]
        context.fillStyle = '#ECDF44'
        context.fillRect(incolor.x, incolor.y, 1, 1)
    }
    for(const indexFruit in game.state.fruits){
        const fruitID = game.state.fruits[indexFruit]
        context.fillStyle = 'red'
        context.fillRect(fruitID.x, fruitID.y, 1, 1)
    }
    for(const indexSpeed in game.state.speeds){
        const speedID = game.state.speeds[indexSpeed]
        context.fillStyle = 'purple'
        context.fillRect(speedID.x, speedID.y, 1, 1)
    }
    
    requestAnimationFrame(() => {

        renderScreen(screen,game,renderScreen,requestAnimationFrame,playerID)

    })
}