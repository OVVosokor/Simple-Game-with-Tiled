window.addEventListener("load", eventWindowLoaded, false);

function eventWindowLoaded () {
    canvasApp();
    }

function canvasSupport () {
    return Modernizr.canvas;
    }

function canvasApp()  {

    if ( !canvasSupport() ) {
        return;
    }

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    //const canvasUI = document.getElementById('myCanvas_ui');
    //const ctxUI = canvasUI.getContext('2d');

    //const canvasBG = document.getElementById('myCanvas_bg');
    //const ctxBG = canvasBG.getContext('2d');
/*
    let mouseMoveCoords = {
        x: 0,
        y: 0
    };
    let mouseClickCoords = {
        x: 0,
        y: 0
    };*/
    class Game {
        mapIndexOffset =-1;
        mapRows = 20;
        mapCols = 30;
        tileMaps = [];
        mapIndex = undefined; 
        isRun = false;
        frameIndex = 0;
        isPressKey = false;
        pressedKeys = new Set();
        //* items
        player = [];
        itemsOfObjects = [];
        itemsOfStaticNpc = [];
        //* places Spawn
        placesSpawnPlayer = [];
        placesSpawnObject = [];
        placesSpawnStaticNpc = [];

        costumes_walk = [
            { tileSheet: tileSheetOfWalks,
                animFrames: 9
            },
            { tileSheet: tileSheetOfHEAD_chain_armor_helmet,
                animFrames: 9
            },
            { tileSheet: tileSheetOfFEET_shoes_brown,
                animFrames: 9
            },
            { tileSheet: tileSheetOfLEGS_pants_greenish,
                animFrames: 9
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_torso,
                animFrames: 9
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_bracers,
                animFrames: 9
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_shoulders,
                animFrames: 9
            }
        ];
        costumes_attack = [
            { tileSheet: tileSheetOfBODY_human_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfHEAD_chain_armor_helmet_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfFEET_shoes_brown_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfLEGS_pants_greenish_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_torso_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_bracers_attack,
                animFrames: 6
            },
            { tileSheet: tileSheetOfTORSO_leather_armor_shoulders_attack,
                animFrames: 6
            },
            { tileSheet: '', //quiver
                animFrames: 6
            },
            { tileSheet: '', //belt
                animFrames: 6
            },
            { tileSheet: tileSheetOfWEAPON_dagger, //dagger
                animFrames: 6
            },
            { tileSheet: tileSheetOfWEAPON_shield_cutout_chain_armor_helmet, //shield
                animFrames: 9
            },
            { tileSheet: '', //hands
                animFrames: 6
            }

        ];
        costume = { 
            walk: this.costumes_walk,
            attack: this.costumes_attack 
        };
        costumes_objects = [
            {   //TODO сделать спрайты для объектов
                tileSheet: tileSheetOfShields_spear,
                animFrames: 1
            }
        ]
        costumes_staticNpc = [
            {   
                tileSheet: tileSheetOfCombatDummy,
                animFrames: 8
            }
        ]

        constructor() {
            //this.playerTest.costume = this.costume_1;
            //console.log( this.playerTest );
        }

        init() {
            canvas.width = this.mapCols * 32;
            canvas.height = this.mapRows * 32;
            this.isRun = true;
            const spawnPlayerX = this.placesSpawnPlayer[0].x;
            const spawnPlayerY = this.placesSpawnPlayer[0].y;

            this.spawnPlayer( this.costume, spawnPlayerX, spawnPlayerY );
            //console.log( this.costume );
            this.spawnObject( this.costumes_objects );
            this.spawnNpc( this.costumes_staticNpc );

            gameLoop();
        }
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
                case 'quiver':
                    return 7;
                case 'belt':
                    return 8;
                case 'dagger':
                    return 9;
                case 'shield':
                    return 10;
                case 'hands':
                    return 11;
                }
        }
        getItemOfObject( type ) {
            switch ( type ) {
                case 'shield_spear':
                    return 0;
                //case 'feet':
                //    return 2;
                    /*
                case 'legs':
                    return 3;
                case 'torso':
                    return 4;
                case 'bracers':
                    return 5;
                case 'shoulders':
                    return 6;
                case 'quiver':
                    return 7;
                case 'belt':
                    return 8;
                case 'dagger':
                    return 9;
                case 'shield':
                    return 10;
                case 'hands':
                    return 11;
                    */
                }
                
        }
        getItemOfNpc( type ) {
            switch ( type ) {
                case 'combat_dummy':
                    return 0;
                //case 'feet':
                //    return 2;
                    /*
                case 'legs':
                    return 3;
                case 'torso':
                    return 4;
                case 'bracers':
                    return 5;
                case 'shoulders':
                    return 6;
                case 'quiver':
                    return 7;
                case 'belt':
                    return 8;
                case 'dagger':
                    return 9;
                case 'shield':
                    return 10;
                case 'hands':
                    return 11;
                    */
                }
                
        }


        
        spawnPlayer( costumes, x, y ) {
            this.player[0] = new Player( x, y );
            //Body
            this.player[1] = new Body( costumes, 'attack', x, y, false );
            this.player[2] = new Body( costumes, 'walk', x, y, true );
            //costume Walk
            this.player[3] = new Clothes( costumes, 'walk', 'head', x, y, true );
            this.player[4] = new Clothes( costumes, 'walk', 'feet', x, y, true );
            this.player[5] = new Clothes( costumes, 'walk', 'legs', x, y, true );
            this.player[6] = new Clothes( costumes, 'walk', 'torso', x, y, true );
            this.player[7] = new Clothes( costumes, 'walk', 'bracers', x, y, true );
            this.player[8] = new Clothes( costumes, 'walk', 'shoulders', x, y, true );
            //costume Attack
            this.player[9] = new Clothes( costumes, 'attack', 'head', x, y, false );
            this.player[10] = new Clothes( costumes, 'attack', 'feet', x, y, false );
            this.player[11] = new Clothes( costumes, 'attack', 'legs', x, y, false );
            this.player[12] = new Clothes( costumes, 'attack', 'torso', x, y, false );
            this.player[13] = new Clothes( costumes, 'attack', 'bracers', x, y, false );
            this.player[14] = new Clothes( costumes, 'attack', 'shoulders', x, y, false );
            //Weapon
            this.player[15] = new Weapon( costumes, 'attack', 'dagger', x, y, false );
            //console.log( this.player );
        }
        spawnObject( costumes ) {
            for ( let i = 0; i < this.placesSpawnObject.length; i++ ) {
                this.itemsOfObjects[i] = new ObjectOnMap( costumes, 'shield_spear', this.placesSpawnObject[i].x, this.placesSpawnObject[i].y, true );
            }
            //console.log(this.itemsOfObjects);
        }
        spawnNpc( costumes ) {
            for ( let i = 0; i < this.placesSpawnStaticNpc.length; i++ ) {
                this.itemsOfStaticNpc[i] = new StaticNpc( costumes, 'combat_dummy', this.placesSpawnStaticNpc[i].x, this.placesSpawnStaticNpc[i].y, true );
            }
            //console.log( costumes );
        }

        renderMap( idMap ) {
            if ( this.isRun ) {
                for ( let rowCtr = 0; rowCtr < this.mapRows; rowCtr++ ) {
                    for ( let colCtr = 0; colCtr < this.mapCols; colCtr++ ) {
                        if ( this.mapIndex === undefined ) {
                            this.mapIndex = 0;
                        }
                        //console.log( 'mapIndex:', this.mapIndex );
                        let tileId = this.tileMaps[idMap][ this.mapIndex ] + this.mapIndexOffset;
                       // console.log( 'mapIndex:', this.mapIndex, 'tileID:', this.tileMap[ this.mapIndex ] );
                        let sourceX = Math.floor( tileId % 8 ) * 33;
                        let sourceY = Math.floor( tileId / 8 ) * 33;
                        //console.log( sourceX+1, sourceY+1, 'colCtr:', colCtr, 'rowCtr:', rowCtr );
                        ctx.drawImage( tileSheetOfMap, sourceX + 1, sourceY + 1, 32, 32, colCtr * 32, rowCtr * 32, 32, 32 );
                        this.mapIndex++;
                        //console.log( this.tileMap.length );
                        if ( this.mapIndex === this.tileMaps[idMap].length ) {
                            this.mapIndex = undefined;
                        }
                    }
                }
            }
        }
        renderPlayer() {
            for ( let i = 1; i < this.player.length; i++ ) {
                if ( typeof this.player[i] === 'object' ) {
                    this.player[i].render();
                }
            }
        }
        renderObjects() {
            for ( let i = 0; i < this.itemsOfObjects.length; i++ ) {
                if ( typeof this.itemsOfObjects[i] === 'object' ) {
                    this.itemsOfObjects[i].render();
                }
            }
        }
        renderNpc() {
            for ( let i = 0; i < this.itemsOfStaticNpc.length; i++ ) {
                if ( typeof this.itemsOfStaticNpc[i] === 'object' ) {
                    this.itemsOfStaticNpc[i].render();
                }
            }
        }
        updatePlayer() {
            for ( let i = 0; i < this.player.length; i++ ) {
                if ( typeof this.player[i] === 'object' ) {
                    this.player[i].update();
                }
            }

        }

        updateObject() {
            for ( let i = 0; i < this.itemsOfObjects.length; i++ ) {
                if ( typeof this.itemsOfObjects[i] === 'object' ) {
                    this.itemsOfObjects[i].update();
                }
            }
        }
        drawScreen() {
            frameRateCounter.countFrames();
            frameIndexCounter.countFrames();

            this.updatePlayer();
            this.updateObject();

            this.renderMap( 0 );
            this.renderObjects();
            this.renderNpc();

            this.renderPlayer();
            //this.itemsOfNpc[0].render();


            ctx.font = '20px sans-serif';
            ctx.textBaseline = 'top';
            ctx.fillText ( "FPS:" + frameRateCounter.lastFrameCount, 0, 10 ); 
        }
    }


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

            /*
            if ( this.frameIndex >= 8 ) {
                this.frameIndex = 0;
            }
            */
            //delete dateTemp;
        }
    }
    class Npc {
        constructor( x, y ) {
            this.frameIndex = 0;
            //this.tileSheet = tileSheet;
            //this.animFrames = animFrames;
            this.x = x;
            this.y = y;
            this.width = 64;
            this.height = 64;
            this.dx = 0;
            this.dy = 0;
            this.delay = 100;
           // this.direction = 'down';
            this.sourceDY = 0; //128
            this.moveMode = 'run';
           // this.isAttack = false;
            //this.visibility = visibility;
        }

        boundingBoxCollide( object1, object2 ) {
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

        boundingBoxCollide( object1, object2 ) {
            if ( super.boundingBoxCollide( object1, object2 ) ) {
                return true;
            }else{
                return false;
            }
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
                            //this.sourceDY = 198;
                            this.dx = 0;
                            this.dy = 0;
                            break;
                    }
                }
                if ( !game.pressedKeys.has( 'Space' ) ) {
                    this.x = this.x + this.dx;
                    this.y = this.y + this.dy;
                }
               // this.x = this.x + this.dx;
                //this.y = this.y + this.dy;
                //console.log( this.boundingBoxCollide( game.itemsOfNpc[0], this ) );
            }
        }
    }
    class Body extends Player {
        constructor( costumes, activeType, x, y, visibility ) { //tileSheet, animFrames, x, y, delay, visibility
            super();
            this.frameIndex = 0;
            this.type = activeType;
            
            if ( activeType === 'walk' ) {
                //this.isAttack = false;
                this.tileSheet = costumes.walk[0].tileSheet;
                this.animFrames = costumes.walk[0].animFrames;
            }else{
                //this.isAttack = true;
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
            this.moveMode = 'run';
            this.visibility = visibility;
            //console.log( tileSheet );
            console.log( this.tileSheet, this.animFrames, x, y );
        }

        render() {
            if ( this.visibility ) {
                super.render();  
            }
        }
        /*
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
        */
    }
    class NonStaticNpc extends Npc {

    }

    //цикл игры
    function gameLoop() {
        game.drawScreen();

        window.requestAnimationFrame( gameLoop );
    }
    
    //обработчики событий
    /*
    function mouseMoveHandler( e ) {
        mouseMoveCoords.x = e.offsetX;
        mouseMoveCoords.y = e.offsetY;
    }

    function mouseUpHandler( e ) {
            mouseClickCoords.x = e.offsetX;
            mouseClickCoords.y = e.offsetY;
    }
    */
    function mouseKeyDownHandler( e ) {
        //console.log( e.code );

        switch ( e.code ) {
            case 'ArrowDown':
                game.pressedKeys.add( e.code );
                for ( let i = 0; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                        game.player[i].moveMode = 'run';
                    }
                }
                game.isPressKey = true;
                break;
            case 'ArrowUp':
                for ( let i = 0; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object'/* && i !== 6*/ ) {
                        game.player[i].moveMode = 'run';
                    }
                }
                game.isPressKey = true;
                game.pressedKeys.add( e.code );
                break;
            case 'ArrowLeft':
                for ( let i = 0; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                        game.player[i].moveMode = 'run';
                    }
                }
                game.isPressKey = true;
                game.pressedKeys.add( e.code );
                break;
            case 'ArrowRight':
                for ( let i = 0; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                        game.player[i].moveMode = 'run';
                    }
                }
                game.isPressKey = true;
                game.pressedKeys.add( e.code );
                break;
            case 'Space':
                for ( let i = 1; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                        game.player[i].moveMode = 'run';

                    }
                    if ( game.player[i].type === 'attack' ) {
                        game.player[i].visibility = true;
                    }else
                        if ( game.player[i].type === 'walk' ) {
                            game.player[i].visibility = false;
                        }

                }
                    //game.player[1].visibility = true;
                    //game.player[2].visibility = false;

                game.isPressKey = true;
                game.pressedKeys.add( e.code );
                break;
            }
    }
    function mouseKeyUpHandler( e ) {
        switch ( e.code ) {
            case 'ArrowDown':
                game.pressedKeys.delete( e.code );
                if ( game.pressedKeys.size === 0 ) {
                    game.isPressKey = false;
                    for ( let i = 0; i < game.player.length; i++ ) {
                        if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                            game.player[i].moveMode = 'idle';
                        }
                    }
                    }
                break;
            case 'ArrowUp':
                game.pressedKeys.delete( e.code );
                if ( game.pressedKeys.size === 0 ) {
                    game.isPressKey = false;
                    for ( let i = 0; i < game.player.length; i++ ) {
                        if ( typeof game.player[i] === 'object'/* && i !== 6 */) {
                            game.player[i].moveMode = 'idle';
                        }
                    }
                }
                break;
            case 'ArrowLeft':
                game.pressedKeys.delete( e.code );
                if ( game.pressedKeys.size === 0 ) {
                    game.isPressKey = false;
                    for ( let i = 0; i < game.player.length; i++ ) {
                        if ( typeof game.player[i] === 'object'/* && i !== 6*/ ) {
                            game.player[i].moveMode = 'idle';
                        }
                    }
                }
                break;
            case 'ArrowRight':
                game.pressedKeys.delete( e.code );
                if ( game.pressedKeys.size === 0 ) {
                    game.isPressKey = false;
                    for ( let i = 0; i < game.player.length; i++ ) {
                    if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                        game.player[i].moveMode = 'idle';
                    }
                }
            }
                break;
            case 'Space':
                game.pressedKeys.delete( e.code );
                //if ( game.pressed.size === 0 ) {
                    game.isPressKey = false;
                    for ( let i = 1; i < game.player.length; i++ ) {
                        if ( typeof game.player[i] === 'object' /*&& i !== 6*/ ) {
                            game.player[i].moveMode = 'idle';
                        }
                        if ( game.player[i].type === 'attack' ) {
                            game.player[i].visibility = false;
                        }else
                            if ( game.player[i].type === 'walk' ) {
                                game.player[i].visibility = true;
                            }
    
                    }
                //game.player[1].visibility = false;
                //game.player[2].visibility = true;

               // }
                break;
    
            }
    }

    //слушатели событий
       // window.addEventListener( 'mousemove', mouseMoveHandler );
        //window.addEventListener( 'mouseup', mouseUpHandler );
    window.addEventListener( 'keydown', mouseKeyDownHandler );
    window.addEventListener( 'keyup', mouseKeyUpHandler );
    //*** MAP
    const tileSheetOfMap = new Image();
    tileSheetOfMap.addEventListener( 'load', itemLoaded , false );
    tileSheetOfMap.src = "tiles/tmw_desert_spacing.png";
    //*** PLAYER costume Walk
    const tileSheetOfWalks = new Image();
    tileSheetOfWalks.addEventListener( 'load', itemLoaded , false );
    tileSheetOfWalks.src = "tiles/walkcycle/BODY_male.png";

    const tileSheetOfHEAD_chain_armor_helmet = new Image();
    tileSheetOfHEAD_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
    tileSheetOfHEAD_chain_armor_helmet.src = "tiles/walkcycle/HEAD_chain_armor_helmet.png";

    const tileSheetOfTORSO_leather_armor_bracers = new Image();
    tileSheetOfTORSO_leather_armor_bracers.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_bracers.src = "tiles/walkcycle/TORSO_leather_armor_bracers.png";

    const tileSheetOfFEET_shoes_brown = new Image();
    tileSheetOfFEET_shoes_brown.addEventListener( 'load', itemLoaded , false );
    tileSheetOfFEET_shoes_brown.src = "tiles/walkcycle/FEET_shoes_brown.png";

    const tileSheetOfTORSO_leather_armor_torso = new Image();
    tileSheetOfTORSO_leather_armor_torso.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_torso.src = "tiles/walkcycle/TORSO_leather_armor_torso.png";

    const tileSheetOfTORSO_leather_armor_shoulders = new Image();
    tileSheetOfTORSO_leather_armor_shoulders.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_shoulders.src = "tiles/walkcycle/TORSO_leather_armor_shoulders.png";

    const tileSheetOfLEGS_pants_greenish = new Image();
    tileSheetOfLEGS_pants_greenish.addEventListener( 'load', itemLoaded , false );
    tileSheetOfLEGS_pants_greenish.src = "tiles/walkcycle/LEGS_pants_greenish.png";

    //*** PLAYER costume Attack
    const tileSheetOfBODY_human_attack = new Image();
    tileSheetOfBODY_human_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfBODY_human_attack.src = "tiles/slash/BODY_human.png";

    const tileSheetOfHEAD_chain_armor_helmet_attack = new Image();
    tileSheetOfHEAD_chain_armor_helmet_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfHEAD_chain_armor_helmet_attack.src = "tiles/slash/HEAD_chain_armor_helmet.png";

    const tileSheetOfFEET_shoes_brown_attack = new Image();
    tileSheetOfFEET_shoes_brown_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfFEET_shoes_brown_attack.src = "tiles/slash/FEET_shoes_brown.png";

    const tileSheetOfLEGS_pants_greenish_attack = new Image();
    tileSheetOfLEGS_pants_greenish_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfLEGS_pants_greenish_attack.src = "tiles/slash/LEGS_pants_greenish.png";

    const tileSheetOfTORSO_leather_armor_torso_attack = new Image();
    tileSheetOfTORSO_leather_armor_torso_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_torso_attack.src = "tiles/slash/TORSO_leather_armor_torso.png";

    const tileSheetOfTORSO_leather_armor_bracers_attack = new Image();
    tileSheetOfTORSO_leather_armor_bracers_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_bracers_attack.src = "tiles/slash/TORSO_leather_armor_bracers.png";

    const tileSheetOfTORSO_leather_armor_shoulders_attack = new Image();
    tileSheetOfTORSO_leather_armor_shoulders_attack.addEventListener( 'load', itemLoaded , false );
    tileSheetOfTORSO_leather_armor_shoulders_attack.src = "tiles/slash/TORSO_leather_armor_shoulders.png";

    //*** WEAPON
    const tileSheetOfWEAPON_dagger = new Image();
    tileSheetOfWEAPON_dagger.addEventListener( 'load', itemLoaded , false );
    tileSheetOfWEAPON_dagger.src = "tiles/slash/WEAPON_dagger.png";

    const tileSheetOfWEAPON_shield_cutout_chain_armor_helmet = new Image();
    tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
    tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.src = "tiles/walkcycle/WEAPON_shield_cutout_chain_armor_helmet.png";

    const tileSheetOfBEHIND_quiver = new Image();
    tileSheetOfBEHIND_quiver.addEventListener( 'load', itemLoaded , false );
    tileSheetOfBEHIND_quiver.src = "tiles/walkcycle/BEHIND_quiver.png";

    //*** Objects on Map
    const tileSheetOfShields_spear = new Image();
    tileSheetOfShields_spear.addEventListener( 'load', itemLoaded , false );
    tileSheetOfShields_spear.src = "tiles/objectsOnMap/WEAPON_spear_2.png";

    //** NonStatic Npc
    const tileSheetOfBody_skeleton = new Image();
    tileSheetOfBody_skeleton.addEventListener( 'load', itemLoaded , false );
    tileSheetOfBody_skeleton.src = "tiles/walkcycle/BODY_skeleton.png";

    //*** Static Npc
    const tileSheetOfCombatDummy = new Image();
    tileSheetOfCombatDummy.addEventListener( 'load', itemLoaded , false );
    tileSheetOfCombatDummy.src = "tiles/combat_dummy/BODY_animation.png";
    

    //*** Load json
    let requestURL = 'tiles/tileSheetOfMap.json';
    let request = new XMLHttpRequest();
    request.open( 'GET', requestURL );
    request.responseType = 'json';
    request.send();
    
    request.addEventListener( 'load', itemLoaded, false );
    let loadCount = 0;
    const itemsToLoad = 22;

    function itemLoaded() { //page 545
        loadCount++;
        if ( loadCount >= itemsToLoad ) {
            
            tileSheetOfMap.removeEventListener( 'load', itemLoaded , false );
            request.removeEventListener( 'load', itemLoaded, false );
            //TODO добавить все removeEventListener
            //*
            //*
            jsonObj = request.response; 
            game.tileMaps[0] = jsonObj.layers[0].data;
            game.tileMaps[1] = jsonObj.layers[1].data;
            //console.log( game.tileMaps );
            game.placesSpawnPlayer[0] = jsonObj.layers[2].objects[0];
            //console.log( game.placeSpawnPlayer[0] );
            game.placesSpawnObject[0] = jsonObj.layers[3].objects[0];
            game.placesSpawnObject[1] = jsonObj.layers[3].objects[1];
            game.placesSpawnObject[2] = jsonObj.layers[3].objects[2];
            game.placesSpawnObject[3] = jsonObj.layers[3].objects[3];
            //console.log(  game.placesSpawnObject );

            game.placesSpawnStaticNpc[0] = jsonObj.layers[4].objects[0];
            game.placesSpawnStaticNpc[1] = jsonObj.layers[4].objects[1];
            game.placesSpawnStaticNpc[2] = jsonObj.layers[4].objects[2];
            game.placesSpawnStaticNpc[3] = jsonObj.layers[4].objects[3];
            //console.log(  game.placesSpawnNpc );

            //console.log( jsonObj.layers.length );

            game.init();
        }
    }

    const game = new Game();
    const frameRateCounter = new FrameRateCounter(1000);
    const frameIndexCounter = new FrameRateCounter(100);



}

                    /*
                    if ( game.pressed.has( 'ArrowDown' ) && game.pressed.has( 'ArrowRight' ) ) {
                        this.sourceDY = 128;
                        this.dx = 1;
                        this.dy = 1;
                        break;
                    }else
                        if ( game.pressed.has( 'ArrowDown' ) && game.pressed.has( 'ArrowLeft' ) ) {
                            this.sourceDY = 128;
                            this.dx = -1;
                            this.dy = 1;
                            break;
                        }else
                            if ( game.pressed.has( 'ArrowUp' ) && game.pressed.has( 'ArrowLeft' ) ) {
                                this.sourceDY = 0;
                                this.dx = -1;
                                this.dy = -1;
                                break;
                            }else
                                if ( game.pressed.has( 'ArrowUp' ) && game.pressed.has( 'ArrowRight' ) ) {
                                    this.sourceDY = 0;
                                    this.dx = 1;
                                    this.dy = -1;
                                    break;
                                }
*/
