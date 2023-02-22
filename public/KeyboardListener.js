export default function createKeyboardListener(document){

    document.addEventListener('keydown', handleKeydown)
    const state = {
        observers: [],
        playerID: null,
    }

    function registerPlayerID(playerID){
        state.playerID = playerID
    }
    function subscribe(observerFunction){
        state.observers.push(observerFunction)
    }
    function unsubscribe(observerFunction){
        observers = observers.filter(result => result !== observerFunction )
    }
    function notifyAll(command){
        for(const observerFunction of state.observers){
            observerFunction(command)
        }
    }
    function handleKeydown(event){
        
        const keyPress = event.key || event
        console.log(keyPress)
        const command = {
            type: 'move-Player',
            playerID: state.playerID,
            keyPress,
        } 
        if(command){
            notifyAll(command)
        }
    }
    return{
        registerPlayerID,
        subscribe,
        unsubscribe,
    }

}