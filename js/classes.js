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

        if ( isPlayer ) {
            //*get list of name costumes
            this.nameCostumes = this.costumes[ this.costumes.length - 1 ][ this.costumes[0] ]; //!!!! refactor
            //*create weapon
            this.weapons = weapons;
            this.weapon = new WEAPON( this.weapons, typeOfWeapon, this.x, this.y, true );
            //*create Clothes object
            for ( let i = 0; i < this.nameCostumes.length; i++ ) {
                this.tempCostume[i] = new CLOTHES( this.costumes, this.nameCostumes[i], this.x, this.y, true );
            }
            //*add all objects: costumes, weapon
            for ( let i = 0; i < this.tempCostume.length; i++ ) {
                this.currentCostume.push( this.tempCostume[i] )
            }
            this.currentCostume = this.bodyes.concat( this.currentCostume ) ;
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
                    //console.log( this.currentCostume );
                    //console.log( this.currentCostume[i].tilesToRenderAttack.tileSheet );
                    // console.log( this.tilesToRenderAttack );
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
            }
        }
    }

    //**to Attack
    toAttack() {
        console.log('human attack');
        this.isAttack = true;
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
                    }
                }
                
                //console.log( this.x, this.y );
                if ( !pressesKeys.has( 'Space' ) ) {
                    this.x = this.x + this.dx;
                    this.y = this.y + this.dy;
                    this.isAttack = false;
                }
            }else{
                this.moveMode = 'idle';
                this.isAnimate = false;
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
        //*get list of name costumes
        this.nameCostumes = this.costumes[ this.costumes.length - 1 ][ this.costumes[0] ];
        //*create weapon
        this.weapons = weapons;
        this.weapon = new WEAPON( this.weapons, typeOfWeapon, this.x, this.y, true );
        //*create Clothes object
        for ( let i = 0; i < this.nameCostumes.length; i++ ) {
            this.tempCostume[i] = new CLOTHES( this.costumes, this.nameCostumes[i], this.x, this.y, true );
        }
        //*add all objects: costumes, weapon
        for ( let i = 0; i < this.tempCostume.length; i++ ) {
            this.currentCostume.push( this.tempCostume[i] )
        }
        this.currentCostume = this.bodyes.concat( this.currentCostume ) ;
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
                //console.log( this.currentCostume );
                //console.log( this.currentCostume[i].tilesToRenderAttack.tileSheet );
                // console.log( this.tilesToRenderAttack );
            }
        }
        //console.log( this.tilesToRenderWalk );
       // console.log( this.tilesToRenderAttack );
    }


    //*render
    render() {
        super.render()
        /*
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
            }
        }*/
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













/*
class HUMAN extends HOMO_SAPIENS {
    constructor( bodyes, costumes, weapons, x, y, isPlayer, visible ) {
        super();
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
        this.weapons = weapons;
        this.tileObject = {};
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.tiles = [];
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

        //***load tiles
        if ( this.isPlayer ) { //* if human
            //load walk tiles
            this.tiles = this.bodyes.concat( this.costumes );
            //console.log( this.tiles.length );
            for ( let i = 0; i < this.tiles.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderWalk.push( this.tiles[i].human.walk );
                }else{
                    this.tilesToRenderWalk.push( this.tiles[i].walk );
                    //console.log( this.tiles[i].walk );
                    // console.log( this.tilesToRender );attack
                }
            }
            //load attack tiles
            this.tiles = this.bodyes.concat( this.costumes );
            //console.log( this.tiles.length );
            for ( let i = 0; i < this.tiles.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderAttack.push( this.tiles[i].human.attack );
                }else{
                    this.tilesToRenderAttack.push( this.tiles[i].attack );
                    //console.log( this.tiles[i].walk );
                    // console.log( this.tilesToRenderAttack );
                }
            }
        }else
            if ( !this.isPlayer ) {  //* if skeleton
            //load walk tiles
            this.tiles = this.bodyes.concat( this.costumes );
            //console.log( this.tiles.length );
            for ( let i = 0; i < this.tiles.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderWalk.push( this.tiles[i].skeleton.walk );
                }else{
                    this.tilesToRenderWalk.push( this.tiles[i].walk );
                    //console.log( this.tiles[i].walk );
                    // console.log( this.tilesToRender );attack
                }
            }
            //load attack tiles
            this.tiles = this.bodyes.concat( this.costumes );
            //console.log( this.tiles.length );
            for ( let i = 0; i < this.tiles.length; i++ ) {
                if ( i === 0 ) {
                    this.tilesToRenderAttack.push( this.tiles[i].skeleton.attack );
                }else{
                    this.tilesToRenderAttack.push( this.tiles[i].attack );
                    //console.log( this.tiles[i].walk );
                    // console.log( this.tilesToRenderAttack );
                }
            }

            }
        //console.log( this.body, this.costumes, this.x, this.y, this.isPlayer, this.visible );
    }
    //*render
    render() {
        if ( this.visible ) {
            if ( !this.isAttack ) {
                for ( this.tileObject of this.tilesToRenderWalk ) {
                    if ( typeof this.tileObject === 'object' ) {
                        super.render();
                    }
                }
            }else{
                for ( this.tileObject of this.tilesToRenderAttack ) {
                    if ( typeof this.tileObject === 'object' ) {
                        super.render();
                    }
                }
            }
        }
    }
    //**to Attack
    toAttack() {
        console.log('human attack');
        this.isAttack = true;
    }
    //*check keys
    update() {
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
                }
            }
            
            //console.log( this.x, this.y );
            if ( !pressesKeys.has( 'Space' ) ) {
                this.x = this.x + this.dx;
                this.y = this.y + this.dy;
                this.isAttack = false;
            }
        }else{
            this.moveMode = 'idle';
            this.isAnimate = false;
        }
    }
    
}
*/


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