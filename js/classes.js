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
    constructor( tilesOfBody, tilesOfCostume, typeOfCostume, coordsOfSpawn, isPlayer, visible, isOnlyBody ) {
        super();

        console.log( tilesOfCostume );
        //console.log( tilesOfBody );

        //*coords
        this.x = coordsOfSpawn.x;
        this.y = coordsOfSpawn.y;
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        //*tiles
        this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.tilesOfBody = [ tilesOfBody ];
        this.tilesOfCostume = tilesOfCostume;
        this.typeOfCostume = typeOfCostume;
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
        this.isOnlyBody = isOnlyBody;
        //*life
        this.life = 100;

        //*type
        if ( isPlayer ) {
            this.typeOfBody = 'human';
            //*create collision body 
            this.createCollisionBody();
            //*create lifeBar
            this.createLifeBar();
            //*create weapon and costumes
            this.getCurrentCostume( this.tilesOfCostume, this.typeOfCostume );
            console.log('set type of body = human');
        }else{
           // console.log('incorrect var: isPlayer');
        }
    }   

    createCollisionBody() {
        this.body = new COLLISION( this.x+32, this.y+37, this.width-32, this.height-15, { isStatic: true } );
        //console.log( this.body );
    }

    createLifeBar() {
        this.lifeBar = new LIFEBAR( this.x , this.y );
        // console.log( this.lifeBar );
    }

    getCurrentCostume( tilesOfCostume, typeOfCostume ) {
        //console.log( costumes[ typeOfCostume ] );
        //*set defaults
        this.currentCostume = [];
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.currentWeapons = [];
        //console.log( costumes );
        //console.log(typeOfCostume);
        //*
        if ( !this.isOnlyBody ) {
            //*list of costumes
            const namesCostumes = {
                swordman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', ['dagger'] ],
                spearman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', ['shield', 'spear'] ]
            };
            //*get list of name costumes
            let nameCostume = namesCostumes[ typeOfCostume ];
            console.log( nameCostume );
            //*get start costume
            let startCostume = [];
            for ( const item of nameCostume ) {
                if ( typeof item === 'string' ) {
                    console.log(item);
                    let tempCostume = tilesOfCostume[ item ];
                    startCostume.push( tempCostume )
                }
            }
            console.log( startCostume );
            //*get weapons array
            let nameWeapons = nameCostume[ nameCostume.length - 1 ];
            //console.log(nameWeapons);
            //*get weapon tile
            for ( const weapon of nameWeapons ) {
                if ( typeof weapon === 'string' ) {
                    //console.log(weapon);
                    let tempWeapon = tilesOfCostume[ weapon ];
                    //console.log( tempWeapon );
                    //*create current weapon
                    let currentWeapon = new WEAPON( tempWeapon, weapon, this.x, this.y, true );
                    this.currentWeapons.push( currentWeapon );
                }
            }
            console.log( this.currentWeapons );
           // let tempWeaponTile = startCostume[ startCostume.length - 2 ];
            //*create current weapon
           // this.currentWeapon = new WEAPON( tempWeaponTile, tempWeaponTile.titleTiles, this.x, this.y, true );
            //console.log( this.currentWeapon );
            //*get list of name costumes
            //let nameCostumes = startCostume[ startCostume.length - 1 ][ typeOfCostume ];
            //let nameCostumes = namesCostumes[ typeOfCostume ];

            //console.log( nameCostumes );
            //*create Clothes object
            for ( let i = 0; i < nameCostume.length-1; i++ ) {
                this.tempCostume[i] = new CLOTHES( startCostume, typeOfCostume, nameCostume[i], this.x, this.y, true );
            }
            //*add all objects: costumes, weapon
            for ( let i = 0; i < this.tempCostume.length; i++ ) {
                this.currentCostume.push( this.tempCostume[i] )
            }
            this.currentCostume = this.tilesOfBody.concat( this.currentCostume ) ;
        }else{
            this.currentCostume = this.tilesOfBody; 
        }

        this.currentCostume = this.currentCostume.concat( this.currentWeapons ) ;
        //this.currentCostume.push( this.currentWeapons );
        console.log( this.currentCostume );

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
        //*get type
        let tempTypeOfCostume = '';
        switch (typeOfCostume) {
            case 'swordman':
                tempTypeOfCostume = 'slash';
                break;
            case 'spearman':
                tempTypeOfCostume = 'thrust';
                break;
        }
        //*load attack tiles
        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( i === 0 ) {
                this.tilesToRenderAttack.push( this.currentCostume[i].human.attack[tempTypeOfCostume] );
                this.currentCostume[i].human.attack[tempTypeOfCostume].visible = this.visible;
            }else{
                this.tilesToRenderAttack.push( this.currentCostume[i].tilesToRenderAttack );
            }
        }
        console.log( this.tilesToRenderWalk );
        console.log( this.tilesToRenderAttack );
        console.log('current costume is loading');
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
            this.renderCollision();
        }
    }

    //*render collision body
    renderCollision() {
        this.body.draw();
    }

    //*render life Bar
    renderLifeBar() {
        this.lifeBar.render();
    }

    //**to Attack
    toAttack() {
        if ( !this.isOnlyBody ) {
            console.log('human attack');
            this.isAttack = true;
            this.moveMode = 'run';
            this.isAnimate = true;
        }
    }

    setNewWeapon( obj ) {
        //console.log( obj );
        //console.log( obj.store, obj.type );
        this.getCurrentCostume( obj.store, obj.type );
        console.log('set new Weapon');
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
                            //this.moveMode = 'run';
                            //this.isAnimate = true;
                            break;
                        case 'KeyE': //TODO
                            console.log('key E');
                            //this.setNewWeapon();
                            break;
                    }
                }
                
                //console.log( this.x, this.y );
                if ( !pressesKeys.has( 'Space' ) && !pressesKeys.has( 'KeyE' ) ) {
                    this.x = this.x + this.dx;
                    this.y = this.y + this.dy;
                    this.lifeBar.x = this.x + this.dx;
                    this.lifeBar.y = this.y + this.dy;
                    Body.setPosition( this.body.hull, { x: this.x+32, y: this.y+37 } );
                    this.isAttack = false;
                    //console.log( pressesKeys );
                    //console.log( this.isAttack );
                }
            }else{
                this.moveMode = 'idle';
                this.isAnimate = false;
                this.isAttack = false;
                //console.log( this.isAttack );
                //console.log( pressesKeys );
            }
        }
    }

}

