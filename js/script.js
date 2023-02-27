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

    let mouseMoveCoords = {
        x: 0,
        y: 0
    };
    let mouseClickCoords = {
        x: 0,
        y: 0
    };
    class Game {
        mapIndexOffset =-1;
        mapRows = 20;
        mapCols = 30;
        tileMap = [];
        mapIndex = undefined; //= this.tileMap.length;
        isRun = false;

        constructor() {
        
        }
        init() {
            canvas.width = this.mapCols * 32;
            canvas.height = this.mapRows * 32;
            //console.log( canvas.width );
            this.isRun = true;
            this.drawScreen();
        }

        drawScreen() {
            if ( this.isRun ) {
            
                for ( let rowCtr = 0; rowCtr < this.mapRows; rowCtr++ ) {
                    for ( let colCtr = 0; colCtr < this.mapCols; colCtr++ ) {
                        if ( this.mapIndex === undefined ) {
                            this.mapIndex = 0;
                        }
                        this.mapIndex++;
                        //console.log( this.tileMap.length );
                        if ( this.mapIndex === this.tileMap.length ) {
                            this.mapIndex = undefined;
                        }
                        //console.log( 'mapIndex:', this.mapIndex );
                        let tileId = this.tileMap[ this.mapIndex ] + this.mapIndexOffset;
                        //console.log( 'mapIndex:', this.mapIndex, 'tileID:', this.tileMap[ this.mapIndex ] );
                        let sourceX = Math.floor( tileId % 8 ) * 33;
                        let sourceY = Math.floor( tileId / 8 ) * 33;
                        //console.log( sourceX+1, sourceY+1, 'colCtr:', colCtr, 'rowCtr:', rowCtr );
                        ctx.drawImage( tileSheet, sourceX + 1, sourceY + 1, 32, 32, colCtr * 32, rowCtr * 32, 32, 32 );
                    }
                }
        }
        }

    }

    //цикл игры
    function gameLoop() {
        game.drawScreen();

        window.requestAnimationFrame( gameLoop );
    }

    //обработчики событий
    function mouseMoveHandler( e ) {
        mouseMoveCoords.x = e.offsetX;
        mouseMoveCoords.y = e.offsetY;
    }

    function mouseUpHandler( e ) {
            mouseClickCoords.x = e.offsetX;
            mouseClickCoords.y = e.offsetY;
    }
    //слушатели событий
        //canvas.addEventListener( 'mousemove', mouseMoveHandler );
       // canvas.addEventListener( 'mouseup', mouseUpHandler );
    
    let tileSheet = new Image();
    tileSheet.addEventListener( 'load', imageLoad , false );
    tileSheet.src = "tiles/tmw_desert_spacing.png";
    let jsonObj = {};
    let requestURL = 'tiles/безымянный.json';
    let request = new XMLHttpRequest();
    request.open( 'GET', requestURL );
    request.responseType = 'json';
    request.send();
    
    request.addEventListener( 'load', jsonLoad, false );

    let arrLoad = [];

    function jsonLoad() {
        arrLoad.push( 'true' ); 
        jsonObj = request.response; 
        game.tileMap = jsonObj.layers[0].data;
    }
    function imageLoad() {
        arrLoad.push( 'true' ); 
    }
    //проверяем загрузились или нет картинки через 1 секунду
    setTimeout( ()=> {
        if ( arrLoad.length === 2 ) {
            game.init();
            //console.log( arrLoad );
            //gameLoop();
        }else{
            console.log("images don't loaded");
        }
    }, 1000 ); 
    



    const game = new Game();

    //game.init();
    gameLoop();


}