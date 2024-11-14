function determineWinner({player, enemy, timerID}){
    clearTimeout(timerId);
    if(player.health==enemy.health){
        document.getElementById("displayGame").innerHTML="TIE!!!";
        document.getElementById("displayGame").style.display= "flex";
    } 
    else if(player.health>enemy.health){
        document.getElementById("displayGame").innerHTML="PLAYER 1 WIN!!!";
        document.getElementById("displayGame").style.display= "flex";
    }
    else if(player.health<enemy.health){
        document.getElementById("displayGame").innerHTML="PLAYER 2 WIN!!!";
        document.getElementById("displayGame").style.display= "flex";
    }
}
var timer=61;
let timerId;
//decrease timer function
function decreaseTimer(){
    
    if(timer>0){
        timerId=setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById("timer").innerHTML=timer.toString();
    }
    if(timer===0){
        determineWinner({player, enemy, timerId});
    }

}
function rectCollision({
    r1, r2
}){
    return ( r1.attackBox.position.x + r1.attackBox.width>= r2.position.x
        &&  r1.attackBox.position.x <=r2.position.x+r2.width
        &&  r1.attackBox.position.y+ r1.attackBox.height>=r2.position.y
        &&  r1.attackBox.position.y<=r2.position.y+r2.height &&  r1.isAttacking);
}
