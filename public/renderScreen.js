export default function renderScreen(screen,game,renderScreen, requestAnimationFrame){
    
    const context = screen.getContext('2d')
    context.clearRect(0,0,game.state.screen.width,game.state.screen.height)
    
    let num = 0

    
    for (let r = 0;  r < 25 ; r++) {
        for(let c = 0; c < 25; c++){
            if((r + c) % 2 === 0) {
                context.fillStyle = '#0C5';
                if(r < 25 && c < 25){
                    
                    game.map.black[num++] = { x: r, y: c}
                }
            } 
            else{
                context.fillStyle = 'white';
                game.map.white[num++] = { x: r, y: c}
                
            }
          context.fillRect(r, c, 1, 1);
        }
    }
   for(const player in game.state.players){

    let playerID = game.state.players[player]
    context.fillStyle = '#ff3220'
    context.fillRect(playerID.x,playerID.y,1,1)
   }
    
    
    
    requestAnimationFrame(() => {

        renderScreen(screen,game,renderScreen,requestAnimationFrame)

    })
}