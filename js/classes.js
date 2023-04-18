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
        this.width = 32;
        this.height = 32;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100;
        this.sourceDY = 0; //128
        this.moveMode = 'idle'; //run
        this.isAnimate = false;
        this.isHurt = false;
        this.frameIndexCounter = {} //new FrameRateCounter(100);
    }/*
    //*check collide
    boundingObjectCollide( object1, object2 ) {
        console.log( object1, object2 );
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
    }*/
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
    constructor( x, y ) { 
        super();
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.dx = 0;
        this.dy = 0;
        this.delay = 100//delay animation;
       // this.direction = 'down';
        this.sourceDY = 128; 
        this.moveMode = 'idle';
        this.isAnimate = false;
        //this.isAttack = false;
    }
    /*
    //*check collide
    boundingEnemyCollide() {
        for ( let i = 0; i < itemsOfStaticNpc.length; i++ ) {
            if ( super.boundingObjectCollide( this, itemsOfStaticNpc[i] ) ) {
                return true;
            }
        }
    }
    boundingObjectCollide() {
        super.boundingObjectCollide();
    }*/
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
        this.width = 32;
        this.height = 32;
        this.delta = 16;
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
            width: 30,
            height: 30,
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
    
    modifySpeed() {
        //*
        let tempHull = [];
        let k = 1;
        for (const node of graph.nodes ) {
            if ( node.cost === 50 ) {
                tempHull.push( node.hull );
            }
        }
        //console.log( tempHull );
        let collide = Query.collides( this.body.hull, tempHull );
        //console.log( collide );
        if ( collide.length > 0 ) {
            return k = 5;
        }else{
            return k; //= 1;
        }
    }

    createCollisionBody() {
        this.body = new COLLISION( this.x+this.delta, this.y+this.delta+4, this.width-this.delta, this.height-this.delta/2-4 );
        //console.log( this.body );
    }

    createLifeBar() {
        this.lifeBar = new LIFEBAR( this.x, this.y, this.life.curLife );
        // console.log( this.lifeBar );
    }

    createDamageArea() {
        this.damage.area = new DAMAGE_AREA( this.x+this.delta, this.y+this.delta, this.damage.width, this.damage.height );
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
                    //console.log( this.frameIndexCounter.frameCtr );
                    //* get current damage power
                    if ( this.frameIndexCounter.frameCtr === 0 ) {
                        let curDamagePower = this.getDamagePower( this.damage.power.min, this.damage.power.max )
                        this.attacked[i].actorB.life.curLife -= curDamagePower;
                        console.log( 'set damage ', this.name, ' - ', this.attacked[i].actorB.typeOfBody , curDamagePower );
                    }
                    //*set restored life
                    if ( this.attacked[i].actorB.life.curLife <= 0 ) {
                        console.log('restored life');
                        this.life.curLife = this.life.maxLife;
                    }
                }
            }
        }
    }

    getDamagePower( min, max ) {
        min = Math.ceil( min );
        max = Math.floor( max );
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
    }

    getAttackedActor( objects ) {
        this.attacked = objects;
        //console.log( this.attacked );
    }

    setNewWeapon( obj ) {
        //console.log( obj );
        //console.log( obj.actorB.store, obj.actorB.typeOfStaticNPC );
        this.isOnlyBody = false;
        this.getCurrentCostume( obj.actorB.store, obj.actorB.typeOfStaticNPC, this.typeOfBody );
        console.log('set new Weapon');
    }

    getPotion( obj ) {
        //console.log( obj );
        //console.log( obj.actorB.store.putOn.potions.getLife.givenLife );
        let addedLife = obj.actorB.store.putOn.potions.getLife.givenLife;
        this.setNewPotion( addedLife );
        console.log('get potion');
    }

    setNewPotion( quantity ) {
        if ( quantity + this.life.curLife > this.life.maxLife ) {
            //this.life.curLife = quantity;
            this.life.curLife = this.life.maxLife;
        }
        //console.log( this.life );
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
                    //this.getDataTile()
                    let k = this.modifySpeed();
                    this.isAttack = false;
                    this.x = this.x + this.dx/k;
                    this.y = this.y + this.dy/k;
                    this.lifeBar.x = this.x + this.dx/k;
                    this.lifeBar.y = this.y + this.dy/k;
                    Body.setPosition( this.body.hull, { x: this.x+this.delta/*16*/, y: this.y+this.delta+4/*16*/ } );
                    Body.setPosition( this.damage.area.hull, { x: this.x+this.delta/*16*/, y: this.y+this.delta/*16*/ } );
                }
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                if ( pressesKeys.has( 'Space' ) && pressesKeys.has( 'ArrowLeft' ) ) {
                    console.log('COMBO');
                }
            }else{
                this.isAnimate = false;
                this.isAttack = false;
                this.isNotAttack = true;
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
        this.width = 32;
        this.height = 32;
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
        //console.log( weaponTile );
        this.frameIndex = 0;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
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
        this.width = 32;
        this.height = 32;
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
            width: 30,
            height: 30,
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
                //console.log( this.frameIndexCounter.frameCtr );
                if ( this.frameIndexCounter.frameCtr === 0 ) {
                    //* get current damage power
                    let curDamagePower = this.getDamagePower( this.damage.power.min, this.damage.power.max )
                    tempObj.actorA.life.curLife -= curDamagePower; 
                    console.log( 'set damage SKELETON - ', tempObj.actorA.name, curDamagePower );
                }
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
        let start = graph.nodes[0];
        let end = graph.nodes[ 880 ];
        console.log( 'start: ', start, 'end: ', end );

        path = astar.search( graph.nodes, start, end, false );
        console.log( path );
        */

    }
}

