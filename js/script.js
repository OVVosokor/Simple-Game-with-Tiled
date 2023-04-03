//const { Matter } = require("./matter");

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
    //* Matter module aliases
    let Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Collision = Matter.Collision,
        Detector = Matter.Detector,
        Query = Matter.Query;
    
    window.Engine = Engine;
    window.Bodies = Bodies;
    window.Body = Body;
    window.Collision = Collision;
    window.Composite = Composite;
    window.Query = Query;

    //* create an engine
    let engine = Engine.create();
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
    const itemsToLoad = 33;
    let requestURL_map; 
    let request_map; 
    let requestURL_tiles; 
    let request_tiles; 
    let listOfLayers = [];
    //let layerObjects = [];
    let layers = {
        name: 'layers',
        tileMaps: [],
        layerPlayer: [],
        layerObject: [],
        layerNpc: []
    };
    //window.layers = layers;
    //* screens
    let screenStarted = false;
    //* playfield
    let tileMaps = [];
    let coordsTiles = [];
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
    let isGetCoordsTiles = false;
    //let isRun = false;
    //let isPressKey = false;
    //window.isPressKey = isPressKey;
    //*test booles
    let flagCoordsTiles = false;
    //* key Presses
    const pressesKeys = new Set();
    window.pressesKeys = pressesKeys;
    //* objects
    let player = {};
    let enemys = [];
    //let npc = [];
    //let nonStaticNPC = [ enemys, npc ];
    let staticNPC = [];
    //* places Spawn
    let placesSpawnPlayer = [];
    let placesSpawnNonStaticNPC = [];
    let placesSpawnStaticNPC = [];
    //* walls
    let walls = [];
    //* tiles
    let tiles = []; //TODO rename?
    //* triggers
    let triggers = [];
    //*collision object
    const collisionsObjects = {
        walls: walls,
        tiles: tiles,
        triggers: triggers
    }
    //*collidings
    const collidings = {
        enemys: [],
        tiles: [],
        walls: [],
        triggers: [],
        staticNPC: [],
        summary: []
    };
    //************ tiles objects
    //*slash tiles
    //*body tiles
    /*
    const tilesBody = {
        titleTiles: 'body',
        human: {
            walk: {},
            attack: {}
        },
        skeleton: {
            walk: {},
            attack: {}
        }
    };*/
    const tilesOfBody = {
        titleTiles: 'body',
        human: {
            walk: {},
            attack: {
                slash: {},
                thrust: {}
            }
        },
        skeleton: {
            walk: {},
            attack: {
                slash: {}
            }
        }
    };

    const tilesHead = {
        titleTiles: 'head',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesFeet = {
        titleTiles: 'feet',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesLegs = {
        titleTiles: 'legs',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesTorso = {
        titleTiles: 'torso',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesBracers = {
        titleTiles: 'bracers',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesShoulders = {
        titleTiles: 'shoulders',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    //*thrust tiles
    const tilesHeadThrust = {
        titleTiles: 'head',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesFeetThrust = {
        titleTiles: 'feet',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesLegsThrust = {
        titleTiles: 'legs',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesTorsoThrust = {
        titleTiles: 'torso',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesBracersThrust = {
        titleTiles: 'bracers',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    const tilesShouldersThrust = {
        titleTiles: 'shoulders',
        type: 'clothes',
        walk: {},
        attack: {}
    };
    //*weapons tiles
    const tilesDagger = {
        titleTiles: 'dagger',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    const tilesSpear = {
        titleTiles: 'spear',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    const tilesShield = {
        titleTiles: 'shield',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    const tilesQuiver = {
        titleTiles: 'quiver',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    //*
    const tilesDummy = {
        titleTiles: 'dummy',
        type: 'interacting',
        idle: {}
    };
    //*put-on tiles
    const tilesShieldSpear = {
        titleTiles: 'shield_spear',
        type: 'putOn',
        idle: {}
    };
    //*
    const slashTiles = {
        //body: tilesBody,
        head: tilesHead,
        feet: tilesFeet,
        legs: tilesLegs,
        torso: tilesTorso,
        bracers: tilesBracers,
        shoulders: tilesShoulders
    };
    const thrustTiles = {
        //body: tilesBodyThrust,
        head: tilesHeadThrust,
        feet:tilesFeetThrust,
        legs: tilesLegsThrust,
        torso: tilesTorsoThrust,
        bracers: tilesBracersThrust,
        shoulders: tilesShouldersThrust
    };
    const tilesOfCostume = {
        head: {
            walk: {},
            slash: {},
            thrust: {}
        },
        feet: {
            walk: {},
            slash: {},
            thrust: {}
        },
        legs: {
            walk: {},
            slash: {},
            thrust: {}
        },
        torso: {
            walk: {},
            slash: {},
            thrust: {}
        },
        bracers: {
            walk: {},
            slash: {},
            thrust: {}
        },
        shoulders: {
            walk: {},
            slash: {},
            thrust: {}
        },
        dagger: {
            walk: {},
            attack: {}    
        },
        spear: {
            walk: {},
            attack: {}    
        },
        shield: {
            walk: {},
            attack: {}    
        }
    };
    //* costumes
    const namesCostumes = {
        swordman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', 'dagger' ],
        spearman: [ 'head', 'feet', 'legs', 'torso', 'bracers', 'shoulders', 'shield', 'spear' ]
    };
    const costumes = {
        swordman: [ 'swordman',/* slash.body ,*/ slashTiles.head, slashTiles.feet, slashTiles.legs, slashTiles.torso, slashTiles.bracers, slashTiles.shoulders, [tilesDagger], namesCostumes ],
        spearman: [ 'spearman', /*thrust.body ,*/ thrustTiles.head, thrustTiles.feet, thrustTiles.legs, thrustTiles.torso, thrustTiles.bracers, thrustTiles.shoulders, [tilesShield, tilesSpear], namesCostumes ]
    };

    //const costumeInteractingNPC = [ tilesDummy ];
    //const costumesPutOnNPC = [ tilesShieldSpear ];
    const costumesStaticNPC = {
        interacting: [ tilesDummy ],
        putOn: [ tilesShieldSpear ]
    }
    //const costumeBody = [ 'costume Body' ];

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
        tilesOfBody.human.walk.tileSheet = tileSheetOfWalks;
        tilesOfBody.human.walk.animFrames = 9;
        //*body skeleton walk
        const tileSheetOfBody_skeleton = new Image();
        tileSheetOfBody_skeleton.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBody_skeleton.src = "tiles/walkcycle/BODY_skeleton.png";
        //add propeties
        tilesOfBody.skeleton.walk.tileSheet = tileSheetOfBody_skeleton;
        tilesOfBody.skeleton.walk.animFrames = 9;
        //*head walk
        const tileSheetOfHEAD_chain_armor_helmet = new Image();
        tileSheetOfHEAD_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
        tileSheetOfHEAD_chain_armor_helmet.src = "tiles/walkcycle/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.head.walk.tileSheet = tileSheetOfHEAD_chain_armor_helmet;
        tilesOfCostume.head.walk.animFrames = 9;
        //costumeTiles.head.walk.tileSheet = tileSheetOfHEAD_chain_armor_helmet;
        //*bracers walk
        const tileSheetOfTORSO_leather_armor_bracers = new Image();
        tileSheetOfTORSO_leather_armor_bracers.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_bracers.src = "tiles/walkcycle/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesOfCostume.bracers.walk.tileSheet = tileSheetOfTORSO_leather_armor_bracers;
        tilesOfCostume.bracers.walk.animFrames = 9;
        //*feet walk
        const tileSheetOfFEET_shoes_brown = new Image();
        tileSheetOfFEET_shoes_brown.addEventListener( 'load', itemLoaded , false );
        tileSheetOfFEET_shoes_brown.src = "tiles/walkcycle/FEET_shoes_brown.png";
        //add propeties
        tilesOfCostume.feet.walk.tileSheet = tileSheetOfFEET_shoes_brown;
        tilesOfCostume.feet.walk.animFrames = 9;
        //*torso walk
        const tileSheetOfTORSO_leather_armor_torso = new Image();
        tileSheetOfTORSO_leather_armor_torso.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_torso.src = "tiles/walkcycle/TORSO_leather_armor_torso.png";
        //add propeties
        tilesOfCostume.torso.walk.tileSheet = tileSheetOfTORSO_leather_armor_torso;
        tilesOfCostume.torso.walk.animFrames = 9;
        //*shoulders walk
        const tileSheetOfTORSO_leather_armor_shoulders = new Image();
        tileSheetOfTORSO_leather_armor_shoulders.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_shoulders.src = "tiles/walkcycle/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesOfCostume.shoulders.walk.tileSheet = tileSheetOfTORSO_leather_armor_shoulders;
        tilesOfCostume.shoulders.walk.animFrames = 9;
        //*legs walk
        const tileSheetOfLEGS_pants_greenish = new Image();
        tileSheetOfLEGS_pants_greenish.addEventListener( 'load', itemLoaded , false );
        tileSheetOfLEGS_pants_greenish.src = "tiles/walkcycle/LEGS_pants_greenish.png";
        //add propeties
        tilesOfCostume.legs.walk.tileSheet = tileSheetOfLEGS_pants_greenish;
        tilesOfCostume.legs.walk.animFrames = 9;

        //************** PLAYER COSTUME ATTACK
        //********************slash
        //*body attack
        const tileSheetOfBODY_human_attack = new Image();
        tileSheetOfBODY_human_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBODY_human_attack.src = "tiles/slash/BODY_human.png";
        //add propeties
        tilesOfBody.human.attack.slash.tileSheet = tileSheetOfBODY_human_attack;
        tilesOfBody.human.attack.slash.animFrames = 6;
        //*body skeleton attack
        const tileSheetOfBody_skeleton_attack = new Image();
        tileSheetOfBody_skeleton_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBody_skeleton_attack.src = "tiles/slash/BODY_skeleton.png";
        //add propeties
        tilesOfBody.skeleton.attack.slash.tileSheet = tileSheetOfBody_skeleton_attack;
        tilesOfBody.skeleton.attack.slash.animFrames = 6;
        //*head attack
        const tileSheetOfHEAD_chain_armor_helmet_attack = new Image();
        tileSheetOfHEAD_chain_armor_helmet_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfHEAD_chain_armor_helmet_attack.src = "tiles/slash/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.head.slash.tileSheet = tileSheetOfHEAD_chain_armor_helmet_attack;
        tilesOfCostume.head.slash.animFrames = 6;
        //*feet attack
        const tileSheetOfFEET_shoes_brown_attack = new Image();
        tileSheetOfFEET_shoes_brown_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfFEET_shoes_brown_attack.src = "tiles/slash/FEET_shoes_brown.png";
        //add propeties
        tilesOfCostume.feet.slash.tileSheet = tileSheetOfFEET_shoes_brown_attack;
        tilesOfCostume.feet.slash.animFrames = 6;
        //*legs attack
        const tileSheetOfLEGS_pants_greenish_attack = new Image();
        tileSheetOfLEGS_pants_greenish_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfLEGS_pants_greenish_attack.src = "tiles/slash/LEGS_pants_greenish.png";
        //add propeties
        tilesOfCostume.legs.slash.tileSheet = tileSheetOfLEGS_pants_greenish_attack;
        tilesOfCostume.legs.slash.animFrames = 6;
        //*torso attack
        const tileSheetOfTORSO_leather_armor_torso_attack = new Image();
        tileSheetOfTORSO_leather_armor_torso_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_torso_attack.src = "tiles/slash/TORSO_leather_armor_torso.png";
        //add propeties
        tilesOfCostume.torso.slash.tileSheet = tileSheetOfTORSO_leather_armor_torso_attack;
        tilesOfCostume.torso.slash.animFrames = 6;
        //*bracers attack
        const tileSheetOfTORSO_leather_armor_bracers_attack = new Image();
        tileSheetOfTORSO_leather_armor_bracers_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_bracers_attack.src = "tiles/slash/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesOfCostume.bracers.slash.tileSheet = tileSheetOfTORSO_leather_armor_bracers_attack;
        tilesOfCostume.bracers.slash.animFrames = 6;
        //*shoulders attack
        const tileSheetOfTORSO_leather_armor_shoulders_attack = new Image();
        tileSheetOfTORSO_leather_armor_shoulders_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfTORSO_leather_armor_shoulders_attack.src = "tiles/slash/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesOfCostume.shoulders.slash.tileSheet = tileSheetOfTORSO_leather_armor_shoulders_attack;
        tilesOfCostume.shoulders.slash.animFrames = 6;
        //*********************************thrust
        //*body attack
        const thrustBODY_human_attack = new Image();
        thrustBODY_human_attack.addEventListener( 'load', itemLoaded , false );
        thrustBODY_human_attack.src = "tiles/thrust/BODY_animation.png";
        //add propeties
        tilesOfBody.human.attack.thrust.tileSheet = thrustBODY_human_attack;
        tilesOfBody.human.attack.thrust.animFrames = 8;
        //*head attack
        const thrustHEAD_chain_armor_helmet_attack = new Image();
        thrustHEAD_chain_armor_helmet_attack.addEventListener( 'load', itemLoaded , false );
        thrustHEAD_chain_armor_helmet_attack.src = "tiles/thrust/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.head.thrust.tileSheet = thrustHEAD_chain_armor_helmet_attack;
        tilesOfCostume.head.thrust.animFrames = 8;
        //*feet attack
        const thrustFEET_shoes_brown_attack = new Image();
        thrustFEET_shoes_brown_attack.addEventListener( 'load', itemLoaded , false );
        thrustFEET_shoes_brown_attack.src = "tiles/thrust/FEET_shoes_brown.png";
        //add propeties
        tilesOfCostume.feet.thrust.tileSheet = thrustFEET_shoes_brown_attack;
        tilesOfCostume.feet.thrust.animFrames = 8;
        //*legs attack
        const thrustLEGS_pants_greenish_attack = new Image();
        thrustLEGS_pants_greenish_attack.addEventListener( 'load', itemLoaded , false );
        thrustLEGS_pants_greenish_attack.src = "tiles/thrust/LEGS_pants_greenish.png";
        //add propeties
        tilesOfCostume.legs.thrust.tileSheet = thrustLEGS_pants_greenish_attack;
        tilesOfCostume.legs.thrust.animFrames = 8;
        //*torso attack
        const thrustTORSO_leather_armor_torso_attack = new Image();
        thrustTORSO_leather_armor_torso_attack.addEventListener( 'load', itemLoaded , false );
        thrustTORSO_leather_armor_torso_attack.src = "tiles/thrust/TORSO_leather_armor_torso.png";
        //add propeties
        tilesOfCostume.torso.thrust.tileSheet = thrustTORSO_leather_armor_torso_attack;
        tilesOfCostume.torso.thrust.animFrames = 8;
        //*bracers attack
        const thrustTORSO_leather_armor_bracers_attack = new Image();
        thrustTORSO_leather_armor_bracers_attack.addEventListener( 'load', itemLoaded , false );
        thrustTORSO_leather_armor_bracers_attack.src = "tiles/thrust/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesOfCostume.bracers.thrust.tileSheet = thrustTORSO_leather_armor_bracers_attack;
        tilesOfCostume.bracers.thrust.animFrames = 8;
        //*shoulders attack
        const thrustTORSO_leather_armor_shoulders_attack = new Image();
        thrustTORSO_leather_armor_shoulders_attack.addEventListener( 'load', itemLoaded , false );
        thrustTORSO_leather_armor_shoulders_attack.src = "tiles/thrust/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesOfCostume.shoulders.thrust.tileSheet = thrustTORSO_leather_armor_shoulders_attack;
        tilesOfCostume.shoulders.thrust.animFrames = 8;
        

        //************** WEAPON
        //***** attack
        //*dagger
        const tileSheetOfWEAPON_dagger = new Image();
        tileSheetOfWEAPON_dagger.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_dagger.src = "tiles/slash/WEAPON_dagger.png";
        //add propeties
        tilesOfCostume.dagger.attack.tileSheet = tileSheetOfWEAPON_dagger;
        tilesOfCostume.dagger.attack.animFrames = 6;
        //*shield
        const tileSheetOfWEAPON_shield_cutout_chain_armor_helmet_attack = new Image();
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet_attack.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet_attack.src = "tiles/thrust/WEAPON_shield_cutout_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.shield.attack.tileSheet = tileSheetOfWEAPON_shield_cutout_chain_armor_helmet_attack;
        tilesOfCostume.shield.attack.animFrames = 8;
        //*spear
        const tileSheetOfWEAPON_spear = new Image();
        tileSheetOfWEAPON_spear.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_spear.src = "tiles/thrust/WEAPON_spear.png";
        //add propeties
        tilesOfCostume.spear.attack.tileSheet = tileSheetOfWEAPON_spear;
        tilesOfCostume.spear.attack.animFrames = 8;

        //***** walk
        //*shield
        const tileSheetOfWEAPON_shield_cutout_chain_armor_helmet = new Image();
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWEAPON_shield_cutout_chain_armor_helmet.src = "tiles/walkcycle/WEAPON_shield_cutout_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.shield.walk.tileSheet = tileSheetOfWEAPON_shield_cutout_chain_armor_helmet;
        tilesOfCostume.shield.walk.animFrames = 9;
        //*quiver
        const tileSheetOfBEHIND_quiver = new Image();
        tileSheetOfBEHIND_quiver.addEventListener( 'load', itemLoaded , false );
        tileSheetOfBEHIND_quiver.src = "tiles/walkcycle/BEHIND_quiver.png";
        //add propeties
        tilesQuiver.walk.tileSheet = tileSheetOfBEHIND_quiver;
        tilesQuiver.walk.animFrames = 9;

        //************** NONSTATIC NPC

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
        //*map
        requestURL_map = 'tiles/tileSheetOfMap.json';
        request_map = new XMLHttpRequest();
        request_map.open( 'GET', requestURL_map );
        request_map.responseType = 'json';
        request_map.send();
        request_map.addEventListener( 'load', itemLoaded, false );
        //*tiles
        requestURL_tiles = 'tiles/tmw_desert_spacing.tsj';
        request_tiles = new XMLHttpRequest();
        request_tiles.open( 'GET', requestURL_tiles );
        request_tiles.responseType = 'json';
        request_tiles.send();
        request_tiles.addEventListener( 'load', itemLoaded, false );
        
        switchGameState( GAME_STATE_WAIT_FOR_LOAD );
    }

    function itemLoaded() { //page 545

        loadCount++;
		//console.log("loading:" + loadCount);
        if ( loadCount >= itemsToLoad ) {

            //tileSheetOfMap.removeEventListener( 'load', itemLoaded , false );
            request_map.removeEventListener( 'load', itemLoaded, false );
            //TODO добавить все removeEventListener
            //*
            //*
            //*map
            jsonObj_map = request_map.response;
            //*tiles
            jsonObj_tiles = (request_tiles.response).tiles;
            //console.log( jsonObj_tiles );
            listOfLayers = getLayerName();
            //console.log( listOfLayers );
            getEntityOfLayers();

            tileMaps = layers.tileMaps;
            //console.log( tileMaps );
            placesSpawnPlayer = layers.layerPlayer;
            //console.log( placesSpawnPlayer );
            placesSpawnNonStaticNPC = layers.layerNpc;
            //console.log( placesSpawnNonStaticNPC );
            placesSpawnStaticNPC = layers.layerObject;

            //console.log( costumeSwordman );
            //console.log( weapons );
            //console.log( costumeStaticNPC );

            switchGameState( GAME_STATE_TITLE );
        }
    }

    function getLayerName() {
        let result = [];
        for ( const obj of  jsonObj_map.layers ) {
            result.push( obj.name );
        }
        return result
    }

    function getEntityOfLayers() {
        //*map, places of spawn
        for ( let i = 0; i < listOfLayers.length; i++ ) {
            for ( const obj of  jsonObj_map.layers ) {
                if ( ( obj.name === listOfLayers[i] || obj.name === listOfLayers[i] ) && obj.hasOwnProperty( 'data' ) ) {
                    layers.tileMaps.push( obj.data ); 
                }else
                    if ( obj.name === listOfLayers[i] ) {
                        layers[listOfLayers[i]] = (obj.objects).slice();
                    }
            }
        }
        //*collision objects
        for ( let i = 0; i < jsonObj_tiles.length; i++ ) {
            if ( jsonObj_tiles[i].hasOwnProperty( 'objectgroup' ) ) {
                const tempId = jsonObj_tiles[i].id;
                const tempObj = (jsonObj_tiles[i].objectgroup).objects;
                for ( let j = 0; j < tempObj.length; j++ ) {
                    tempObj[j].id = tempId;
                    tiles.push( tempObj[j] );
                }
                //console.log( tempObj );
                //console.log( tempId );
                //tiles[tempId] = tempObj;
                //tempObj.id = tempId;
                //tiles.push( tempObj )
            }
        }
        //console.log( result );
       // console.log( layers );
        //console.log( collisionsObjects );
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

    let box = {}

    function createPlayStage() {

        const pointSpawnPlayer = {
            x: placesSpawnPlayer[0].x,
            y: placesSpawnPlayer[0].y
        }

        //*spawns
        //player = new HUMAN( tilesBody, costumes, 'swordman', pointSpawnPlayer.x, pointSpawnPlayer.y, true, true ); //{swordman: []}
        player = new HUMAN( tilesOfBody, tilesOfCostume, 'swordman', pointSpawnPlayer, true, true, false ); //{swordman: []}

        console.log( player );

        const pointsSpawnNPC = getPointsSpawnNPC();
        //console.log(  pointsSpawnNPC);
        const pointsSpawnNonStaticNPC = pointsSpawnNPC.pointsSpawnNonStaticNPC;

        for ( let i = 0; i < pointsSpawnNonStaticNPC.length; i++ ) {
            //enemys[i] = new SKELETON( tilesBody, costumes, 'swordman', pointsSpawnNonStaticNPC[i].x, pointsSpawnNonStaticNPC[i].y, false, true );
        }

        //console.log( enemys );
        console.log( costumes );
        console.log( tilesOfCostume );
        staticNPC[0] = new PUT_ON( costumesStaticNPC.putOn[0], costumes, 'spearman', 250, 100, true );
        //console.log( staticNPC );
        //console.log( tilesBody );
        console.log('create play field');
    }

    function getPointsSpawnNPC() {
        //console.log( placesSpawnStaticNPC, placesSpawnNonStaticNPC );
        let pointsSpawnStaticNPC = [];
        let pointsSpawnNonStaticNPC = [];
        //*get points Non Static
        for ( let i = 0; i < placesSpawnNonStaticNPC.length; i++ ) {
            pointsSpawnNonStaticNPC.push( {
                x: placesSpawnNonStaticNPC[i].x,
                y: placesSpawnNonStaticNPC[i].y
            } )
        }
        //*get points Static
        for ( let i = 0; i < placesSpawnStaticNPC.length; i++ ) {
            pointsSpawnStaticNPC.push( {
                x: placesSpawnStaticNPC[i].x,
                y: placesSpawnStaticNPC[i].y
            } )
        }
        let result = {
            pointsSpawnStaticNPC: pointsSpawnStaticNPC,
            pointsSpawnNonStaticNPC: placesSpawnNonStaticNPC
        }
        //console.log( pointsSpawnNonStaticNPC, pointsSpawnStaticNPC );
        //console.log(result);
        return result;
    }

    function gameStateRenderPlayScreen() {
        frameRateCounter.countFrames();
        frameIndexCounter.countFrames();

        //!update
        player.update();
        //!check

        renderPlayScreen();
        checkCollisions();

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
                //console.log( tileId );
                //console.log( sourceX+1, sourceY+1, 'colCtr:', colCtr, 'rowCtr:', rowCtr );
                ctx.drawImage( tileSheetOfMap, sourceX + 1, sourceY + 1, 32, 32, colCtr * 32, rowCtr * 32, 32, 32 );
                mapIndex++;
                //*add coords tiles
                for ( let i = 0; i < collisionsObjects.tiles.length; i++ ) {
                    if ( !isGetCoordsTiles && tileId === collisionsObjects.tiles[i].id ) {
                        let tempObj = new COLLISION( (colCtr * 32) + collisionsObjects.tiles[i].x + collisionsObjects.tiles[i].width/2, 
                            (rowCtr * 32) + collisionsObjects.tiles[i].y + collisionsObjects.tiles[i].height/2,
                            collisionsObjects.tiles[i].width, collisionsObjects.tiles[i].height );

                        coordsTiles.push( tempObj );
                        //console.log( tileId );
                        //console.log( collisionsObjects.tiles[i].id );
                        console.log('GetCoordsTiles');
                    }
                }
                //*test part - start
                /*
                if ( isGetCoordsTiles && !flagCoordsTiles ) {
                    flagCoordsTiles = true;
                    console.log( coordsTiles );
                }
                for ( let i = 0; i < coordsTiles.length; i++) {
                    ctx.strokeRect( coordsTiles[i].x, coordsTiles[i].y, coordsTiles[i].width, coordsTiles[i].height );
                }
                */
                /*
                for ( let i = 0; i < coordsTiles.length; i++) {
                    ctx.strokeRect( colCtr * 32, rowCtr * 32, 32,32 );
                }*/

                //*test part - end
                if ( mapIndex === tileMaps[idMap].length ) {
                    //console.log( mapIndex );
                    mapIndex = undefined;
                    isGetCoordsTiles = true;
                }
            }
        }
    }

    function renderPlayScreen() {
		drawPlayField(0);
        drawFPSCounter();

        //player.update();
		//!drawEnemy();
        renderEnemys();
        //*!staticNPC();
        renderStaticNPC();
        //staticNPC[0].render();
        //staticNPC[0].update();
        //*
        /*
        for (const tile of coordsTiles) {
            tile.render();
        }*/
        //coordsTiles[117].render();
		//!drawPlayer();
        player.render();

        //box.render()
        //*Engine.update
        Engine.update( engine, 1000 / 60 );
	}

    function renderEnemys() {
        for (const enemy of enemys ) {
            enemy.render();
        }
    }
    function renderStaticNPC() {
        for (const item of staticNPC ) {
            item.render();
        }
    }

    function drawFPSCounter() {
        ctx.fillStyle = 'black';
        ctx.font = '20px sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText ( "FPS:" + frameRateCounter.lastFrameCount, 0, 10 ); 
    }

    function checkCollisions() {
        //console.log( pressesKeys );
        //let collidings = [];
        //* check collisions
        if ( pressesKeys.size > 0 && !pressesKeys.has('Space') && !pressesKeys.has('KeyE') ) {
            let playerBody = player.body.hull;
            //* check collision: player - enemys
            let enemysBodys = [];
            for ( let i = 0; i < enemys.length; i++ ) {
                enemysBodys[i] = enemys[i].body.hull;
            }
            collidings.enemys = Query.collides( playerBody, enemysBodys );
            //* check collision: player - tiles
            let tiles = [];
            for ( let i = 0; i < coordsTiles.length; i++ ) {
                tiles[i] = coordsTiles[i].hull;
            }
            //console.log( tiles );
            collidings.tiles = Query.collides( playerBody, tiles );
            //* add summary
            collidings.summary = collidings.enemys.concat( collidings.tiles );
            //console.log( collidings );
            //console.log( collidings.summary );
            //* check collision: player - put-on objects
            let putOnObj = [];
            for ( let i = 0; i < staticNPC.length; i++ ) {
                putOnObj[i] = staticNPC[i].body.hull;
            }
            //console.log( putOnObj );
            collidings.staticNPC = Query.collides( playerBody, putOnObj );
            //console.log( collidings );

            if ( collidings.summary.length > 0 ) {
                for ( let i = 0; i < collidings.summary.length; i++ ) {
                    //console.log( collidings.summary[i].penetration.x );
                    Body.translate( playerBody, {x:collidings.summary[i].penetration.x * -1,y:collidings.summary[i].penetration.y * -1} );  
                    //console.log( player );
                    player.x = player.x + collidings.summary[i].penetration.x;
                    player.y = player.y + collidings.summary[i].penetration.y;
                    return;
                }
            }
        }

        if ( pressesKeys.has('KeyE') ) {
            //console.log( player );
            if ( collidings.staticNPC.length > 0 ) {
                //let tempId = collidings.staticNPC
                for ( let i = 0; i < collidings.staticNPC.length; i++ ) {
                    //console.log( collidings.staticNPC[0].bodyB );
                    let bodyB = collidings.staticNPC[0].bodyB;
                    let tempId = bodyB.id;
                    //console.log(tempId);
                    let tempObj = {};

                    for ( const item of staticNPC ) {
                        //console.log(item.body.hull.id);
                        if (  item.hasOwnProperty( 'body' ) ) {
                            let itemId = item.body.hull.id;
                            if ( tempId === itemId ) {
                                tempObj = item;
                            }
                        }
                    }
                    if ( tempObj.visible ) {
                        //console.log( tempObj );
                        player.setNewWeapon( tempObj );
                        //*delete put-on object
                        
                        staticNPC.splice(0);
                        //console.log( staticNPC );
                    }
                    return;
                }
            }
        }
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
            case 'KeyE':
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
            case 'KeyE':
                //isPressKey = true;
                //window.isPressKey = isPressKey
                pressesKeys.delete( e.code );
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

