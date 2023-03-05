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
        let dateTemp = new Date();	
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
        this.moveMode = 'idle'; //run
        this.isAnimate = false;
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
    //*draw
    draw() {
        //console.log( this.isAnimate );
        let animationFrames = [];
        frameIndexCounter.delay = this.delay;

        for ( let i = 0; i < this.tileObject.animFrames; i++ ) {
            animationFrames.push( i );
        }
        //console.log( this.tileObject );
        //console.log( animationFrames );
        let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.tileObject.animFrames ) * 64;
        let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.tileObject.animFrames ) * 64;
       // console.log( typeof this.tileSheet );
        ctx.drawImage( this.tileObject.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width , this.height );
        
        //console.log( sourceX, sourceY , this.x, this.y );
        
        if ( this.isAnimate ) { //this.moveMode === 'run'
            //console.log( this.moveMode );
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
    constructor(  x, y ) { 
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
        this.isAnimate = false;
        //this.isAttack = false;
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
        //this.isAttack = true;
        //console.log('ATTACK');
    }
    //*render
    render() {
        super.draw();
    }
    //*check keys
    update() {
        super.update();
    }
}

class HUMAN extends HOMO_SAPIENS {
    constructor( bodyes, costumes, weapons, typeOfWeapon, x, y, isPlayer, visible ) {
        super();

        //console.log( costumes );

        //*coords
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        //*tiles
        this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.bodyes = [ bodyes ];
        this.costumes = costumes;

       // console.log( this.costumes );

        this.tileObject = {};
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.tempCostume = [];
        this.currentCostume = [];
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAnimate = false;
        //*name
        this.name = '';
        //*booles
        this.isAttack = false;
        this.isCheckForAttack = false;
        this.isPlayer = isPlayer;
        this.visible = visible;
        //*life
        this.life = 100;

        //*if it is player
        if ( isPlayer ) {

            this.lifeBar = new LIFEBAR( this.x , this.y );
            //console.log( this.lifeBar );

            //*create weapon
            this.weapons = weapons;
            this.weapon = new WEAPON( this.weapons, typeOfWeapon, this.x, this.y, true );
            

            if ( this.costumes.length > 1 ) {

                //*get list of name costumes
                this.nameCostumes = this.costumes[ this.costumes.length - 1 ][ this.costumes[0] ]; 
                //*create Clothes object
                for ( let i = 0; i < this.nameCostumes.length; i++ ) {
                    this.tempCostume[i] = new CLOTHES( this.costumes, this.nameCostumes[i], this.x, this.y, true );
                }
                //*add all objects: costumes, weapon
                for ( let i = 0; i < this.tempCostume.length; i++ ) {
                    this.currentCostume.push( this.tempCostume[i] )
                }
                this.currentCostume = this.bodyes.concat( this.currentCostume ) ;
            }else{
                this.currentCostume = this.bodyes;
            }

            this.currentCostume.push( this.weapon );
            //console.log( this.currentCostume );

            //*****************load tiles
            //*load walk tiles
            for ( let i = 0; i < this.currentCostume.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderWalk.push( this.currentCostume[i].human.walk );
                    this.currentCostume[i].human.walk.visible = this.visible;
                }else{
                    this.tilesToRenderWalk.push( this.currentCostume[i].tilesToRenderWalk );
                    //console.log( this.currentCostume[i] );
                }
            }
            //*load attack tiles
            for ( let i = 0; i < this.currentCostume.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderAttack.push( this.currentCostume[i].human.attack );
                    this.currentCostume[i].human.attack.visible = this.visible;
                }else{
                    this.tilesToRenderAttack.push( this.currentCostume[i].tilesToRenderAttack );
                }
            }
        //console.log( this.tilesToRenderWalk );
        // console.log( this.tilesToRenderAttack );
        }
    }   


    //*render
    render() {
        if ( this.visible ) {
            if ( !this.isAttack ) {
                for ( this.tileObject of this.tilesToRenderWalk ) {
                    //console.log( this.tileObject.tileSheet  );
                    if ( typeof this.tileObject === 'object' && this.tileObject.hasOwnProperty( 'tileSheet' ) && this.tileObject.visible ) {
                        super.draw();
                    }
                }
            }else{
                for ( this.tileObject of this.tilesToRenderAttack ) {
                    if ( typeof this.tileObject === 'object' && this.tileObject.visible ) {
                        super.draw();
                    }
                }
                this.renderLifeBar();
            }
        }
    }

    //*render life Bar
    renderLifeBar() {
        this.lifeBar.render();
    }

    //**to Attack
    toAttack() {
        console.log('human attack');
        this.isAttack = true;
    }

    setNewWeapon() {
        console.log( this.tilesToRenderWalk );

        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( this.currentCostume[i] instanceof WEAPON ) {
               // console.log( item );
                this.currentCostume[i] = {}
                //this.tilesToRenderWalk[5] = {}
            }
        }
        console.log( this.tilesToRenderWalk );
        console.log( this.currentCostume );
    }

    //*check keys
    update() {
        if ( this.isPlayer ) {

            if ( pressesKeys.size > 0 && this.isPlayer ) {
            // console.log( pressesKeys ); 
                for ( const code of pressesKeys.values() ) {
                    switch ( code ) {
                        case 'ArrowUp':
                            this.sourceDY = 0;
                            this.dx = 0;
                            this.dy = -1;
                            this.moveMode = 'run';
                            this.isAnimate = true;
                            break;
                        case 'ArrowLeft':
                            this.sourceDY = 64;
                            this.dx = -1;
                            this.dy = 0;
                            this.moveMode = 'run';
                            this.isAnimate = true;
                            break;
                        case 'ArrowDown':
                            this.sourceDY = 128;
                            this.dx = 0;
                            this.dy = 1;
                            this.moveMode = 'run';
                            this.isAnimate = true;
                            break;
                        case 'ArrowRight':
                            this.sourceDY = 198;
                            this.dx = 1;
                            this.dy = 0;
                            this.moveMode = 'run';
                            this.isAnimate = true;
                            break;
                        case 'Space':
                            this.toAttack();
                            this.moveMode = 'run';
                            this.isAnimate = true;
                            break;
                        case 'KeyE':
                            console.log('key E');
                            this.setNewWeapon()
                            break;
                    }
                }
                
                //console.log( this.x, this.y );
                if ( !pressesKeys.has( 'Space' ) && !pressesKeys.has( 'KeyE' ) ) {
                    this.x = this.x + this.dx;
                    this.y = this.y + this.dy;
                    this.lifeBar.x = this.x + this.dx;
                    this.lifeBar.y = this.y + this.dy;

                    this.isAttack = false;
                    //console.log( pressesKeys );
                    //console.log( this.isAttack );
                }
            }else{
                this.moveMode = 'idle';
                this.isAnimate = false;
                this.isAttack = false
                //console.log( this.isAttack );
                //console.log( pressesKeys );
            }
        }
    }

}