class LIFEBAR {
    //x = 0;
    //y = 0;
    #posX = 0;

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
    constructor( tilesOfStaticNPC, store, typeOfStaticNPC, coordsOfSpawn, visible ) {
        super();
        //*coords
        this.x = coordsOfSpawn.x;
        this.y = coordsOfSpawn.y;
        this.width = 32;
        this.height = 32;
        //this.dx = 0;
        //this.dy = 0;
        //*tiles
        //this.delay = 100//delay animation;
        this.frameIndex = 0;
        this.tilesOfStaticNPC = tilesOfStaticNPC;
        this.tileObject = {};
        this.tileObject = tilesOfStaticNPC.idle;
        //*create collision body 
        this.body = new COLLISION( this.x+this.width/2, this.y+this.height/2, this.width, this.height, { isStatic: true } );
       // console.log( this.body );
        //*booles
        this.visible = visible;
        this.isAnimate = false;

        //console.log( tilesOfStaticNPC );
        //console.log( this.tileObject );
        //*store
        this.store = store;
        //*type
        this.typeOfStaticNPC = typeOfStaticNPC;
        //console.log( store );
        if ( typeOfStaticNPC ) {
            this.getCurrentTile();
        }
    }
    //TODO сделать банки с ХР  --------- переделать tilesOfCostume на tilesOfActors 
    //*get current tile, type, store
    getCurrentTile() {
        let currentTile = {};
        switch ( this.typeOfStaticNPC ) {
            case 'spearman':
                //*get current tile
                currentTile = this.tilesOfStaticNPC.putOn[ 'spearman' ].idle;
                //*get store
                this.store = this.store.nonStatic;
                //*get type
                this.type = 'costume';
                break;
            case 'getLife':
                //*get current tile
                currentTile = this.tilesOfStaticNPC.putOn.potions[ 'getLife' ].idle;
                //*get store
                this.store = this.store.static;
                //*get type
                this.type = 'potion';
                break;
        }
        this.tileObject = currentTile;
        //console.log( currentTile );
    }
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

