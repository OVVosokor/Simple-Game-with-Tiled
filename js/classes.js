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
        this.isHurt = false;
        this.frameIndexCounter = {} //new FrameRateCounter(100);
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
        //console.log( this, this.isHurt, this.frameIndex );
        let animationFrames = [];
        this.frameIndexCounter.delay = this.delay;

        for ( let i = 0; i < this.tileObject.animFrames; i++ ) {
            animationFrames.push( i );
        }
        //console.log( this.tileObject );
        //console.log( animationFrames );
        let sourceX = Math.floor( animationFrames[ this.frameIndex ] % this.tileObject.animFrames ) * 64;
        let sourceY = Math.floor( animationFrames[ this.frameIndex ] / this.tileObject.animFrames ) * 64;
       // console.log( typeof this.tileSheet );
        ctx.drawImage( this.tileObject.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, this.width , this.height );
        //console.log( this.sourceDY );
        //console.log( sourceX, sourceY , this.x, this.y );
        
        if ( this.isAnimate ) { 
            this.frameIndex = this.frameIndexCounter.frameIndex;
            //console.log( this.frameIndex );
            //console.log( frameIndexCounter );
            if ( this.frameIndex === animationFrames.length ) {
                if ( this.isHurt ) {
                    this.frameIndex = 5;
                    this.frameIndexCounter.frameIndex = 5;
                }else{
                    this.frameIndex = 0;
                    this.frameIndexCounter.frameIndex = 0;
                }
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

        //console.log( tilesOfCostume );
        //console.log( tilesOfBody );
        //console.log( typeOfCostume );
        //*coords
        this.width = 64;
        this.height = 64;
        this.dx = 0;
        this.dy = 0;
        this.direction = '';
        //*tiles
        this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.tilesOfBody = [ tilesOfBody ];
        this.tilesOfCostume = tilesOfCostume;
        this.typeOfCostume = typeOfCostume;
        this.tileObject = {};
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.tilesToRenderHurt = [];
        this.tempCostume = [];
        this.currentCostume = [];
        this.sourceDY = 128; 
        //*name
        this.name = '';
        //*booles
        this.isAnimate = false;
        this.isAttack = false;
        this.isNotAttack = true; //!! necessary?
        this.isPlayer = isPlayer;
        this.visible = visible;
        this.isOnlyBody = isOnlyBody;
        this.isHurt = false;
        //*life
        this.life = {
            curLife: 1000,
            maxLife: 1000
        };
        //*damage
        this.damage = {
            power: {},
            width: 60,
            height: 60,
            area: {}
        }
        //*attacked actor
        this.attacked = [];
        this.frameIndexCounter = {};

        //*type
        if ( isPlayer && typeOfCostume !== 'hurt' ) {
            this.frameIndexCounter = new FrameRateCounter(100);

            //*set coords
            this.x = coordsOfSpawn.x;
            this.y = coordsOfSpawn.y;
            //*set type of body
            this.typeOfBody = 'human';
            //*create collision body 
            this.createCollisionBody();
            //*create damage area
            this.createDamageArea();
            //*create lifeBar
            this.createLifeBar();
            //*create weapon and costumes
            this.getCurrentCostume( this.tilesOfCostume, this.typeOfCostume, this.typeOfBody );
            console.log('set type of body = human');
        }else{
            //console.log('incorrect var: isPlayer / typeOfCostume');
        }
    } 

    createCollisionBody() {
        this.body = new COLLISION( this.x+32, this.y+37, this.width-32, this.height-15/*, { isStatic: true }*/ );
        //console.log( this.body );
    }

    createLifeBar() {
        this.lifeBar = new LIFEBAR( this.x , this.y, this.life.curLife );
        // console.log( this.lifeBar );
    }

    createDamageArea() {
        this.damage.area = new DAMAGE_AREA( this.x+32 , this.y+32, this.damage.width, this.damage.height/*, { isStatic: true }*/ /* this.damage.radius*/ );
    }

    getCurrentCostume( tilesOfCostume, typeOfCostume, typeOfBody ) {
        //console.log( tilesOfCostume );
        //console.log( typeOfCostume );
        //console.log( typeOfBody );

        //*set defaults
        this.currentCostume = [];
        this.tilesToRenderWalk = [];
        this.tilesToRenderAttack = [];
        this.currentWeapons = [];

        //*
        if ( !this.isOnlyBody ) {
            //*list of costumes
            const namesCostumes = {
                swordman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', ['dagger'] ],
                spearman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', ['spear', 'shield']],
                hurt: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', [] ]
            
            };
            //*get list of name costumes
            let nameCostume = namesCostumes[ typeOfCostume ];
            /*
            //*set damage power
            switch (typeOfCostume) {
                case 'swordman':
                    this.damage.power = 0.1;
                    break;
                case 'spearman':
                    this.damage.power = 0.2;
                    break;
            }*/
            //console.log( nameCostume );
            //*get start costume
            let startCostume = [];
            for ( const item of nameCostume ) {
                if ( typeof item === 'string' ) {
                    //console.log(item);
                    let tempCostume = tilesOfCostume[ item ];
                    startCostume.push( tempCostume );
                }
            }
            //console.log( startCostume );
            //*get weapons array
            let nameWeapons = nameCostume[ nameCostume.length - 1 ];
            //console.log(nameWeapons);
            //*get weapon tile
            for ( const weapon of nameWeapons ) {
                //console.log(weapon);
                let tempWeapon = tilesOfCostume[ weapon ];
                //console.log( tempWeapon );
                //*create current weapon
                let currentWeapon = new WEAPON( tempWeapon, weapon, this.x, this.y, true );
                this.currentWeapons.push( currentWeapon );
                //*set damage power
                if ( currentWeapon.hasOwnProperty( 'power' ) ) {
                    this.damage.power = currentWeapon.power;
                }
            }
            //console.log( this.currentWeapons );

            //*create Clothes object
            for ( let i = 0; i < nameCostume.length-1; i++ ) {
                this.tempCostume[i] = new CLOTHES( startCostume, typeOfCostume, nameCostume[i], this.x, this.y, true );
            }
            //*add all objects: costumes, weapon
            for ( let i = 0; i < this.tempCostume.length; i++ ) {
                this.currentCostume.push( this.tempCostume[i] );
            }
            this.currentCostume = this.tilesOfBody.concat( this.currentCostume ) ;
        }else{
            this.currentCostume = this.tilesOfBody; 
        }

        this.currentCostume = this.currentCostume.concat( this.currentWeapons ) ;
        //console.log( this.currentCostume );

        //*****************load tiles
        //*load walk tiles
        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( i === 0 ) {
                this.tilesToRenderWalk.push( this.currentCostume[i][typeOfBody].walk ); //.human.
                this.currentCostume[i][typeOfBody].walk.visible = this.visible;
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
                this.tilesToRenderAttack.push( this.currentCostume[i][typeOfBody].attack[tempTypeOfCostume] );
                this.currentCostume[i][typeOfBody].attack[tempTypeOfCostume].visible = this.visible;
            }else{
                this.tilesToRenderAttack.push( this.currentCostume[i].tilesToRenderAttack );
            }
        }
        //*load hurt tiles
        for ( let i = 0; i < this.currentCostume.length; i++ ) {
            if ( i === 0 ) {
                this.tilesToRenderHurt.push( this.currentCostume[i][typeOfBody].hurt );
                this.currentCostume[i][typeOfBody].hurt.visible = this.visible;
                //this.currentCostume[i][typeOfBody].hurt.title = typeOfCostume;

            }else{
                this.tilesToRenderHurt.push( this.currentCostume[i].tilesToRenderHurt );
            }
        }
        //console.log( this.tilesToRenderWalk );
        //console.log( this.tilesToRenderAttack );
        //console.log( this.tilesToRenderHurt );
        console.log('current costume is loading');
    }

    //*render
    render() {
        if ( this.visible ) {
            //*if isHurt = false
            if ( !this.isHurt ) { 
                //*if isAttack = false
                if ( !this.isAttack ) {
                    for ( this.tileObject of this.tilesToRenderWalk ) {
                        if ( typeof this.tileObject === 'object' && this.tileObject.hasOwnProperty( 'tileSheet' ) && this.tileObject.visible ) {
                            super.draw();
                        }
                    }
                }else{
                    //*if isAttack = true
                    for ( this.tileObject of this.tilesToRenderAttack ) {
                        if ( typeof this.tileObject === 'object' && this.tileObject.visible ) {
                            super.draw();
                        }
                    }
                }
            }else{
                //*if isHurt = true
                for ( this.tileObject of this.tilesToRenderHurt ) {
                    if ( typeof this.tileObject === 'object' && this.tileObject.visible ) {
                        super.draw();
                    }
                }
            }
            this.renderLifeBar();

            this.renderCollision();

            this.renderDamageArea();
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

    //*render damage area
    renderDamageArea() {
        this.damage.area.render();
    }

    //**to Attack
    toAttack() {
        if ( !this.isOnlyBody ) {
            //console.log('human attack');

            this.isAttack = true;
            this.isNotAttack = false;
            this.isAnimate = true;

            for ( let i = 0; i < this.attacked.length; i++ ) {
                //* get directions of enemys
                let directionEnemy = '';
                if ( this.attacked[i].normal.x === 0 && this.attacked[i].normal.y === 1 || this.attacked[i].normal.x === -0 && this.attacked[i].normal.y === 1 ) {
                    directionEnemy = 'UP';
                }else
                    if ( this.attacked[i].normal.x === 1 && this.attacked[i].normal.y === 0 || this.attacked[i].normal.x === 1 && this.attacked[i].normal.y === -0 ) {
                        directionEnemy = 'LEFT';
                    }else
                        if ( this.attacked[i].normal.x === 0 && this.attacked[i].normal.y === -1 || this.attacked[i].normal.x === -0 && this.attacked[i].normal.y === -1 ) {
                            directionEnemy = 'DOWN';
                        }else
                            if ( this.attacked[i].normal.x === -1 && this.attacked[i].normal.y === 0 || this.attacked[i].normal.x === -1 && this.attacked[i].normal.y === -0 ) {
                                directionEnemy = 'RIGHT';
                            }
                //console.log( this.direction, directionEnemy );
                //*set attack
                if ( this.direction === directionEnemy && this.attacked[i].actorB !== undefined && this.attacked[i].actorB.life.curLife > 0 
                    && this.attacked[i].actorB.life.curLife <= this.attacked[i].actorB.life.maxLife ) {
                    this.attacked[i].actorB.life.curLife -= this.damage.power.max;
                    console.log( 'set damage HUMAN ', this.damage.power.max );
                }
            }
        }
    }

    getAttackedActor( objects ) {
        this.attacked = objects;
        //console.log( this.attacked );
    }

    setNewWeapon( obj ) {
        //console.log( obj );
        //console.log( obj.store, obj.type );
        this.isOnlyBody = false;
        this.getCurrentCostume( obj.actorB.store, obj.actorB.type, this.typeOfBody );
        //console.log( obj.normal );
        console.log('set new Weapon');
    }

    //*check keys
    update() {
        this.frameIndexCounter.countFrames();
        if ( this.isPlayer ) {
            
            if ( pressesKeys.size > 0 && this.isPlayer && !this.isHurt ) {
             //console.log( pressesKeys ); 
                for ( const code of pressesKeys.values() ) {
                    switch ( code ) {
                        case 'ArrowUp':
                            this.sourceDY = 0;
                            this.dx = 0;
                            this.dy = -1;
                            this.direction = 'UP'
                            this.isAnimate = true;
                            break;
                        case 'ArrowLeft':
                            this.sourceDY = 64;
                            this.dx = -1;
                            this.dy = 0;
                            this.direction = 'LEFT'
                            this.isAnimate = true;
                            break;
                        case 'ArrowDown':
                            this.sourceDY = 128;
                            this.dx = 0;
                            this.dy = 1;
                            this.direction = 'DOWN'
                            this.isAnimate = true;
                            break;
                        case 'ArrowRight':
                            this.sourceDY = 192;
                            this.dx = 1;
                            this.dy = 0;
                            this.direction = 'RIGHT'
                            this.isAnimate = true;
                            break;
                        case 'Space':
                            this.toAttack();
                            break;
                            /*
                        case 'KeyA':
                            console.log('key A');
                            if ( this.life > 0 && this.life <= 100 ) {
                                this.life -= 10;
                                this.lifeBar.currentLife = this.life;
                                console.log( this.life );
                            }
                            break;*/
                    }
                }
                if ( !pressesKeys.has( 'Space' ) && !pressesKeys.has( 'KeyE' ) ) {
                    this.isAttack = false;
                    this.x = this.x + this.dx;
                    this.y = this.y + this.dy;
                    this.lifeBar.x = this.x + this.dx;
                    this.lifeBar.y = this.y + this.dy;
                    Body.setPosition( this.body.hull, { x: this.x+32, y: this.y+37 } );
                    Body.setPosition( this.damage.area.hull, { x: this.x+32, y: this.y+32 } );
                }
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if ( pressesKeys.has( 'Space' ) && pressesKeys.has( 'ArrowLeft' ) ) {
                    console.log('COMBO');
                }
            }else{
                this.isAnimate = false;
                this.isAttack = false;
                this.isNotAttack = true;
                /*
                if ( this.life <= 0 ) {
                    if ( !this.isHurt ) {
                        console.log( this );
                        this.sourceDY = 0;
                        this.isHurt = true;
                        this.lifeBar.x = this.x;
                        this.lifeBar.y = this.y;
                        Body.setPosition( this.body.hull, { x: 100, y: 100 } );
                        Body.setPosition( this.damage.area.hull, { x: 100, y: 100 } );
                    }
                    this.isAnimate = true;
                }*/
            }
            if ( this.life.curLife <= 0 ) {
                if ( !this.isHurt ) {
                    this.sourceDY = 0;
                    this.isHurt = true;
                    this.lifeBar.x = this.x;
                    this.lifeBar.y = this.y;
                    Body.setPosition( this.body.hull, { x: 100, y: 100 } );
                    Body.setPosition( this.damage.area.hull, { x: 100, y: 100 } );
                }
                this.isAnimate = true;
            }

            this.lifeBar.currentLife = this.life.curLife;
        }
    }
}

class CLOTHES {
    constructor( tilesOfCostume, typeOfCostume, typeOfClothes, x, y, visible ) {
        //console.log( tilesOfCostume, typeOfClothes );
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
        //*load tiles
        this.tilesToRenderWalk = {};
        this.tilesToRenderAttack = {};
        this.tilesToRenderHurt = {};

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
       // console.log( tempTypeOfCostume );
        //*load walk tiles
        for ( let i = 0; i < this.tilesOfCostume.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderWalk = this.tilesOfCostume[i].walk;
                this.tilesToRenderWalk.visible = this.visible;
                //console.log( this.tilesToRenderWalk );
            }
        }
        //*load attack tiles
        for ( let i = 0; i < this.tilesOfCostume.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderAttack = this.tilesOfCostume[i][tempTypeOfCostume];
                this.tilesToRenderAttack.visible = this.visible;
                //console.log( this.tilesToRenderAttack );
            }
        }
        //*load hurt tiles
        for ( let i = 0; i < this.tilesOfCostume.length; i++ ) {
            if ( i === this.indexClothes ) {
                this.tilesToRenderHurt = this.tilesOfCostume[i].hurt;
                this.tilesToRenderHurt.visible = this.visible;
                //console.log( this.tilesToRenderHurt );
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
        console.log( weaponTile );
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
        //this.tiles = weaponTile;
        this.tile = weaponTile;
        this.type = typeOfWeapon;
        this.tileObject = {};
        //*load tile
        this.tilesToRenderWalk = {};
        this.tilesToRenderAttack = {};
        //*life
        this.life = 100;
        //*load attack tiles
        this.tilesToRenderWalk = this.tile.walk;
        this.tilesToRenderWalk.visible = this.visible;
        this.tilesToRenderAttack = this.tile.attack;
        this.tilesToRenderAttack.visible = this.visible;
        //*get weapon power
        if ( this.tile.hasOwnProperty( 'power' ) ) {
            this.power = this.tile.power;
            //console.log( this.power );
        }
        //console.log( this.tileObject );
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
                if ( typeof this.tileObject === 'object' ) {
                    this.draw();
                }
            }else{
                if ( typeof this.tileObject === 'object' ) {
                    this.draw();
                }
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
    constructor( tilesOfBody, tilesOfCostume, typeOfCostume, coordsOfSpawn, isPlayer, visible, isOnlyBody ) { 
        super();

        //*coords
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
        //*booles
        this.isAttack = false;
        this.isAnimate = false;
        this.isNotAttack = true; //!! necessary?
        this.isPlayer = isPlayer;
        this.visible = visible;
        this.isOnlyBody = isOnlyBody;
        this.isHurt = false;
        //*life
        this.life = {
            curLife: 1000,
            maxLife: 1000
        };
        //*damage
        this.damage = {
            power: {},
            width: 60,
            height: 60,
            area: {}
        }
        this.frameIndexCounter = new FrameRateCounter(100);
        //console.log( this.frameIndexCounter );
        //*type
        if ( !isPlayer ) {
            //*set coords
            this.x = coordsOfSpawn.x;
            this.y = coordsOfSpawn.y;
            //*set type of body
            this.typeOfBody = 'skeleton';
            //*create collision body
            this.createCollisionBody();
            //*create damage area
            this.createDamageArea();
            //*create lifeBar
            this.createLifeBar();
            //*create costumes and weapon
            this.getCurrentCostume();
            //console.log( this.damage.power );
            console.log('set type of body = skeleton');
        }
    }

    createCollisionBody() {
        super.createCollisionBody();
        //console.log( this.body );
    }

    createDamageArea() {
        super.createDamageArea();
    }

    createLifeBar() {
        super.createLifeBar( this.x , this.y, this.life.curLife );
        // console.log( this.lifeBar );
    }

    getCurrentCostume() {
        super.getCurrentCostume( this.tilesOfCostume, this.typeOfCostume, this.typeOfBody );
    }

    //*render
    render() {
        super.render();
        this.createLifeBar();
    }

    //*to attack
    toAttack( tempObj ) {
        if ( !this.isOnlyBody ) {
            //console.log('skeleton attack');
            if ( !this.isHurt ) {
                //console.log( this.frameIndexCounter );
                this.isAttack = true;
                this.isNotAttack = false;
                this.setSourceDY( tempObj.normal );
            }
            if ( tempObj.actorA.life.curLife > 0 && tempObj.actorA.life.curLife <= tempObj.actorA.life.maxLife ) {
                //console.log( tempObj );
                tempObj.actorA.life.curLife -= this.damage.power.min;
                console.log( 'set damage SKELETON ', this.damage.power.min );
            }
        }
    }

    toNotAttack() {
        if ( !this.isOnlyBody ) {
            console.log('skeleton not attack');
            this.isAttack = false;
            this.isNotAttack = true;
        }
    }

    setSourceDY( normal ) {
        switch ( normal.x ) {
            case -1: 
                this.sourceDY = 64;
                break;
            case 1:
                this.sourceDY = 192;
                break;
            }
        switch ( normal.y ) {
            case -1:
                this.sourceDY = 0;
                break;
            case 1:
                this.sourceDY = 128;
                break;
            }
    }

    //*check keys
    update() {
        super.update()
        if ( !this.isHurt ) {
            if ( !this.isAttack ) {
                //if ( this.isAnimate ) {
                    this.isAnimate = false;
                //}
            }else
                if ( this.isAttack ) {
                    
                    this.isAnimate = true;
                }
            if ( this.life.curLife <=0 && !this.isHurt ) {
                this.isHurt = true;
                this.isAttack = false;
                this.sourceDY = 0;
                this.lifeBar.x = this.x;
                this.lifeBar.y = this.y;
                Body.setPosition( this.body.hull, { x: 500+ this.x, y: 100+this.y } );
                Body.setPosition( this.damage.area.hull, { x: 500+ this.x, y: 100+this.y } );
                //console.log( this.life );
                this.isAnimate = true;
            }
        }
        /*
        if ( !this.isAttack ) {
            if ( this.isAnimate ) {
                this.isAnimate = false;
            }
        }else
        if ( this.life <=0 && !this.isHurt ) {
            this.isHurt = true;
            this.isAttack = false;
            this.sourceDY = 0;
            this.lifeBar.x = this.x;
            this.lifeBar.y = this.y;
            Body.setPosition( this.body.hull, { x: 500+ this.x, y: 100+this.y } );
            Body.setPosition( this.damage.area.hull, { x: 500+ this.x, y: 100+this.y } );
            console.log( this.life );
        }else{
            this.isAnimate = true;
        }
        /*
        if ( this.life <= 0 ) {
            if ( !this.isHurt ) {
                //console.log( this );

                this.sourceDY = 0;
                this.isHurt = true;
                this.lifeBar.x = this.x;
                this.lifeBar.y = this.y;
                Body.setPosition( this.body.hull, { x: 500+ this.x, y: 100+this.y } );
                Body.setPosition( this.damage.area.hull, { x: 500+ this.x, y: 100+this.y } );
            }
            this.isAnimate = true;
        }*/

    }
}

class LIFEBAR {
    //x = 0;
    //y = 0;
    #posX = 16;

    #max = 1000;
    #min = 0;
    #width = 30;
    #height = 5;
    //currentLife = 100;
    #colorFull = 'green';
    #colorEmpty = 'red';

    constructor( x, y, currentLife ) {
        this.x = x;
        this.y = y;
        this.currentLife = currentLife;
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
            ctx.fillRect( this.x + this.#posX + this.#width*this.currentLife/this.#max, this.y, this.#width*( this.#max - this.currentLife )/this.#max, this.#height );
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
        /*
        if ( this.currentLife <=0 ) {
            console.log( this.currentLife );
        }
        */
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

class DAMAGE_AREA {
    constructor( x, y, /*radius*/width, height ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        //this.radius = radius;
        //this.hull = Bodies.circle( this.x + 32, this.y + 32, this.radius, { isStatic: true } );
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