class CLOTHES {
    constructor( costumes, typeOfClothes, x, y, visible ) {
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100;
        this.sourceDY = 128; //128
        this.moveMode = 'idle'; //run
        this.isAnimate = false;
        this.visible = visible;
        this.indexClothes = this.getItemOfCostume( typeOfClothes );
        this.tiles = costumes;
        this.type = typeOfClothes;
        this.tileObject = {};
        //*load tile
        //this.tileObject = this.costumes[this.indexClothes];
        this.tilesToRenderWalk = {};
        this.tilesToRenderAttack = {};

        //console.log( this.tiles );

        for ( let i = 0; i < this.tiles.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderWalk = this.tiles[i].walk;
                this.tilesToRenderWalk.visible = this.visible;
                //console.log( this.tilesToRenderWalk );
            }
        }
        //load attack tiles
        for ( let i = 0; i < this.tiles.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderAttack = this.tiles[i].attack;
                this.tilesToRenderAttack.visible = this.visible;
                //console.log( this.tilesToRenderWalk );
            }
        }

        //console.log( this.tileObject );
    }
    //*get index of clothes
    getItemOfCostume( type ) {
        switch ( type ) {
            case 'head':
                return 1;
            case 'feet':
                return 2;
            case 'legs':
                return 3;
            case 'torso':
                return 4;
            case 'bracers':
                return 5;
            case 'shoulders':
                return 6;
            case 'belt':
                return 7;
            case 'hands':
                return 8;
        }
    }
    //*draw clothes
    draw() {
        //console.log( this.isAnimate );
        let animationFrames = [];
        frameIndexCounter.delay = this.delay;

        for ( let i = 0; i < this.tileObject.animFrames; i++ ) {
            animationFrames.push( i );
        }
        console.log( this.tileObject );
        //console.log( animationFrames );
        let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.tileObject.animFrames ) * 64;
        let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.tileObject.animFrames ) * 64;
        //console.log( typeof this.tileSheet );
        ctx.drawImage( this.tileObject.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width , this.height );
        
        //console.log( sourceX, sourceY );
        
        if ( this.isAnimate ) { //this.moveMode === 'run'
            //console.log( this.moveMode );
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

    //*render
    render() {
        if ( this.visible ) {
            if ( !this.isAttack ) {
                //for ( this.tileObject of this.tilesToRenderWalk ) {
                    if ( typeof this.tileObject === 'object' ) {
                        this.draw();
                    }
               // }
            }else{
              // for ( this.tileObject of this.tilesToRenderAttack ) {
                    if ( typeof this.tileObject === 'object' ) {
                        this.draw();
                    }
               // }
            }
        }

    }
    //*check keys
    update() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }

}