class CLOTHES {
    constructor( tilesOfCostume, typeOfCostume, typeOfClothes, x, y, visible ) {
        console.log( tilesOfCostume, typeOfClothes );
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
        this.tilesOfCostume = tilesOfCostume;
        this.type = typeOfClothes;
        this.typeOfCostume = typeOfCostume;
        this.tileObject = {};
        //*load tile
        //this.tileObject = this.costumes[this.indexClothes];
        this.tilesToRenderWalk = {};
        this.tilesToRenderAttack = {};

        //console.log( this.tiles );
        //*get type
        let tempTypeOfCostume = '';
        switch (this.typeOfCostume) {
            case 'swordman':
                tempTypeOfCostume = 'slash';
                break;
            case 'spearman':
                tempTypeOfCostume = 'thrust';
                break;
        }
        console.log( tempTypeOfCostume );

        for ( let i = 0; i < this.tilesOfCostume.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderWalk = this.tilesOfCostume[i].walk;
                this.tilesToRenderWalk.visible = this.visible;
                console.log( this.tilesToRenderWalk );
            }
        }
        //load attack tiles
        for ( let i = 0; i < this.tilesOfCostume.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderAttack = this.tilesOfCostume[i][tempTypeOfCostume];
                this.tilesToRenderAttack.visible = this.visible;
                console.log( this.tilesToRenderAttack );
            }
        }

        //console.log( this.tileObject );
    }
    
    //*get index of clothes
    getItemOfCostume( type ) {
        switch ( type ) {
            case 'head':
                return 0;
            case 'feet':
                return 1;
            case 'legs':
                return 2;
            case 'torso':
                return 3;
            case 'bracers':
                return 4;
            case 'shoulders':
                return 5;
            case 'belt':
                return 6;
            case 'hands':
                return 7;
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
    constructor( weaponTile, typeOfWeapon, x, y, visible ) {
        //console.log( weaponTile );
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
        //this.indexWeapon = this.getItemOfWeapon( typeOfWeapon );
        //this.tiles = weaponTile;
        this.tile = weaponTile;

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
        //*load attack tiles
        this.tilesToRenderWalk = this.tile.walk;
        this.tilesToRenderWalk.visible = this.visible;
        this.tilesToRenderAttack = this.tile.attack;
        this.tilesToRenderAttack.visible = this.visible;

        //console.log( this.tileObject );
    }
    /*
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
    }*/
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
    constructor( bodyes, costumes, typeOfCostume, x, y, isPlayer, visible ) {

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
        this.tilesOfBody = [ bodyes ];
        this.tilesOfCostume = costumes;
        this.typeOfCostume = typeOfCostume;
        this.tileObject = {};
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.tempCostume = [];
        this.currentCostume = [];
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAnimate = false;
        //*booles
        this.isAttack = false;
        this.isCheckForAttack = false;
        this.isPlayer = isPlayer;
        this.visible = visible;
        //*life
        this.life = 100;
        //*type
        if ( !isPlayer ) {
            this.typeOfBody = 'skeleton';
            //*create collision body
            this.createCollisionBody();
            //*create lifeBar
            this.createLifeBar();
            //*create costumes and weapon
            this.getCurrentCostume();
            console.log('set type of body = skeleton');
        }
    }

    createCollisionBody() {
        super.createCollisionBody();
        //console.log( this.body );
    }

    createLifeBar() {
        super.createLifeBar();
        // console.log( this.lifeBar );
    }

    getCurrentCostume() {
        super.getCurrentCostume( this.tilesOfCostume, this.typeOfCostume );
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
    constructor( costumes, store, typeOfCostume, x, y, visible ) {
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

       // console.log( this.costumes );

        this.tileObject = {};
        //this.tilesToRenderWalk = [];
        //this.tilesToRenderAttack = [];
        //this.tempCostume = [];
        //this.currentCostume = [];
        //this.sourceDY = 128; 
        //this.moveMode = 'idle';
        this.isAnimate = false;
        //*create collision body 
        this.body = new COLLISION( this.x+this.width/2, this.y+this.height/2, this.width, this.height, { isStatic: true } );
       // console.log( this.body );
        //*booles
        this.visible = visible;
        //this.isDelete = false;
        //*life
        this.life = 100;

        this.tileObject = costumes.idle;
        //console.log( this.tileObject );
        //*store
        this.store = store;
        //*type
        this.type = typeOfCostume;
        //console.log( store );
    }
    /*
    //*make deleted
    deleteObj() {
        if ( this.isDelete ) {
            this.visible = false;
            delete this.body;
            console.log( this.body);
        }
    }*/

    //*render collision body
    renderCollision() {
        this.body.draw();
    }

    render() {
        if ( this.visible ) {
            super.render();
            this.renderCollision();
        }
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

class COLLISION {
    constructor( x, y, width, height ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hull = Bodies.rectangle( this.x, this.y, this.width, this.height, { isStatic: true } );
        //console.log( this.hull );
    }

    draw() {

        let vertices = this.hull.vertices;
        ctx.beginPath();
        ctx.moveTo(vertices[0].x, vertices[0].y);

        for (var j = 1; j < vertices.length; j += 1) {
            ctx.lineTo(vertices[j].x, vertices[j].y);
        }

        ctx.lineTo(vertices[0].x, vertices[0].y);

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }

    render() {
        this.draw();
    }
}