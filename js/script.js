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
    window.ctx = ctx;
    //const canvasUI = document.getElementById('myCanvas_ui');
    //const ctxUI = canvasUI.getContext('2d');

    //const canvasBG = document.getElementById('myCanvas_bg');
    //const ctxBG = canvasBG.getContext('2d');

    //*application states
	const GAME_STATE_INIT = 0;
	const GAME_STATE_WAIT_FOR_LOAD = 10;
	const GAME_STATE_TITLE = 20;
	const GAME_STATE_NEW_GAME = 30;
	const GAME_STATE_RENDER_PLAY_SCREEN=40;
	const GAME_STATE_ANIMATE_PLAYER=50;
	const GAME_STATE_EVALUATE_PLAYER_MOVE=60;
	const GAME_STATE_ENEMY_MOVE=70;
	const GAME_STATE_ANIMATE_ENEMY=80;
	const GAME_STATE_EVALUATE_ENEMY_MOVE=90;
	const GAME_STATE_EVALUATE_OUTCOME=100;
	const GAME_STATE_ANIMATE_EXPLODE=110;
	const GAME_STATE_CHECK_FOR_GAME_OVER=120;
	const GAME_STATE_PLAYER_WIN=130;
	const GAME_STATE_PLAYER_LOSE=140;
	const GAME_STATE_GAME_OVER=150;
	
	var currentGameState=0;
	var currentGameStateFunction=null;

	//* loading
    let loadCount = 0;
    const itemsToLoad = 23;
    let requestURL; 
    let request; 
    //* screens
    let screenStarted = false;
    //* playfield
    let tileMaps = [];
    let tileSheetOfMap = '';
    const mapIndexOffset = -1;
    const mapRows = 20;
    const mapCols = 30;
    let mapIndex = undefined; 
    const xMin = 0;
	const xMax = mapCols * 32;
	const yMin = 0;
	const yMax = mapRows * 32;
    //* booles
    //let isRun = false;
    //let isPressKey = false;
    //window.isPressKey = isPressKey;
    //* key Presses
    const pressesKeys = new Set();
    window.pressesKeys = pressesKeys;
    //* objects
    let player = {};
    let enemy = [];
    let npc = [];
    let nonStaticNPC = [ enemy, npc ];
    let staticNPC = [];
    //* places Spawn
    let placesSpawnPlayer = [];
    let placesSpawnNonStaticNPC = [];
    let placesSpawnStaticNPC = [];
    //* tiles objects
    let tilesBody = {
        titleTiles: 'body',
        human: {
            walk: {},
            attack: {}
        },
        skeleton: {
            walk: {},
            attack: {}
        }
    };
    let tilesHead = {
        titleTiles: 'head',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesFeet = {
        titleTiles: 'feet',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesLegs = {
        titleTiles: 'legs',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesTorso = {
        titleTiles: 'torso',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesBracers = {
        titleTiles: 'bracers',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesShoulders = {
        titleTiles: 'shoulders',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    let tilesDagger = {
        titleTiles: 'dagger',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    let tilesShield = {
        titleTiles: 'shield',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    let tilesQuiver = {
        titleTiles: 'quiver',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    let tilesDummy = {
        titleTiles: 'dummy',
        type: 'staticNPC',
        idle: {}
    };
    let tilesShieldSpear = {
        titleTiles: 'shield_spear',
        type: 'staticNPC',
        idle: {}
    };

    //* costumes
    const namesCostumes = {
        swordman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', 'dagger' ]
        //others
    };
    const costumeSwordman = [ 'swordman', tilesHead, tilesFeet, tilesLegs, tilesTorso, tilesBracers, tilesShoulders, tilesDagger, namesCostumes ];
    //const weapons = [ tilesDagger, tilesShield, tilesQuiver ];
    const costumeStaticNPC = [ tilesDummy, tilesShieldSpear ];

    function switchGameState( newState ) {

    currentGameState = newState;

    switch ( currentGameState ) {
    
        case GAME_STATE_INIT:
            currentGameStateFunction = gameStateInit;
            break;
        case GAME_STATE_WAIT_FOR_LOAD:
            currentGameStateFunction = gameStateWaitForLoad;
            break;
        case GAME_STATE_TITLE:
            currentGameStateFunction = gameStateTitle;
            break;
        case GAME_STATE_NEW_GAME:
             currentGameStateFunction = gameStateNewGame;
             break;
        case GAME_STATE_RENDER_PLAY_SCREEN:
             currentGameStateFunction = gameStateRenderPlayScreen;
             break;/*
        case GAME_STATE_ANIMATE_PLAYER:
             currentGameStateFunction=gameStateAnimatePlayer;
             break;
        case GAME_STATE_EVALUATE_PLAYER_MOVE:
             currentGameStateFunction=gameStateEvaluatePlayerMove;
             break;
        case GAME_STATE_ENEMY_MOVE:
             currentGameStateFunction=gameStateEnemyMove;
             break;
        case GAME_STATE_ANIMATE_ENEMY:
             currentGameStateFunction=gameStateAnimateEnemy;
             break;
        case GAME_STATE_EVALUATE_ENEMY_MOVE:
             currentGameStateFunction=gameStateEvaluateEnemyMove;
             break;
        case GAME_STATE_EVALUATE_OUTCOME:
            currentGameStateFunction=gameStateEvaluateOutcome;
            break;
        case GAME_STATE_ANIMATE_EXPLODE:
             currentGameStateFunction=gameStateAnimateExplode;
             break;
        case GAME_STATE_CHECK_FOR_GAME_OVER:
            currentGameStateFunction=gameStateCheckForGameOver;
            break;
        case GAME_STATE_PLAYER_WIN:
             currentGameStateFunction=gameStatePlayerWin;
             break;
        case GAME_STATE_PLAYER_LOSE:
             currentGameStateFunction=gameStatePlayerLose;
             break;*/
    
    }

}


        
    function init() {
            canvas.width = this.mapCols * 32;
            canvas.height = this.mapRows * 32;
            this.isRun = true;
            const spawnPlayerX = placesSpawnPlayer[0].x;
            const spawnPlayerY = placesSpawnPlayer[0].y;

            this.spawnPlayer( costume, spawnPlayerX, spawnPlayerY );
            //console.log( this.costume );
            this.spawnObject( costumes_objects );
            this.spawnNpc( costumes_staticNpc );

        }
    function   getItemOfCostume( type ) {
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
    function   getItemOfObject( type ) {
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
    function  getItemOfNpc( type ) {
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


        
    function   spawnPlayer( costumes, x, y ) {
        player[0] = new Player( x, y );
        //Body
        player[1] = new Body( costumes, 'attack', x, y, false );
        player[2] = new Body( costumes, 'walk', x, y, true );
        //costume Walk
        player[3] = new Clothes( costumes, 'walk', 'head', x, y, true );
        player[4] = new Clothes( costumes, 'walk', 'feet', x, y, true );
        player[5] = new Clothes( costumes, 'walk', 'legs', x, y, true );
        player[6] = new Clothes( costumes, 'walk', 'torso', x, y, true );
        player[7] = new Clothes( costumes, 'walk', 'bracers', x, y, true );
        player[8] = new Clothes( costumes, 'walk', 'shoulders', x, y, true );
        //costume Attack
        player[9] = new Clothes( costumes, 'attack', 'head', x, y, false );
        player[10] = new Clothes( costumes, 'attack', 'feet', x, y, false );
        player[11] = new Clothes( costumes, 'attack', 'legs', x, y, false );
        player[12] = new Clothes( costumes, 'attack', 'torso', x, y, false );
        player[13] = new Clothes( costumes, 'attack', 'bracers', x, y, false );
        player[14] = new Clothes( costumes, 'attack', 'shoulders', x, y, false );
        //Weapon
        player[15] = new Weapon( costumes, 'attack', 'dagger', x, y, false );
        //console.log( player );
    }
    function    spawnObject( costumes ) {
        for ( let i = 0; i < placesSpawnNonStaticNPC.length; i++ ) {
            nonStaticNPC[i] = new ObjectOnMap( costumes, 'shield_spear', placesSpawnNonStaticNPC[i].x, this.placesSpawnObject[i].y, true );
        }
        //console.log(this.itemsOfObjects);
    }
    function  spawnNpc( costumes ) {
        for ( let i = 0; i < placesSpawnStaticNPC.length; i++ ) {
            staticNPC[i] = new StaticNpc( costumes, 'combat_dummy', placesSpawnStaticNPC[i].x, this.placesSpawnStaticNpc[i].y, true );
        }
        //console.log( costumes );
    }

    function    renderPlayer() {
        for ( let i = 1; i < player.length; i++ ) {
            if ( typeof player[i] === 'object' ) {
                player[i].render();
            }
        }
    }
    function   renderObjects() {
        for ( let i = 0; i < nonStaticNPC.length; i++ ) {
            if ( typeof nonStaticNPC[i] === 'object' ) {
                nonStaticNPC[i].render();
            }
        }
    }
    function   renderNpc() {
        for ( let i = 0; i < staticNPC.length; i++ ) {
            if ( typeof staticNPC[i] === 'object' ) {
                staticNPC[i].render();
            }
        }
    }
    function   updatePlayer() {
        for ( let i = 0; i < player.length; i++ ) {
            if ( typeof player[i] === 'object' ) {
                player[i].update();
            }
        }

    }

    function  updateObject() {
        for ( let i = 0; i < nonStaticNPC.length; i++ ) {
            if ( typeof nonStaticNPC[i] === 'object' ) {
                nonStaticNPC[i].update();
            }
        }
    }
    
    function   updateNpc() {
        for ( let i = 0; i < staticNPC.length; i++ ) {
            if ( typeof staticNPC[i] === 'object' ) {
                staticNPC[i].update();
            }
        }
    }
/*
    function  drawScreen() {
        frameRateCounter.countFrames();
        frameIndexCounter.countFrames();

        updatePlayer();
        updateObject();
        updateNpc();
        renderMap( 0 );
        renderObjects();
        renderNpc();
        renderPlayer();
    }*/
    class Npc {
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

            if ( this.moveMode === 'run' ) { //'run' this.moveMode === moveMode
                //console.log( this.isAnimate , moveMode );
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

    function gameStateWaitForLoad() {
		//do nothing while loading events occur
		//console.log( "doing nothing..." );
	}

    function gameStateInit() {

        //*** MAP
        tileSheetOfMap = new Image();
        tileSheetOfMap.addEventListener( 'load', itemLoaded , false );
        tileSheetOfMap.src = "tiles/tmw_desert_spacing.png";

        //************** PLAYER COSTUME WALK
        //*body walk
        const tileSheetOfWalks = new Image();
        tileSheetOfWalks.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWalks.src = "tiles/walkcycle/BODY_male.png";
        //add propeties
        tilesBody.human.walk.tileSheet = tileSheetOfWalks;
        tilesBody.human.walk.animFrames = 9;
        //*head walk
        const tileSheetOfHEAD_chain_armor_helmet = new Image();
        tileSheetOfHEAD_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
        tileSheetOfHEAD_chain_armor_helmet.src = "tiles/walkcycle/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesHead.walk.tileSheet = tileSheetOfHEAD_chain_armor_helmet;
        tilesHead.walk.animFrames = 9;
        //*bracers walk
        const tileSheetOfTORSO_leather_armor_bracers = new Image();
        tileSheetOfTORSO_leather_armor_bracers.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_bracers.src = "tiles/walkcycle/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesBracers.walk.tileSheet = tileSheetOfTORSO_leather_armor_bracers;
        tilesBracers.walk.animFrames = 9;
        //*feet walk
        const tileSheetOfFEET_shoes_brown = new Image();
        tileSheetOfFEET_shoes_brown.addEventListener( 'load', itemLoaded , false );
        tileSheetOfFEET_shoes_brown.src = "tiles/walkcycle/FEET_shoes_brown.png";
        //add propeties
        tilesFeet.walk.tileSheet = tileSheetOfFEET_shoes_brown;
        tilesFeet.walk.animFrames = 9;
        //*torso walk
        const tileSheetOfTORSO_leather_armor_torso = new Image();
        tileSheetOfTORSO_leather_armor_torso.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_torso.src = "tiles/walkcycle/TORSO_leather_armor_torso.png";
        //add propeties
        tilesTorso.walk.tileSheet = tileSheetOfTORSO_leather_armor_torso;
        tilesTorso.walk.animFrames = 9;
        //*shoulders walk
        const tileSheetOfTORSO_leather_armor_shoulders = new Image();
        tileSheetOfTORSO_leather_armor_shoulders.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_shoulders.src = "tiles/walkcycle/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesShoulders.walk.tileSheet = tileSheetOfTORSO_leather_armor_shoulders;
        tilesShoulders.walk.animFrames = 9;
        //*legs walk
        const tileSheetOfLEGS_pants_greenish = new Image();
        tileSheetOfLEGS_pants_greenish.addEventListener( 'load', itemLoaded , false );
        tileSheetOfLEGS_pants_greenish.src = "tiles/walkcycle/LEGS_pants_greenish.png";
        //add propeties
        tilesLegs.walk.tileSheet = tileSheetOfLEGS_pants_greenish;
        tilesLegs.walk.animFrames = 9;

        //************** PLAYER COSTUME ATTACK
        //*body attack
        const tileSheetOfBODY_human_attack = new Image();
        tileSheetOfBODY_human_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBODY_human_attack.src = "tiles/slash/BODY_human.png";
        //add propeties
        tilesBody.human.attack.tileSheet = tileSheetOfBODY_human_attack;
        tilesBody.human.attack.animFrames = 6;
        //*head attack
        const tileSheetOfHEAD_chain_armor_helmet_attack = new Image();
        tileSheetOfHEAD_chain_armor_helmet_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfHEAD_chain_armor_helmet_attack.src = "tiles/slash/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesHead.attack.tileSheet = tileSheetOfHEAD_chain_armor_helmet_attack;
        tilesHead.attack.animFrames = 6;
        //*feet attack
        const tileSheetOfFEET_shoes_brown_attack = new Image();
        tileSheetOfFEET_shoes_brown_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfFEET_shoes_brown_attack.src = "tiles/slash/FEET_shoes_brown.png";
        //add propeties
        tilesFeet.attack.tileSheet = tileSheetOfFEET_shoes_brown_attack;
        tilesFeet.attack.animFrames = 6;
        //*legs attack
        const tileSheetOfLEGS_pants_greenish_attack = new Image();
        tileSheetOfLEGS_pants_greenish_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfLEGS_pants_greenish_attack.src = "tiles/slash/LEGS_pants_greenish.png";
        //add propeties
        tilesLegs.attack.tileSheet = tileSheetOfLEGS_pants_greenish_attack;
        tilesLegs.attack.animFrames = 6;
        //*torso attack
        const tileSheetOfTORSO_leather_armor_torso_attack = new Image();
        tileSheetOfTORSO_leather_armor_torso_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_torso_attack.src = "tiles/slash/TORSO_leather_armor_torso.png";
        //add propeties
        tilesTorso.attack.tileSheet = tileSheetOfTORSO_leather_armor_torso_attack;
        tilesTorso.attack.animFrames = 6;
        //*bracers attack
        const tileSheetOfTORSO_leather_armor_bracers_attack = new Image();
        tileSheetOfTORSO_leather_armor_bracers_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_bracers_attack.src = "tiles/slash/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesBracers.attack.tileSheet = tileSheetOfTORSO_leather_armor_bracers_attack;
        tilesBracers.attack.animFrames = 9;
        //*shoulders attack
        const tileSheetOfTORSO_leather_armor_shoulders_attack = new Image();
        tileSheetOfTORSO_leather_armor_shoulders_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_shoulders_attack.src = "tiles/slash/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesShoulders.attack.tileSheet = tileSheetOfTORSO_leather_armor_shoulders_attack;
        tilesShoulders.attack.animFrames = 9;

        //************** WEAPON
        //*dagger
        const tileSheetOfWEAPON_dagger = new Image();
        tileSheetOfWEAPON_dagger.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_dagger.src = "tiles/slash/WEAPON_dagger.png";
        //add propeties
        tilesDagger.attack.tileSheet = tileSheetOfWEAPON_dagger;
        tilesDagger.attack.animFrames = 6;
        //*shield
        const tileSheetOfWEAPON_shield_cutout_chain_armor_helmet = new Image();
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.src = "tiles/walkcycle/WEAPON_shield_cutout_chain_armor_helmet.png";
        //add propeties
        tilesShield.walk.tileSheet = tileSheetOfWEAPON_shield_cutout_chain_armor_helmet;
        tilesShield.walk.animFrames = 9;
        //*quiver
        const tileSheetOfBEHIND_quiver = new Image();
        tileSheetOfBEHIND_quiver.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBEHIND_quiver.src = "tiles/walkcycle/BEHIND_quiver.png";
        //add propeties
        tilesQuiver.walk.tileSheet = tileSheetOfBEHIND_quiver;
        tilesQuiver.walk.animFrames = 9;

        //************** NONSTATIC NPC
        //*body walk
        const tileSheetOfBody_skeleton = new Image();
        tileSheetOfBody_skeleton.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBody_skeleton.src = "tiles/walkcycle/BODY_skeleton.png";
        //add propeties
        tilesBody.skeleton.walk.tileSheet = tileSheetOfBody_skeleton;
        tilesBody.skeleton.walk.animFrames = 9;
        //*body attack
        const tileSheetOfBody_skeleton_attack = new Image();
        tileSheetOfBody_skeleton_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBody_skeleton_attack.src = "tiles/slash/BODY_skeleton.png";
        //add propeties
        tilesBody.skeleton.attack.tileSheet = tileSheetOfBody_skeleton_attack;
        tilesBody.skeleton.attack.animFrames = 6;

        //************** STATIC NPC
        //*combat dummy
        const tileSheetOfCombatDummy = new Image();
        tileSheetOfCombatDummy.addEventListener( 'load', itemLoaded , false );
        tileSheetOfCombatDummy.src = "tiles/combat_dummy/BODY_animation.png";
        //add propeties
        tilesDummy.idle.tileSheet = tileSheetOfCombatDummy;
        tilesDummy.idle.animFrames = 7;
        //*shields_spear
        const tileSheetOfShields_spear = new Image();
        tileSheetOfShields_spear.addEventListener( 'load', itemLoaded , false );
        tileSheetOfShields_spear.src = "tiles/objectsOnMap/WEAPON_spear_2.png";
        //add propeties
        tilesShieldSpear.idle.tileSheet = tileSheetOfShields_spear;
        tilesShieldSpear.idle.animFrames = 1;

        //************** LOAD JSON
        requestURL = 'tiles/tileSheetOfMap.json';
        request = new XMLHttpRequest();
        request.open( 'GET', requestURL );
        request.responseType = 'json';
        request.send();
        
        request.addEventListener( 'load', itemLoaded, false );

        
        switchGameState( GAME_STATE_WAIT_FOR_LOAD );
    }

    function itemLoaded() { //page 545

        loadCount++;
		//console.log("loading:" + loadCount);
        if ( loadCount >= itemsToLoad ) {

            //tileSheetOfMap.removeEventListener( 'load', itemLoaded , false );
            request.removeEventListener( 'load', itemLoaded, false );
            //TODO добавить все removeEventListener
            //*
            //*
            jsonObj = request.response; 
            tileMaps[0] = jsonObj.layers[0].data;
            tileMaps[1] = jsonObj.layers[1].data;
            //console.log( tileMaps );
            placesSpawnPlayer[0] = jsonObj.layers[2].objects[0];
            //console.log( placeSpawnPlayer[0] );
            placesSpawnNonStaticNPC[0] = jsonObj.layers[3].objects[0];
            placesSpawnNonStaticNPC[1] = jsonObj.layers[3].objects[1];
            placesSpawnNonStaticNPC[2] = jsonObj.layers[3].objects[2];
            placesSpawnNonStaticNPC[3] = jsonObj.layers[3].objects[3];
            //console.log(  placesSpawnObject );

            placesSpawnStaticNPC[0] = jsonObj.layers[4].objects[0];
            placesSpawnStaticNPC[1] = jsonObj.layers[4].objects[1];
            placesSpawnStaticNPC[2] = jsonObj.layers[4].objects[2];
            placesSpawnStaticNPC[3] = jsonObj.layers[4].objects[3];
            //console.log(  placesSpawnNpc );
            //console.log( jsonObj.layers.length );

            //console.log( costumeSwordman );
            //console.log( weapons );
            //console.log( costumeStaticNPC );

            switchGameState( GAME_STATE_TITLE );
        }
    }

    function gameStateTitle() {

        if ( !screenStarted ) {
            initCanvas();
            fillBackground();
            setTextStyleTitle();
            
			ctx.fillText  ( "Medieval Simple Game with Tiled", 190, 70 );
			ctx.fillText  ( "Press Enter To Play", 300, 140 );

            screenStarted = true;
        }else{
			//wait for space key click
			if ( pressesKeys.has('Enter') ) {
				//console.log("space pressed");
				switchGameState( GAME_STATE_NEW_GAME );
				screenStarted = false;
			}
        }
    }

    function gameStateNewGame(){
		//score=0;
		//enemy=[];
		//explosions=[];
		//playField=[];
		//items=[];
		//resetPlayer();
		createPlayStage();
		
		switchGameState( GAME_STATE_RENDER_PLAY_SCREEN );
	}
    let head
    function createPlayStage() {
        //!spawns
        player = new HUMAN( tilesBody, costumeSwordman, 200, 200, true, true );
        //npc[0] = new HUMAN( tilesBody, 300, 200, false, true );
        //enemy[0] = new HUMAN( tilesBody, costumeSwordman, weapons, 300, 300, false, true )
        //head = new CLOTHES( costumeSwordman, 'head', 200, 200, true )
        console.log( player );
        console.log('create play field');
    }

    function gameStateRenderPlayScreen() {
        frameRateCounter.countFrames();
        frameIndexCounter.countFrames();
        
        //!check
        //!update
        
        renderPlayScreen();
    }

    function drawPlayField( idMap ) {
        //console.log( tileMaps );
        for ( let rowCtr = 0; rowCtr < mapRows; rowCtr++ ) {
            for ( let colCtr = 0; colCtr < mapCols; colCtr++ ) {
                if ( mapIndex === undefined ) {
                    mapIndex = 0;
                }
                //console.log( 'mapIndex:', mapIndex );
                let tileId = tileMaps[idMap][ mapIndex ] + mapIndexOffset;
                let sourceX = Math.floor( tileId % 8 ) * 33;
                let sourceY = Math.floor( tileId / 8 ) * 33;
                //console.log( sourceX+1, sourceY+1, 'colCtr:', colCtr, 'rowCtr:', rowCtr );
                ctx.drawImage( tileSheetOfMap, sourceX + 1, sourceY + 1, 32, 32, colCtr * 32, rowCtr * 32, 32, 32 );
                mapIndex++;

                if ( mapIndex === tileMaps[idMap].length ) {
                    //console.log( mapIndex );
                    mapIndex = undefined;
                }
            }
        }
    }

    function renderPlayScreen() {
		drawPlayField(0);
        drawFPSCounter();
        player.render();
        player.update()
       // head.render()
       // npc[0].render()
       // enemy[0].render()
		//!drawPlayer();
		//!drawEnemy();
		
	}

    function drawFPSCounter() {
        ctx.fillStyle = 'black';
        ctx.font = '20px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText ( "FPS:" + frameRateCounter.lastFrameCount, 0, 10 ); 
    }

    function initCanvas() {
        canvas.width = xMax;
        canvas.height = yMax;
    }

    function fillBackground() {
		// draw background and text 
		ctx.fillStyle = '#000000';
		ctx.fillRect( xMin, yMin, xMax, yMax );
	}
	
	function setTextStyleTitle() {
		ctx.fillStyle    = '#54ebeb'; 
		ctx.font         = '40px _sans';
		ctx.textBaseline = 'top';
	}



    //* counters
    const frameRateCounter = new FrameRateCounter(1000);
    const frameIndexCounter = new FrameRateCounter(100);
    window.frameIndexCounter = frameIndexCounter;
    
    //* keys handlers
    function keyDownHandler( e ) {
        //console.log( e.code );
        switch ( e.code ) {
            case 'ArrowDown':
                pressesKeys.add( e.code );
               // window.isPressKey = isPressKey
                //isPressKey = true;
                break;
            case 'ArrowUp':
                //isPressKey = true;
                //window.isPressKey = isPressKey
                pressesKeys.add( e.code );
                break;
            case 'ArrowLeft':
               // isPressKey = true;
               // window.isPressKey = isPressKey
                pressesKeys.add( e.code );
                break;
            case 'ArrowRight':
                //isPressKey = true;
                //window.isPressKey = isPressKey
                pressesKeys.add( e.code );
                break;
            case 'Space':
                //isPressKey = true;
                //window.isPressKey = isPressKey
                pressesKeys.add( e.code );
                break;
            case 'Enter':
                //isPressKey = true;
                //window.isPressKey = isPressKey
                pressesKeys.add( e.code );
                break;
            }
    }
    function keyUpHandler( e ) {
        switch ( e.code ) {
            case 'ArrowDown':
                pressesKeys.delete( e.code );
                break;
            case 'ArrowUp':
                pressesKeys.delete( e.code );
                break;
            case 'ArrowLeft':
                pressesKeys.delete( e.code );
                break;
            case 'ArrowRight':
                pressesKeys.delete( e.code );
                break;
            case 'Space':
                pressesKeys.delete( e.code );
                //isPressKey = false;
                break;
            case 'Space':
                pressesKeys.delete( e.code );
                //isPressKey = false;
                break;
            case 'Enter':
                pressesKeys.delete( e.code );
                //isPressKey = false;
                break;
    
        }
    }

    //* слушатели событий
    window.addEventListener( 'keydown', keyDownHandler );
    window.addEventListener( 'keyup', keyUpHandler );
    
    //*** application start
	switchGameState( GAME_STATE_INIT );
    //*** application loop    
    function runGame() {
        currentGameStateFunction();

        window.requestAnimationFrame( runGame );
    }

    runGame();

}

