const canvas= document.querySelector("canvas");
const c=canvas.getContext('2d');

canvas.width=1024;
canvas.height=600;

c.fillRect(0, 0, canvas.width,canvas.height);

const gravity=0.15;

//create player and parse in values into Sprite object
const player = new Fighter({position: {
    x: 0,
    y: 0
}, velocity: {
    x: 0,
    y: 4
}, color: "green", offset: {
    x:0,
    y:0
}, imageSrc: "./characterAsset/Player1/Idle.png",
frameMax:8,
scale: 2,
offset:{
    x:0,
    y:93
    },
    sprites:{
        idle:{
            imageSrc: "./characterAsset/Player1/Idle.png",
            frameMax:8
    
        },
        run:{
            imageSrc:"./characterAsset/Player1/Run.png",
            frameMax:8
        },
        jump:{
            imageSrc:"./characterAsset/Player1/Jump.png",
            frameMax:2
        },
        fall: {
            imageSrc:"./characterAsset/Player1/Fall.png",
            frameMax:2
        },
        attack1: {
            imageSrc:"./characterAsset/Player1/Attack1.png",
            frameMax:6
        }
        ,
        takeHit: {
            imageSrc:"./characterAsset/Player1/Take hit - white silhouette.png",
            frameMax:4
        },
        death: {
            imageSrc:"./characterAsset/Player1/Death.png",
            frameMax:6
        }
       
    },
    attackBox:{
        offset:{
            x:95,
            y:50,
        },
        width:100,
        height:50
    }

});

//create enemy and parse in values into Sprite object
const enemy = new Fighter({position: {
    x: 600,
    y: 150
}, velocity: {
    x: 0,
    y: 4
}, offset:{
    x: 0,
    y: 107
}, imageSrc: "./characterAsset/Player2/Idle.png",
frameMax:4,
scale: 2,
    sprites:{
        idle:{
            imageSrc: "./characterAsset/Player2/Idle.png",
            frameMax:4
    
        },
        run:{
            imageSrc:"./characterAsset/Player2/Run.png",
            frameMax:8
        },
        jump:{
            imageSrc:"./characterAsset/Player2/Jump.png",
            frameMax:2
        },
        fall: {
            imageSrc:"./characterAsset/Player2/Fall.png",
            frameMax:2
        },
        attack1: {
            imageSrc:"./characterAsset/Player2/Attack1.png",
            frameMax:4
        },
        takeHit: {
            imageSrc:"./characterAsset/Player2/Take hit.png",
            frameMax:3
        },
        death: {
            imageSrc:"./characterAsset/Player2/Death.png",
            frameMax:7
        }
        
    },
    attackBox:{
        offset:{
            x:-130,
            y:0,
        },
        width: 100,
        height:50
    }

});
const background= new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./characterAsset/background.png"
});
const shop= new Sprite({
    position: {
        x: 605,
        y: 95
    },
    imageSrc: "./characterAsset/shop.png",
    scale: 3,
    frameMax: 6
});
// create animation
const keys={
    //first key
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    //2nd Key
    ArrowLeft:{
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowUp:{
        pressed: false
    }
}
function animate(){
    //loop the animate function over and over again (act as a infinite loop)
    window.requestAnimationFrame(animate);
    c.fillStyle='black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();
    player.velocity.x=0;
    enemy.velocity.x=0;
    //player movement

    if (keys.a.pressed && player.lastKey =="a"){
        player.velocity.x=-4;
        player.switchSprite("run");
    }
    else if(keys.d.pressed && player.lastKey =="d"){
        player.velocity.x=4;
        player.switchSprite("run");
    }
    else {player.switchSprite("idle");};
    if (player.velocity.y<0){
        player.switchSprite("jump");
    }
    else if(player.velocity.y>0){
        player.switchSprite("fall");
    }
    //2nd player movement
    if (keys.ArrowLeft.pressed && enemy.lastKey =="ArrowLeft"){
        enemy.velocity.x=-4;
        enemy.switchSprite("run");
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey =="ArrowRight"){
        enemy.velocity.x=4;
       enemy.switchSprite("run");
    }
    else {enemy.switchSprite("idle");};
    if (enemy.velocity.y<0){
        enemy.switchSprite("jump");
    }
    else if(enemy.velocity.y>0){
        enemy.switchSprite("fall");
    }

    //detect collision
    if (rectCollision({r1: player, r2: enemy} ) && player.isAttacking && player.frameCurrent===4){
        enemy.takeHit();
        player.isAttacking=false;
        console.log("player attacking successful");
      
        document.querySelector('#enemyHealth').style.width=enemy.health+"%";

    }
    if (player.isAttacking && player.frameCurrent === 4){
        player.isAttacking=false;
    }
    if (rectCollision({r1: enemy, r2: player})&& enemy.isAttacking && enemy.frameCurrent===2){
        enemy.isAttacking=false;
        console.log("enemy attacking successful");
        player.takeHit();
        document.querySelector('#playerHealth').style.width=player.health+"%";
        
    }
    if (enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking=false;
    }
    //end game base on health
    if(enemy.health<=0 || player.health<=0){
        determineWinner({player, enemy});
    }


}

decreaseTimer();
animate();

//add Event Listener that listen to an event (key down, key up)

window.addEventListener('keydown', (event)=>{
    if(!player.death){


    switch(event.key){

        //1st player key
        case 'd':
            
            keys.d.pressed=true;
            player.lastKey="d";
            
        break;
        case 'a':
            keys.a.pressed=true;
            player.lastKey="a";
        break;
        case 'w':
            player.velocity.y=-8;
        break;
        case 'j':
            player.attack();
        break;
    }
}
if(!enemy.death){
    switch(event.key){
        //2nd player key
        case 'ArrowRight':
            keys.ArrowRight.pressed=true;
            enemy.lastKey='ArrowRight'
        
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=true;
            enemy.lastKey="ArrowLeft";
        break;
        case 'ArrowUp':
            enemy.velocity.y=-8;
        break;
        case '1':
            if(event.code=='Numpad1') enemy.attack();
        break;
    }
}
});
window.addEventListener('keyup', (event)=>{
    switch(event.key){
        //1st key up
        case 'd':
            keys.d.pressed=false;
        break;
        case 'a':
            keys.a.pressed=false;
        break;
        case 'w':
            keys.w.pressed=false;
        break;
        
        //2nd key up
        case 'ArrowRight':
            keys.ArrowRight.pressed=false;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed=false;
        break;
        case 'ArrowUp':
            keys.ArrowUp.pressed=false;
        break;
    }
});