class WEAPON {
    constructor( weapons, typeOfWeapon, x, y, visible ) {
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100;
        this.sourceDY = 128; //128
        this.moveMode = 'idle'; //run
        this.isAnimate = false;
        this.visible = visible;
        this.indexWeapon = this.getItemOfWeapon( typeOfWeapon );
        this.tiles = weapons;
       //console.log( this.indexWeapon, this.tiles );
        this.type = typeOfWeapon;
        this.tileObject = {};
        //*load tile
        //this.tileObject = this.costumes[this.indexClothes];
        this.tilesToRenderWalk = {};
        this.tilesToRenderAttack = {};
        //*life
        this.life = 100;
        //console.log( this.tilesToRenderWalk );
        //console.log( this.tilesToRenderAttack );
        //console.log( this.tiles );
        //console.log(  this.tiles[1].walk  );

        for ( let i = 0; i < this.tiles.length; i++ ) {
            if ( i === this.indexWeapon ) {
                this.tilesToRenderWalk = this.tiles[i].walk;
                this.tilesToRenderWalk.visible = this.visible;
                //console.log( this.tilesToRenderWalk );
            }
        }
        //load attack tiles
        for ( let i = 0; i < this.tiles.length; i++ ) {
            if ( i === this.indexWeapon ) {
                this.tilesToRenderAttack = this.tiles[i].attack;
                this.tilesToRenderAttack.visible = this.visible;
                //console.log( this.tilesToRenderAttack );
            }
        }

        //console.log( this.tileObject );
    }
    //*get index of clothes
    getItemOfWeapon( type ) {
        switch ( type ) {
            case 'dagger':
                return 1;
            case 'shield':
                return 2;
            case 'quiver':
                return 3;
            case 'spear':
                return 4;
            case 'bow':
                return 5;
        }
    }
    //*draw clothes
    draw() {
        //console.log( this.isAnimate );
        let animationFrames = [];
        frameIndexCounter.delay = this.delay;

        for ( let i = 0; i < this.tileObject.animFrames; i++ ) {
            animationFrames.push( i );
        }
        console.log( this.tileObject );
        //console.log( animationFrames );
        let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.tileObject.animFrames ) * 64;
        let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.tileObject.animFrames ) * 64;
        //console.log( typeof this.tileSheet );
        ctx.drawImage( this.tileObject.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width , this.height );
        
        //console.log( sourceX, sourceY );
        
        if ( this.isAnimate ) { //this.moveMode === 'run'
            //console.log( this.moveMode );
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

    //*render
    render() {
        if ( this.visible ) {
            if ( !this.isAttack ) {
                //for ( this.tileObject of this.tilesToRenderWalk ) {
                    if ( typeof this.tileObject === 'object' ) {
                        this.draw();
                    }
               // }
            }else{
              // for ( this.tileObject of this.tilesToRenderAttack ) {
                    if ( typeof this.tileObject === 'object' ) {
                        this.draw();
                    }
               // }
            }
        }

    }
    //*check keys
    update() {
        this.x = this.x + this.dx;
        this.y = this.y + this.dy;
    }

}

