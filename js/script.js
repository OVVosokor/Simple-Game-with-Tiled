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
        tileMap = [];
        mapIndex = undefined; //= this.tileMap.length;
        isRun = false;
        frameIndex = 0;
        player;
        itemsOfNpc = [];
        isPressKey = false;
        pressed = new Set();

        init() {
            canvas.width = this.mapCols * 32;
            canvas.height = this.mapRows * 32;
            this.isRun = true;
           // console.log( this.player );
            this.itemsOfNpc[0] = new Npc( tileSheetOfCombatDummy, 8, 50, 50, 100 );
            this.player = new Player( tileSheetOfWalks, 9, 100, 50, 100 );

            //console.log( this.itemsOfNpc[0] );
            gameLoop();
        }
        renderMap() {
            if ( this.isRun ) {
            
                for ( let rowCtr = 0; rowCtr < this.mapRows; rowCtr++ ) {
                    for ( let colCtr = 0; colCtr < this.mapCols; colCtr++ ) {
                        if ( this.mapIndex === undefined ) {
                            this.mapIndex = 0;
                        }
                        /*
                        this.mapIndex++;
                        //console.log( this.tileMap.length );
                        if ( this.mapIndex === this.tileMap.length ) {
                            this.mapIndex = undefined;
                        }*/
                        //console.log( 'mapIndex:', this.mapIndex );
                        let tileId = this.tileMap[ this.mapIndex ] + this.mapIndexOffset;
                       // console.log( 'mapIndex:', this.mapIndex, 'tileID:', this.tileMap[ this.mapIndex ] );
                        let sourceX = Math.floor( tileId % 8 ) * 33;
                        let sourceY = Math.floor( tileId / 8 ) * 33;
                        //console.log( sourceX+1, sourceY+1, 'colCtr:', colCtr, 'rowCtr:', rowCtr );
                        ctx.drawImage( tileSheetOfMap, sourceX + 1, sourceY + 1, 32, 32, colCtr * 32, rowCtr * 32, 32, 32 );

                        this.mapIndex++;
                        //console.log( this.tileMap.length );
                        if ( this.mapIndex === this.tileMap.length ) {
                            this.mapIndex = undefined;
                        }

                    }
                }
            }
        }
        renderObj( tileSheet, animFrames, x, y, delay, isIdle ) {
                let animationFrames = [];
                frameIndexCounter.delay = delay;

                for ( let i = 0; i < animFrames; i++ ) {
                    animationFrames.push( i );
                }

                let sourceX = Math.floor( animationFrames[ this.frameIndex ] % 8 ) * 64;
                let sourceY = Math.floor( animationFrames[ this.frameIndex ] / 8 ) * 64;
                
                ctx.drawImage( tileSheet, sourceX, sourceY, 64, 64, x, y, 64, 64 );

                this.frameIndex = frameIndexCounter.frameIndex;
                //console.log( this.frameIndex );
                if ( this.frameIndex === animationFrames.length ) {
                    this.frameIndex = 0;
                    frameIndexCounter.frameIndex = 0;
                }
        }

        drawScreen() {
            frameRateCounter.countFrames();
            frameIndexCounter.countFrames();
            this.player.update();
            this.renderMap();

            this.player.render();
            this.itemsOfNpc[0].render();
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
        constructor( tileSheet, animFrames, x, y, delay ) {
            this.frameIndex = 0;
            this.tileSheet = tileSheet;
            this.animFrames = animFrames;
            this.x = x;
            this.y = y;
            this.dx = 0;
            this.dy = 0;
            this.delay = delay;
            this.direction = 'down';
            this.sourceDY = 0; //128
            this.moveMode = 'run';
        }
        test() {
            console.log('test!!');
            
        }
        render() {
            let animationFrames = [];
            frameIndexCounter.delay = this.delay;

            for ( let i = 0; i < this.animFrames; i++ ) {
                animationFrames.push( i );
            }

            let sourceX = Math.floor( animationFrames[ this.frameIndex ] % 8 ) * 64;
            let sourceY = Math.floor( animationFrames[ this.frameIndex ] / 8 ) * 64;
            //console.log( typeof this.tileSheet );
            ctx.drawImage( this.tileSheet, sourceX, sourceY + this.sourceDY, 64, 64, this.x, this.y, 64, 64 );

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
        constructor( tileSheet, animFrames, x, y, delay  ) {
            super();
            this.frameIndex = 0;
            this.tileSheet = tileSheet;
            this.animFrames = animFrames;
            this.x = x;
            this.y = y;
            this.dx = 0;
            this.dy = 0;
            this.delay = delay;
            this.direction = 'down';
            this.sourceDY = 128; 
            this.moveMode = 'idle';
        }

        update() {
            if ( game.isPressKey ) {
                //console.log( game.pressed );
                for ( const code of game.pressed.values() ) {
                    if ( game.pressed.has( 'ArrowDown' ) && game.pressed.has( 'ArrowRight' ) ) {
                        this.sourceDY = 192;
                        this.dx = 1;
                        this.dy = 1;
                        break;
                    }else
                        if ( game.pressed.has( 'ArrowDown' ) && game.pressed.has( 'ArrowLeft' ) ) {
                            this.sourceDY = 64;
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
                            this.sourceDY = 192;
                            this.dx = 1;
                            this.dy = 0;
                            break;
                    }
                }
                //console.log( this.y );
                this.x = this.x + this.dx;
                this.y = this.y + this.dy;
            }
        }

        render() {
            super.render();
        }
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
                game.pressed.add( e.code );
                //console.log( game.pressed );
                //console.log('keyPress down');
                //game.player.direction = 'down';
                game.player.moveMode = 'run';
                game.isPressKey = true;
                //console.log(game.player.x)
                break;
            case 'ArrowUp':
                //console.log('keyPress up');
                //game.player.direction = 'up';
                game.player.moveMode = 'run';
                game.isPressKey = true;
                game.pressed.add( e.code );
                //console.log( game.pressed );
                break;
            case 'ArrowLeft':
                //console.log('keyPress left');
                //game.player.direction = 'left';
                game.player.moveMode = 'run';
                game.isPressKey = true;
                game.pressed.add( e.code );
                //console.log( game.pressed );
                break;
            case 'ArrowRight':
                //console.log('keyPress right');
                //game.player.direction = 'right';
                game.player.moveMode = 'run';
                game.isPressKey = true;
                game.pressed.add( e.code );
                //console.log( game.pressed );
                break;
            }
    }
    function mouseKeyUpHandler( e ) {
        switch ( e.code ) {
            case 'ArrowDown':
                //console.log('keyUnPress down');
                //game.player.moveMode = 'idle';
                //game.isPressKey = false;
                game.pressed.delete( e.code );
                if ( game.pressed.size === 0 ) {
                    game.isPressKey = false;
                    game.player.moveMode = 'idle';
                }
                break;
            case 'ArrowUp':
                //console.log('keyUnPress up');
                //game.player.moveMode = 'idle';
                //game.isPressKey = false;
                game.pressed.delete( e.code );
                if ( game.pressed.size === 0 ) {
                    game.isPressKey = false;
                    game.player.moveMode = 'idle';
                }
                break;
            case 'ArrowLeft':
                //console.log('keyUnPress left');
                //game.player.moveMode = 'idle';
                //game.isPressKey = false;
                game.pressed.delete( e.code );
                if ( game.pressed.size === 0 ) {
                    game.isPressKey = false;
                    game.player.moveMode = 'idle';
                }
                break;
            case 'ArrowRight':
                //console.log('keyUnPress right');
                //game.player.moveMode = 'idle';
                //game.isPressKey = false;
                game.pressed.delete( e.code );
                if ( game.pressed.size === 0 ) {
                    game.isPressKey = false;
                    game.player.moveMode = 'idle';
                }
                break;
            }
    }

    //слушатели событий
       // window.addEventListener( 'mousemove', mouseMoveHandler );
        //window.addEventListener( 'mouseup', mouseUpHandler );
    window.addEventListener( 'keydown', mouseKeyDownHandler );
    window.addEventListener( 'keyup', mouseKeyUpHandler );
    
    const tileSheetOfMap = new Image();
    tileSheetOfMap.addEventListener( 'load', itemLoaded , false );
    tileSheetOfMap.src = "tiles/tmw_desert_spacing.png";

    const tileSheetOfCombatDummy = new Image();
    tileSheetOfCombatDummy.addEventListener( 'load', itemLoaded , false );
    tileSheetOfCombatDummy.src = "tiles/BODY_animation.png";

    const tileSheetOfWalks = new Image();
    tileSheetOfWalks.addEventListener( 'load', itemLoaded , false );
    tileSheetOfWalks.src = "tiles/BODY_male.png";


    let requestURL = 'tiles/безымянный.json';
    let request = new XMLHttpRequest();
    request.open( 'GET', requestURL );
    request.responseType = 'json';
    request.send();
    
    request.addEventListener( 'load', itemLoaded, false );
    let loadCount = 0;
    const itemsToLoad = 4;

    function itemLoaded() { //page 545
        loadCount++;
        if ( loadCount >= itemsToLoad ) {
            
            tileSheetOfMap.removeEventListener( 'load', itemLoaded , false );
            request.removeEventListener( 'load', itemLoaded, false );

            jsonObj = request.response; 
            game.tileMap = jsonObj.layers[0].data;
            game.init();
        }
    }

    const game = new Game();
    const frameRateCounter = new FrameRateCounter(1000);
    const frameIndexCounter = new FrameRateCounter(100);



}