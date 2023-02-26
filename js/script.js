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


    //цикл игры
    function gameLoop() {
        //game.drawScreen();
        ctx.rect( 0,0,200,200 )
        ctx.fill()
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

    //const game = new Game();

    //game.init();
    gameLoop();


}