        /*
        if ( pressesKeys.size > 0 ) {
         //console.log( pressesKeys ); 
            for ( const code of pressesKeys.values() ) {
                switch ( code ) {
                    case 'KeyE':
                        console.log('key E');
                        break;
                }
            }
        }*/
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

class ROAD_ITEM extends COLLISION {
    constructor( x, y, width, height ) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hull = Bodies.rectangle( this.x, this.y, this.width, this.height, { isStatic: true } );
        //console.log( this.hull );
    }
    render() {
        super.render();
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

if (!Array.prototype.remove) {
    Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
    };
}


const astar = {
    search: function( grid, start, end, diagonal, heuristic ) {
        heuristic = heuristic || astar.manhattan;

        let openList   = [];
        openList.push(start);

        while(openList.length > 0) {

            // Grab the lowest f(x) to process next
            let lowInd = 0;
            for( let i = 0; i < openList.length; i++ ) {
                if( openList[i].f < openList[lowInd].f ) { lowInd = i; }
            }

            let currentNode = openList[lowInd];

            // End case -- result has been found, return the traced path
            if( currentNode === end ) {
                let curr = currentNode;
                let ret = [];
                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return ret.reverse();
            }
            
            // Normal case -- move currentNode from open to closed, process each of its neighbors
            openList.remove(lowInd);
            currentNode.closed = true;
            
            // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
            let neighbors = astar.neighbors(grid, currentNode, diagonal);

            for( var i = 0; i < neighbors.length; i++ ) {
                let neighbor = neighbors[i];

                if( neighbor.closed || neighbor.isWall() ) {
                    // not a valid node to process, skip to next neighbor
                    continue;
                }

                let gScore = currentNode.g + neighbor.cost;
                let beenVisited = neighbor.visited;

                if( !beenVisited || gScore < neighbor.g ) {
                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic( neighbor.position, end.position );
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing 
                        openList.push(neighbor);
                    }
                }
                
            }
        }
        // No result was found - empty array signifies failure to find path.
        return [];

    },
    manhattan: function(pos0, pos1) {
        var d1 = Math.abs (pos1.x - pos0.x);
        var d2 = Math.abs (pos1.y - pos0.y);
        return d1 + d2;
    },
    neighbors: function( grid, node ) {
        let ret = [];
        let x = node.x;
        let y = node.y;
        tempHull = []

        for (const node of grid) {
            tempHull.push( node.hull );
        }

        const dStart = { x: [ 2, 0, -2, 0 ], y: [ 0, 2, 0, -2 ] };
        const dEnd = { x: [ 16, 0, -16, 0 ], y: [ 0, 16, 0, -16 ] };
        
        let tempHulls = [];
        for ( let i = 0; i < 4; i++ ) {
            let collide = Query.ray( tempHull, {x:x + dStart.x[i], y:y + dStart.y[i]}, {x:x + dEnd.x[i], y:y + dEnd.y[i]} );
            tempHulls = tempHulls.concat( collide );
        }

        //*find node by id hull
        for ( const tempHull of tempHulls ) {
            for ( const node of grid ) {
                if ( node.hull.id === tempHull.bodyB.id ) {
                    ret = ret.concat( node );
                }
            }
        }

        return ret;
    }

}

class GRAPH {
    constructor( grid ) {
        this.elements = grid;
        this.nodes = [];
        this.createGraphNode();
    }

    createGraphNode() {
        for ( let i = 0; i < this.elements.length; i++ ) {
            this.nodes[i] = new GRAPH_NODE( this.elements[i] );
        }
        //console.log( this.nodes );
    }

    draw() {
        for ( const node of this.nodes ) {
            node.render();
        }
    }

    render() {
        this.draw();
    }

}

class GRAPH_NODE {
    constructor( node ) {
        this.x = node.x;
        this.y = node.y;
        this.position = {x:node.x, y:node.y};
        this.data = {};
        this.cost = node.costType;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.visited = false;
        this.closed = false;
        this.parent = null;

        this.pathPoint = false;

        this.hull = Bodies.circle( this.x, this.y, 1, { isStatic: true } );
        //console.log( this.hull );
    }

    isWall() {
        let ret = false;
        switch ( this.cost ) {
            case Infinity:
                ret = true;
                break;
        }
        return ret;
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

        if ( this.closed ) {
            ctx.strokeStyle = 'blue';
        }else
            if ( this.cost === 50 ) {
            ctx.strokeStyle = 'red';
        }else{
                ctx.strokeStyle = 'green';
            }
        
        if ( this.pathPoint ) {
            ctx.strokeStyle = 'black';
        }
        if ( this.cost === 2 ) {
            ctx.strokeStyle = 'black';
        }
        ctx.stroke();
    }

    render() {
        this.draw();
    }
}