class SKELETON extends HUMAN {
    constructor( bodyes, costumes, weapons, typeOfWeapon, x, y, isPlayer, visible ) {

        //console.log( bodyes, costumes, weapons, typeOfWeapon, x, y, isPlayer, visible  );

        super();

        if ( isPlayer ) {
            console.log('incorrect var: isPlayer');
        }else{
            this.name = 'Skeleton';
        }

        //*coords
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        //*tiles
        this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.bodyes = [ bodyes ];
        this.costumes = costumes;
        this.tileObject = {};
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.tempCostume = [];
        this.currentCostume = [];
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAnimate = false;
        //*name
        this.name = '';
        //*booles
        this.isAttack = false;
        this.isCheckForAttack = false;
        this.isPlayer = isPlayer;
        this.visible = visible;
        //*life
        this.life = 100;
        //*create weapon
        this.weapons = weapons;
        this.weapon = new WEAPON( this.weapons, typeOfWeapon, this.x, this.y, true );

        if ( this.costumes.length > 1 ) {

            //*get list of name costumes
            this.nameCostumes = this.costumes[ this.costumes.length - 1 ][ this.costumes[0] ];

            //*create Clothes object
            for ( let i = 0; i < this.nameCostumes.length; i++ ) {
                this.tempCostume[i] = new CLOTHES( this.costumes, this.nameCostumes[i], this.x, this.y, true );
            }
            //*add all objects: costumes, weapon
            for ( let i = 0; i < this.tempCostume.length; i++ ) {
                this.currentCostume.push( this.tempCostume[i] )
            }
            this.currentCostume = this.bodyes.concat( this.currentCostume );
        }else{
            this.currentCostume = this.bodyes;
        }

        this.currentCostume.push( this.weapon );
        //console.log( this.currentCostume );

        //*****************load tiles
        //*load walk tiles
        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( i === 0 ) {
                this.tilesToRenderWalk.push( this.currentCostume[i].skeleton.walk );
                this.currentCostume[i].skeleton.walk.visible = this.visible;
            }else{
                this.tilesToRenderWalk.push( this.currentCostume[i].tilesToRenderWalk );
                //console.log( this.currentCostume[i] );
            }
        }
        //*load attack tiles
        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( i === 0 ) {
                this.tilesToRenderAttack.push( this.currentCostume[i].skeleton.attack );
                this.currentCostume[i].skeleton.attack.visible = this.visible;
            }else{
                this.tilesToRenderAttack.push( this.currentCostume[i].tilesToRenderAttack );
            }
        }
       //console.log( this.tilesToRenderWalk );
       // console.log( this.tilesToRenderAttack );
    }


    //*render
    render() {
        super.render();
    }

    //**to Attack
    toAttack() {
        console.log('skeleton attack');
        this.isAttack = true;
    }

    //*check keys
    update() {

    }

}

class LIFEBAR {
    x = 0;
    y = 0;
    #posX = 16;

    #max = 100;
    #min = 0;
    #width = 30;
    #height = 5;
    currentLife = 100;

    #colorFull = 'green';
    #colorEmpty = 'red';

    constructor( x, y ) {
        this.x = x;
        this.y = y;

        //console.log( this.x, this.y );
    }

    draw() {
        ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.strokeRect( this.x + this.#posX, this.y, this.#width, this.#height );
            ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
            this.setFillStyle( 'green' );
            ctx.fillRect( this.x + this.#posX, this.y, this.#width*this.currentLife/this.#max, this.#height );
            ctx.closePath();
        ctx.fill();

        ctx.beginPath();
            this.setFillStyle( 'red' );
            ctx.fillRect( this.x + this.#posX + this.#width*this.currentLife/100, this.y, this.#width*( this.#max - this.currentLife )/this.#max, this.#height );
            ctx.closePath();
        ctx.fill();
    }

    setFillStyle( color ) {
        if ( color === 'green' ) {
            ctx.fillStyle = this.#colorFull;
        }else if ( color === 'red' ) {
            ctx.fillStyle = this.#colorEmpty;
        }
    }
    render() {
        this.draw();
    }
}

class STATIC extends NONSTATIC {
    constructor( /* x, y*/ ) { 
        super();
        /*this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAnimate = false;*/
    }

    render() {
        super.draw();
    }
}

class PUT_ON extends STATIC {
    constructor( costumes, x, y, visible ) {
        super();
        //*coords
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        //*tiles
        //this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.costumes = costumes;

        console.log( this.costumes );

        this.tileObject = {};
        //this.tilesToRenderWalk = [];
        //this.tilesToRenderAttack = [];
        //this.tempCostume = [];
        //this.currentCostume = [];
        //this.sourceDY = 128; 
        //this.moveMode = 'idle';
        this.isAnimate = false;
        //*booles
        this.visible = visible;
        //*life
        this.life = 100;

        this.tileObject = costumes.idle;
        console.log( this.tileObject );
    }

    render() {
       super.render();
    }

    //*check keys
    update() {

        if ( pressesKeys.size > 0 ) {
         //console.log( pressesKeys ); 
            for ( const code of pressesKeys.values() ) {
                switch ( code ) {
                    case 'KeyE':
                        console.log('key E');
                        break;
                }
            }
        }
    }
}

