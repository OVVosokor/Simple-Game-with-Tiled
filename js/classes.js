//*********** class FPS counter
class FrameRateCounter {
    constructor( delay ) {
        this.lastFrameCount = 0;
        let dateTemp = new Date();
        this.frameLast = dateTemp.getTime();
        //delete dateTemp;
        this.frameCtr = 0;
        this.frameIndex = 0;
        this.delay = delay;
    }
    countFrames() {
        let dateTemp =new Date();	
        this.frameCtr++;

        if ( dateTemp.getTime() >= this.frameLast + this.delay ) {
            //console.log( "frame event" );
            this.frameIndex++;
            //console.log( this.frameIndex );
            this.lastFrameCount = this.frameCtr;
            this.frameLast = dateTemp.getTime();
            this.frameCtr = 0;
        }
        
        if ( this.frameIndex >= 7 ) { //TODO проверить значение
            this.frameIndex = 0;
        }
        //delete dateTemp;
    }
}
//********* NON STATIC 
class NONSTATIC {
    constructor( x, y ) {
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100;
        this.sourceDY = 0; //128
        this.moveMode = 'run'; //run
        this.isAnimate = true;
    }
    //*check collide
    boundingObjectCollide( object1, object2 ) {
        //console.log( object1, object2 );
        var left1 = object1.x;
        var left2 = object2.x;
        var right1 = object1.x + object1.width;
        var right2 = object2.x + object2.width;
        var top1 = object1.y;
        var top2 = object2.y;
        var bottom1 = object1.y + object1.height;
        var bottom2 = object2.y + object2.height;
        
        if (bottom1 < top2) return( false );
        if (top1 > bottom2) return( false );
        
        if (right1 < left2) return( false );
        if (left1 > right2) return( false );
        
        return( true );
    }
    //*render
    render() {
        let animationFrames = [];
        frameIndexCounter.delay = this.delay;

        for ( let i = 0; i < this.animFrames; i++ ) {
            animationFrames.push( i );
        }
        //console.log( animationFrames );
        let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.animFrames ) * 64;
        let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.animFrames ) * 64;
        //console.log( typeof this.tileSheet );
        ctx.drawImage( this.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width , this.height );
        
        //console.log( sourceX, sourceY );
        
        if ( this.moveMode === 'run' ) { //'run' this.moveMode === moveMode
            //console.log( this.isAnimate , this.moveMode );
            this.frameIndex = frameIndexCounter.frameIndex;
            //console.log( this.frameIndex );
            //console.log( frameIndexCounter );
            if ( this.frameIndex === animationFrames.length ) {
                this.frameIndex = 0;
                frameIndexCounter.frameIndex = 0;
            }
        }else{
            this.frameIndex = 0;
        }
    }
    //*check keys
    update() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }
    
}
class HOMO_SAPIENS extends NONSTATIC {
    constructor(  x, y ) { //tileSheet, animFrames, x, y, delay, visibility
        super();
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
       // this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAttack = false;
    }
    //*check collide
    boundingEnemyCollide() {
        for ( let i = 0; i < itemsOfStaticNpc.length; i++ ) {
            if ( super.boundingObjectCollide( this, itemsOfStaticNpc[i] ) ) {
                return true;
            }
        }
    }
    //*to attacked
    toAttack() {
        this.isAttack = true;
        //console.log('ATTACK');
    }
    //*render
    render() {
        super.render();
    }
    //*check keys
    update() {
        super.update();
    }
}
class HUMAN extends HOMO_SAPIENS {
    constructor( body, costumes, x, y, isPlayer, visible ) {
        super();
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.costumes = costumes;
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.name = '';
        this.isAttack = false;
        this.life = 100;
        this.isPlayer = isPlayer;
        this.visible = visible;
        //*tiles
        if ( isPlayer ) {
            this.body = body.human.walk.tileSheet;
            this.animFrames = body.human.walk.animFrames;
        }
        this.tileSheet = this.body
        console.log( this.body, this.costumes, this.x, this.y, this.isPlayer, this.visible );

    }
    //*render
    render() {
        if ( this.visible ) {
            super.render();
        }
    }
    //**to Attack
    toAttack() {
        super.toAttack();
    }
    //*check keys
    update() {
        if ( pressesKeys.size > 0 && this.isPlayer ) {
            //console.log( pressesKeys ); 
            for ( const code of pressesKeys.values() ) {
                switch ( code ) {
                    case 'ArrowUp':
                        this.sourceDY = 0;
                        this.dx = 0;
                        this.dy = -1;
                        this.moveMode = 'run';
                        break;
                    case 'ArrowLeft':
                        this.sourceDY = 64;
                        this.dx = -1;
                        this.dy = 0;
                        this.moveMode = 'run';
                        break;
                    case 'ArrowDown':
                        this.sourceDY = 128;
                        this.dx = 0;
                        this.dy = 1;
                        this.moveMode = 'run';
                        break;
                    case 'ArrowRight':
                        this.sourceDY = 198;
                        this.dx = 1;
                        this.dy = 0;
                        this.moveMode = 'run';
                        break;
                    case 'Space':
                        this.toAttack();
                        //this.dx = 0;
                        //this.dy = 0;
                        break;
                }
            }
            
            //console.log( this.x, this.y );
            if ( !pressesKeys.has( 'Space' ) ) {
                this.x = this.x + this.dx;
                this.y = this.y + this.dy;
            }
        }else{
            this.moveMode = 'idle';
        }
    }
    
}



















