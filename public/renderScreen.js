export default function renderScreen(screen,game,renderScreen, requestAnimationFrame){
    
    const context = screen.getContext('2d')
    context.clearRect(0,0,game.state.screen.width,game.state.screen.height)
    let map = {
        black: {},
        white: {},
    }
    let num = 0

    
    for (let r = 0;  r < 40 / 4; r++) {
        for(let c = 0; c < 40 / 4; c++){
            if((r + c) % 2 === 0) {
                context.fillStyle = '#0C5';
                if(r < 10 && c < 10){
                    map.black[num++] = { x: r, y: c}
                }
            } 
            else{
                context.fillStyle = 'white';
                map.white[num++] = { x: r, y: c}
                
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