/*
class Player extends Npc {
    static isAttack = false;
    constructor(  x, y ) { //tileSheet, animFrames, x, y, delay, visibility
        super();
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
       // this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.name = '';

    }

    boundingStaticNpcCollide() {
        for ( let i = 0; i < game.itemsOfStaticNpc.length; i++ ) {
            if ( super.boundingBoxCollide( this, game.itemsOfStaticNpc[i] ) ) {
                return true;
            }
        }
    }
    setAttack() {
        Player.isAttack = true;
        //console.log('ATTACK');
    }

    update() {
        if ( game.isPressKey ) {
            //console.log( game.pressed );
            
            for ( const code of game.pressedKeys.values() ) {
                switch ( code ) {
                    case 'ArrowUp':
                        this.sourceDY = 0;
                        this.dx = 0;
                        this.dy = -1;
                        break;
                    case 'ArrowLeft':
                        this.sourceDY = 64;
                        this.dx = -1;
                        this.dy = 0;
                        break;
                    case 'ArrowDown':
                        this.sourceDY = 128;
                        this.dx = 0;
                        this.dy = 1;
                        break;
                    case 'ArrowRight':
                        this.sourceDY = 198;
                        this.dx = 1;
                        this.dy = 0;
                        break;
                    case 'Space':
                        this.setAttack();
                        //this.dx = 0;
                        //this.dy = 0;
                        break;
                }
            }
            //console.log( this.x, this.y );
            if ( !game.pressedKeys.has( 'Space' ) ) {
                this.x = this.x + this.dx;
                this.y = this.y + this.dy;
            }

        }
    }
}
class Body extends Player {
    constructor( costumes, activeType, x, y, visibility ) { //tileSheet, animFrames, x, y, delay, visibility
        super();
        this.frameIndex = 0;
        this.type = activeType;

        if ( activeType === 'walk' ) {
           // Player.isAttack = false;
            this.tileSheet = costumes.walk[0].tileSheet;
            this.animFrames = costumes.walk[0].animFrames;
        }else{
           // Player.isAttack = true;
            this.tileSheet = costumes.attack[0].tileSheet;
            this.animFrames = costumes.attack[0].animFrames;
        }

        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
        //this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.name = '';
        this.visibility = visibility;
    }
    render() {

        if ( this.visibility ) {

            let animationFrames = [];
            frameIndexCounter.delay = this.delay;

            for ( let i = 0; i < this.animFrames; i++ ) {
                animationFrames.push( i );
            }
            //console.log( this.frameIndex );

            let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.animFrames ) * 64;
            let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.animFrames ) * 64;
            //console.log( typeof this.tileSheet );
            //console.log( this.tileSheet );
            ctx.drawImage( this.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width, this.height );

            //console.log( sourceX, sourceY );
            if ( this.moveMode === 'run' ) {
                this.frameIndex = frameIndexCounter.frameIndex;
                //console.log( this.frameIndex );
                if ( this.frameIndex === animationFrames.length ) {
                    this.frameIndex = 0;
                    frameIndexCounter.frameIndex = 0;
                }
            }else{
                this.frameIndex = 0;
            }
        }
    }

}
class Clothes extends Player {
    constructor( costumes, activeType, clothesType, x, y, visibility  ) { //  tileSheet, animFrames, x, y, delay, visibility
        super();
        this.frameIndex = 0;
        this.type = activeType;
        this.clothesType = game.getItemOfCostume(clothesType);
        //console.log( this.clothesType );
        if ( activeType === 'walk' ) {
            //this.isAttack = false;
            this.tileSheet = costumes.walk[this.clothesType].tileSheet;
            this.animFrames = costumes.walk[this.clothesType].animFrames;
        }else{
            //this.isAttack = true;
            this.tileSheet = costumes.attack[this.clothesType].tileSheet;
            this.animFrames = costumes.attack[this.clothesType].animFrames;
        }

        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
        //this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.name = '';
        this.visibility = visibility;
    }
    update() {
        super.update();
    }
    render() {

        if ( this.visibility ) {

            let animationFrames = [];
            frameIndexCounter.delay = this.delay;

            for ( let i = 0; i < this.animFrames; i++ ) {
                animationFrames.push( i );
            }

            let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.animFrames ) * 64;
            let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.animFrames ) * 64;
            //console.log( typeof this.tileSheet );
            ctx.drawImage( this.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width, this.height );
            //console.log( sourceX, sourceY );
            if ( this.moveMode === 'run' ) {
                this.frameIndex = frameIndexCounter.frameIndex;
                //console.log( this.frameIndex );
                if ( this.frameIndex === animationFrames.length ) {
                    this.frameIndex = 0;
                    frameIndexCounter.frameIndex = 0;
                }
            }else{
                this.frameIndex = 0;
            }
        }
    }
}
class Weapon extends Player {
    constructor( costumes, activeType, weaponsType, x, y, visibility ) {
        super();
        this.frameIndex = 0;
        this.type = activeType;
        this.weaponsType = game.getItemOfCostume(weaponsType);
        //console.log( this.clothesType );
        this.tileSheet = costumes.attack[this.weaponsType].tileSheet;
        this.animFrames = costumes.attack[this.weaponsType].animFrames;

        //this.tileSheet = tileSheet;
        //this.animFrames = animFrames;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100// delay;
        //this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.visibility = visibility;
        //console.log( tileSheet );
        //console.log( tileSheet, animFrames, x, y, delay );
    }
    update() {
        super.update();
        if ( super.boundingStaticNpcCollide() && this.visibility  ) {
            Player.isAttack = true;
        }else{
            Player.isAttack = false;
        }

    }
    render() {
        if ( this.visibility ) {
            super.render();        
        }
    }
}
class ObjectOnMap extends Npc {
    constructor( costumes, type, x, y, visibility ) {
        super();
        this.frameIndex = 0;
        //this.type = activeType;
        this.type = game.getItemOfObject(type);
        //console.log( costumes, this.type );
        this.tileSheet = costumes[this.type].tileSheet;
        this.animFrames = costumes[this.type].animFrames;

        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        //this.dx = 0;
        //this.dy = 0;
        this.delay = 100// delay;
       // this.direction = 'down';
        this.sourceDY = 0; 
        this.moveMode = 'idle';
        this.visibility = visibility;
        //console.log( tileSheet );
        //console.log( this.tileSheet, this.animFrames, x, y );
    }

    render() {
        if ( this.visibility ) {
            super.render();  
        }
    }

    boundingPlayerCollide() {
        for ( let i = 0; i < game.player.length; i++ ) {
            if ( super.boundingBoxCollide( this, game.player[i] ) ) {
                return true;
            }else  return false;
        }
    }

    update() {
        if ( this.boundingPlayerCollide() ) {
            this.sourceDY = 64;
        }else{
            this.sourceDY = 0;
        }
    }
}
class StaticNpc extends Npc {
    constructor( costumes, type, x, y, visibility ) {
        super();
        this.frameIndex = 0;
        //this.type = activeType;
        this.type = game.getItemOfNpc(type);
        //console.log( costumes, this.type );
        this.tileSheet = costumes[this.type].tileSheet;
        this.animFrames = costumes[this.type].animFrames;

        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        //this.dx = 0;
        //this.dy = 0;
        this.delay = 100// delay;
       // this.direction = 'down';
        this.sourceDY = 0; 
        this.moveMode = 'idle';
        this.isAnimate = true;
        this.visibility = visibility;
        this.startTimeAnimate = 0;
        this.endTimeAnimate = 0;
        this.life = 100;
    }

    render() {
        if ( this.visibility ) {
            super.render();  
        }
    }
    
    boundingPlayerCollide() {
        for ( let i = 0; i < game.player.length; i++ ) {
            if ( super.boundingBoxCollide( this, game.player[i] ) ) { //** по-идее надо проверять только если класс оружие
                return true;
            }else  return false;
        }
    }

    update() {
        //если атакован, вращается 1 сек
        if ( this.boundingPlayerCollide() && Player.isAttack ) {
            this.moveMode = 'run';
            this.startTimeAnimate = new Date().getTime();
            this.life -= 0.1;
            //console.log( this.life);
        }else{
            this.endTimeAnimate = new Date().getTime();
            //console.log( this.life);

            if ( ( this.endTimeAnimate - this.startTimeAnimate ) >= 1000 ) {
                this.moveMode = 'idle';
            }
        }
    }
    
}
class NonStaticNpc extends Npc {

}
*/