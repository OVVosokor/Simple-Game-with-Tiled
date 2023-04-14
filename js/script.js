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
    const itemsToLoad = 41;
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
    const wallsTileId = [ 0,1,2,8,9,10,16,17,18,19,20,30,31,37,38,39,46,47 ];
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
        damageArea: [],
        enemys: [],
        tiles: [],
        walls: [],
        triggers: [],
        staticNPC: [],
        summary: []
    };
    //************ tiles objects
    //*body tiles
    const tilesOfBody = {
        titleTiles: 'body',
        human: {
            walk: {},
            attack: {
                slash: {},
                thrust: {}
            },
            hurt: {}
        },
        skeleton: {
            walk: {},
            attack: {
                slash: {}
            },
            hurt: {}
        }
    };
    const tilesQuiver = {
        titleTiles: 'quiver',
        type: 'weapon',
        walk: {},
        attack: {}
    };
    /*
    const tilesDummy = {
        titleTiles: 'dummy',
        type: 'interacting',
        idle: {}
    };
    //put-on tiles
    const tilesShieldSpear = {
        titleTiles: 'shield_spear',
        type: 'putOn',
        idle: {}
    };*/
    const tilesOfCostume = {
        head: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        feet: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        legs: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        torso: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        bracers: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        shoulders: {
            walk: {},
            slash: {},
            thrust: {},
            hurt: {}
        },
        dagger: {
            walk: {},
            attack: {},
            power: {
                min: 1,
                max: 5
            }    
        },
        spear: {
            walk: {},
            attack: {} ,
            power: {
                min: 1,
                max: 6
            }   
        },
        shield: {
            walk: {},
            attack: {}    
        }
    };
    //const costumeInteractingNPC = [ tilesDummy ];
    //const costumesPutOnNPC = [ tilesShieldSpear ];
    const tilesOfStaticNPC = {
        interacting: {
            dummy: {}
        }, //[ tilesDummy ],
        putOn: {
            spearman: {
                idle: {}
            },
            potions: {
                getLife: {
                    idle: {},
                    givenLife: 1000
                }
            }
        } //[ tilesShieldSpear ]
    }
    const tilesOfActors = {
        nonStatic: tilesOfCostume,
        static: tilesOfStaticNPC
    };


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
                */
            //TODO
            case GAME_STATE_PLAYER_WIN:
                currentGameStateFunction=gameStatePlayerWin;
                break;
            case GAME_STATE_PLAYER_LOSE:
                currentGameStateFunction=gameStatePlayerLose;
                break;
            case GAME_STATE_CHECK_FOR_GAME_OVER:
                currentGameStateFunction=gameStateGameOver;
                break;
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

        //************** COSTUME WALK
        //*body walk
        const tileSheetOfWalks = new Image();
        tileSheetOfWalks.addEventListener( 'load', itemLoaded , false );
        tileSheetOfWalks.src = "tiles/walkcycle/BODY_male.png";
        //add propeties
        tilesOfBody.human.walk.tileSheet = tileSheetOfWalks;
        tilesOfBody.human.walk.animFrames = 9;
        tilesOfBody.human.walk.title = 'body walk';

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
        tilesOfCostume.head.walk.title = 'head walk';
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

        //************** COSTUME ATTACK
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
        tilesOfCostume.head.slash.title = 'head attack';

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
        //******************thrust
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
        //************** COSTUME HURT
        //*body hrt
        const BODY_male = new Image();
        BODY_male.addEventListener( 'load', itemLoaded , false );
        BODY_male.src = "tiles/hurt/BODY_male.png";
        //add propeties
        tilesOfBody.human.hurt.tileSheet = BODY_male;
        tilesOfBody.human.hurt.animFrames = 6;
        tilesOfBody.human.hurt.title = 'body hurt';

        //*body skeleton hurt
        const BODY_skeleton = new Image();
        BODY_skeleton.addEventListener( 'load', itemLoaded , false );
        BODY_skeleton.src = "tiles/hurt/BODY_skeleton.png";
        //add propeties
        tilesOfBody.skeleton.hurt.tileSheet = BODY_skeleton;
        tilesOfBody.skeleton.hurt.animFrames = 6;
        //*head hurt
        const HEAD_chain_armor_helmet = new Image();
        HEAD_chain_armor_helmet.addEventListener( 'load', itemLoaded , false );
        HEAD_chain_armor_helmet.src = "tiles/hurt/HEAD_chain_armor_helmet.png";
        //add propeties
        tilesOfCostume.head.hurt.tileSheet = HEAD_chain_armor_helmet;
        tilesOfCostume.head.hurt.animFrames = 6;
        tilesOfCostume.head.hurt.title = 'head hurt';
        //*bracers hurt
        const TORSO_leather_armor_bracers = new Image();
        TORSO_leather_armor_bracers.addEventListener( 'load', itemLoaded , false );
        TORSO_leather_armor_bracers.src = "tiles/hurt/TORSO_leather_armor_bracers.png";
        //add propeties
        tilesOfCostume.bracers.hurt.tileSheet = TORSO_leather_armor_bracers;
        tilesOfCostume.bracers.hurt.animFrames = 6;
        //*feet hurt
        const FEET_shoes_brown = new Image();
        FEET_shoes_brown.addEventListener( 'load', itemLoaded , false );
        FEET_shoes_brown.src = "tiles/hurt/FEET_shoes_brown.png";
        //add propeties
        tilesOfCostume.feet.hurt.tileSheet = FEET_shoes_brown;
        tilesOfCostume.feet.hurt.animFrames = 6;
        //*torso hurt
        const TORSO_leather_armor_torso = new Image();
        TORSO_leather_armor_torso.addEventListener( 'load', itemLoaded , false );
        TORSO_leather_armor_torso.src = "tiles/hurt/TORSO_leather_armor_torso.png";
        //add propeties
        tilesOfCostume.torso.hurt.tileSheet = TORSO_leather_armor_torso;
        tilesOfCostume.torso.hurt.animFrames = 6;
        //*shoulders hurt
        const TORSO_leather_armor_shoulders = new Image();
        TORSO_leather_armor_shoulders.addEventListener( 'load', itemLoaded , false );
        TORSO_leather_armor_shoulders.src = "tiles/hurt/TORSO_leather_armor_shoulders.png";
        //add propeties
        tilesOfCostume.shoulders.hurt.tileSheet = TORSO_leather_armor_shoulders;
        tilesOfCostume.shoulders.hurt.animFrames = 6;
        //*legs hurt
        const LEGS_pants_greenish = new Image();
        LEGS_pants_greenish.addEventListener( 'load', itemLoaded , false );
        LEGS_pants_greenish.src = "tiles/hurt/LEGS_pants_greenish.png";
        //add propeties
        tilesOfCostume.legs.hurt.tileSheet = LEGS_pants_greenish;
        tilesOfCostume.legs.hurt.animFrames = 6;
        

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
        //tilesDummy.idle.tileSheet = tileSheetOfCombatDummy;
        //tilesDummy.idle.animFrames = 7;
        tilesOfStaticNPC.interacting.dummy.tileSheet = tileSheetOfCombatDummy;
        tilesOfStaticNPC.interacting.dummy.animFrames = 7;
        //*shields_spear
        const tileSheetOfShields_spear = new Image();
        tileSheetOfShields_spear.addEventListener( 'load', itemLoaded , false );
        tileSheetOfShields_spear.src = "tiles/objectsOnMap/WEAPON_spear_2.png";
        //add propeties
        //tilesShieldSpear.idle.tileSheet = tileSheetOfShields_spear;
        //tilesShieldSpear.idle.animFrames = 1;
        tilesOfStaticNPC.putOn.spearman.idle.tileSheet = tileSheetOfShields_spear;
        tilesOfStaticNPC.putOn.spearman.idle.animFrames = 1;
        //************************potions
        //*getLife
        const tileSheetOfPotions = new Image();
        tileSheetOfPotions.addEventListener( 'load', itemLoaded , false );
        tileSheetOfPotions.src = "tiles/potions/pt3.png";
        //add propeties
        //tilesShieldSpear.idle.tileSheet = tileSheetOfPotions;
        //tilesShieldSpear.idle.animFrames = 1;
        tilesOfStaticNPC.putOn.potions.getLife.idle.tileSheet = tileSheetOfPotions;
        tilesOfStaticNPC.putOn.potions.getLife.idle.animFrames = 1;
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
        if ( loadCount === itemsToLoad ) {

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
        console.log( jsonObj_tiles );
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
    let graphNode = {}
    let graph = {}
    let nodes = []
    function createPlayStage() {

        const pointSpawnPlayer = {
            x: placesSpawnPlayer[0].x,
            y: placesSpawnPlayer[0].y
        }

        //*spawns
        //player = new HUMAN( tilesBody, costumes, 'swordman', pointSpawnPlayer.x, pointSpawnPlayer.y, true, true ); //{swordman: []}
        player = new HUMAN( tilesOfBody, tilesOfCostume, 'spearman', pointSpawnPlayer, true, true, false ); //{swordman: []}

        //*set name of player
        player.name = 'Warrior';
        console.log( player );

        const pointsSpawnNPC = getPointsSpawnNPC();
        //console.log(  pointsSpawnNPC);
        const pointsSpawnNonStaticNPC = pointsSpawnNPC.pointsSpawnNonStaticNPC;
        const pointsSpawnStaticNPC = pointsSpawnNPC.pointsSpawnStaticNPC;
        //console.log(pointsSpawnNonStaticNPC);
        for ( let i = 0; i < pointsSpawnNonStaticNPC.length; i++ ) {
            enemys[i] = new SKELETON( tilesOfBody, tilesOfCostume, 'swordman', pointsSpawnNonStaticNPC[i], false, true, false );
        }
        //console.log( enemys );
        //console.log( costumes );
        //console.log( tilesOfCostume );
        //console.log( tilesOfActors );
        //staticNPC[0] = new PUT_ON( tilesOfStaticNPC.putOn.shieldSpear, tilesOfCostume, 'spearman', 250, 100, true );
        for ( let i = 0; i < pointsSpawnStaticNPC.length; i++ ) {
            if ( i === 0 ) {
                staticNPC[i] = new PUT_ON( tilesOfStaticNPC, tilesOfActors, 'spearman', pointsSpawnStaticNPC[i], true );
            }
            if ( i === 1 ) {
                staticNPC[i] = new PUT_ON( tilesOfStaticNPC, tilesOfActors, 'getLife', pointsSpawnStaticNPC[i], true );
                //console.log( staticNPC[i] );
            }
        }
        //console.log( staticNPC );
        //console.log( tilesBody );
        console.log( collisionsObjects );
        //let collide = Query.point( [player.body.hull], {x:180, y:370} /*result*/ );
        //console.log( collide );
        //TODO 
        /*
        *создаем сетку: каждый тайл делим на 4 квадрата, его вершины - узлы 
        * удаляем повторяющиеся узлы
        * удаляем узлы, если они принадлежат стенам
        * удаляем узлы на краю игрового поля
        */
        //graphNode = new GRAPH_NODE( 200,200 );
        setCoordsOfColTiles();
        //graph = new GRAPH( coordsTiles );
        //*create graph grid
        nodes = createGraphGrid()
        console.log( coordsTiles );
        //console.log( collisionsObjects.tiles );
        console.log('create play field');
    }

    function createGraphGrid() {
        let result = [];
        let tempMapCols = mapCols// + mapCols;
        let tempMapRows = mapRows //+ mapRows;
        let mapIndex = undefined;

        for ( let rowCtr = 0; rowCtr < mapRows; rowCtr++ ) {
            for ( let colCtr = 0; colCtr < mapCols; colCtr++ ) {
                if ( mapIndex === undefined ) {
                    mapIndex = 0;
                }
                let tileId = tileMaps[0][ mapIndex ] //+ mapIndexOffset;
                mapIndex++;
                //console.log( tileId );
                let tempResult = {};
                //*set coords
                tempResult.x = colCtr*32//+16;
                tempResult.y = rowCtr*32//+16;
                tempResult.id = tileId;
                tempResult.isWalkable = true;
                //*
                for ( let i = 0; i < collisionsObjects.tiles.length; i++ ) {
                    if ( tileId-1 === collisionsObjects.tiles[i].id ) {
                        tempResult.id = tileId;
                        tempResult.isWalkable = false;
                    }
                }

                if ( tempResult.x === xMin || tempResult.y === yMin ) {
                    continue;
                }

                //*create matter body
                tempResult.body = new Bodies.circle( tempResult.x, tempResult.y, 4, { isStatic: true } );
                
                //*push to result
                result.push( tempResult );
                

                if ( mapIndex === tileMaps[0].length ) {
                    mapIndex = undefined;
                }
            }
        }
        //*check collide with walls
        let tiles = [];
        for ( let i = 0; i < coordsTiles.length; i++ ) {
            tiles[i] = coordsTiles[i].hull;
        }
        //console.log( tiles );
        let flag = true;

        while ( flag ) {
            let tempFlag = false;

            for ( let i = 0; i < result.length; i++ ) {
                let collide = Query.point( tiles, result[i] );  

                if ( collide.length > 0 ) {
                    //console.log( collide );
                    result.splice(i,1);
                }
                if ( collide.length > 1 && !tempFlag ) {
                    tempFlag = true;
                }
                if ( tempFlag ) {
                    flag = true;
                }else{
                    flag = false;
                }
                //console.log( flag );
            }
        }
        //console.log( coordsTiles );
        console.log( result );
        return result;
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
        updateEnemys();
        //!check

        renderPlayScreen();
        checkCollisions();

    }
    //*set coords collision tiles (walls)
    function setCoordsOfColTiles() {
        for ( let rowCtr = 0; rowCtr < mapRows; rowCtr++ ) {
            for ( let colCtr = 0; colCtr < mapCols; colCtr++ ) {
                if ( mapIndex === undefined ) {
                    mapIndex = 0;
                }
                //console.log( 'mapIndex:', mapIndex );
                let tileId = tileMaps[0][ mapIndex ] + mapIndexOffset;
                mapIndex++;

                //*add coords tiles
                if ( !isGetCoordsTiles  ) {
                    for ( let i = 0; i < collisionsObjects.tiles.length; i++ ) {
                        if ( !isGetCoordsTiles && tileId === collisionsObjects.tiles[i].id ) {
                            let tempObj = new COLLISION( Math.round((colCtr * 32) + collisionsObjects.tiles[i].x + collisionsObjects.tiles[i].width/2), 
                                Math.round((rowCtr * 32) + collisionsObjects.tiles[i].y + collisionsObjects.tiles[i].height/2),
                                Math.round(collisionsObjects.tiles[i].width), Math.round(collisionsObjects.tiles[i].height) );

                            coordsTiles.push( tempObj );
                            //console.log( tileId );
                            //console.log( collisionsObjects.tiles[i].id );
                            //console.log( coordsTiles );
                            console.log('GetCoordsTiles');
                        }
                    }
                }
                if ( mapIndex === tileMaps[0].length ) {
                    //console.log( mapIndex );
                    mapIndex = undefined;
                    isGetCoordsTiles = true;
                }
            }
        }
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
                /*
                //*add coords tiles
                if ( !isGetCoordsTiles ) {
                for ( let i = 0; i < collisionsObjects.tiles.length; i++ ) {
                    if ( tileId === collisionsObjects.tiles[i].id ) {
                        let tempObj = new COLLISION( (colCtr * 32) + collisionsObjects.tiles[i].x + collisionsObjects.tiles[i].width/2, 
                            (rowCtr * 32) + collisionsObjects.tiles[i].y + collisionsObjects.tiles[i].height/2,
                            collisionsObjects.tiles[i].width, collisionsObjects.tiles[i].height );

                        coordsTiles.push( tempObj );
                        //console.log( tileId );
                        //console.log( collisionsObjects.tiles[i].id );
                        //console.log( coordsTiles );
                        console.log('GetCoordsTiles');
                    }
                }
            }*/
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
        //graphNode.render()
        //graph.render()
        
        for (const tile of coordsTiles) {
            tile.render();
        }
        for ( const node of nodes ) {
            ctx.beginPath();
            ctx.arc( node.x, node.y, 1, 0, 2 * Math.PI);
            ctx.strokeStyle = 'blue';
            ctx.stroke();
        }

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
    function updateEnemys() {
        for (const enemy of enemys ) {
            enemy.update();
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
        let playerBody = player.body.hull;
        let playerDamageArea = player.damage.area.hull;

        if ( /*pressesKeys.size > 0 && */!pressesKeys.has('Space') && !pressesKeys.has('KeyE') ) {
            //let playerBody = player.body.hull;
            //* check collision: player - enemys
            let enemysBodys = [];
            for ( let i = 0; i < enemys.length; i++ ) {
                enemysBodys[i] = enemys[i].body.hull;
            }
            collidings.enemys = Query.collides( playerBody, enemysBodys );
            //* check collision of damage area: player - enemys
            let enemysDamageArea = [];
            for ( let i = 0; i < enemys.length; i++ ) {
                enemysDamageArea[i] = enemys[i].damage.area.hull;
            }
            collidings.damageArea = Query.collides( playerDamageArea, enemysDamageArea );
            //console.log( collidings.damageArea );
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
           // console.log( collidings );
            //* check summury collisions
            if ( collidings.summary.length > 0 && pressesKeys.size > 0 ) {
                for ( let i = 0; i < collidings.summary.length; i++ ) {
                    //console.log( collidings.summary[i].penetration.x );
                    Body.translate( playerBody, {x:collidings.summary[i].penetration.x * -1,y:collidings.summary[i].penetration.y * -1} ); 
                    Body.translate( playerDamageArea, {x:collidings.summary[i].penetration.x * -1,y:collidings.summary[i].penetration.y * -1} );  

                    //console.log( player );
                    //console.log( collidings.summary[i].penetration.x );
                    player.x = player.x + collidings.summary[i].penetration.x;
                    player.y = player.y + collidings.summary[i].penetration.y;

                }
            }
        }
        //*  check staticNPC collisions
        if ( pressesKeys.has('KeyE') ) {
            //console.log( player );
            if ( collidings.staticNPC.length > 0 ) {
                for ( let i = 0; i < collidings.staticNPC.length; i++ ) {
                    let tempObj = getCollidingActor( 'staticNPC' );
                    if ( tempObj[i].actorB.visible ) { 
                        let index = 0;
                        switch ( tempObj[i].actorB.type ) {
                            case 'costume':
                                //console.log( tempObj );
                                player.setNewWeapon( tempObj[i] );
                                //*delete put-on object
                                index = getIndexOfArray( staticNPC, 'costume' )
                                staticNPC.splice(index,1);
                                break;
                            case 'potion':
                                //console.log( tempObj );
                                player.getPotion( tempObj[i] );
                                //*delete put-on object
                                index = getIndexOfArray( staticNPC, 'potion' )
                                staticNPC.splice(index,1);
                                //staticNPC.splice(i,1);
                                break;
                        }
                        console.log( staticNPC );
                    }
                }
            }
        }
        //* check enemys damage collisions
        if ( collidings.damageArea.length > 0 ) { //так как массив > 0, то не отключается атака если уже он не касается, а касается другой
            let collidingActors = getCollidingActor( 'damageArea', true );
            //console.log( collidingActors );
            for ( const collidingActor of collidingActors ) {
                collidingActor.actorB.toAttack( collidingActor );
                collidingActor.actorA.getAttackedActor( collidingActors );
            }
            //*get a list of enemies that do not intersect
            let tempEnemys = enemys.slice();
            for ( const collidingActor of collidingActors ) {
                for ( let i = 0; i < tempEnemys.length; i++ ) {
                    if ( tempEnemys[i] === collidingActor.actorB ) {
                        tempEnemys.splice( i, 1 );
                    }
                }
            }
            //console.log( tempEnemys );
            for ( const enemy of tempEnemys ) {
                if ( enemy.isAttack ) {
                    enemy.toNotAttack();
                }
            }
        }else{
            for ( const enemy of enemys ) {
                if ( enemy.isAttack ) {
                    enemy.toNotAttack();
                }
            }
        }
    }
    //*get index of array by property
    function getIndexOfArray( array, type ) {
        //let items = array;
        let result = undefined;
        //console.log( array );
        for ( let i = 0; i < array.length; i++ ) {
            if ( array[i].type === type ) {
                console.log( array[i] );
                result = i;
            }
        }
        return result;
    }
    //*get colliding Actor - Player
    function getCollidingActor( typeOfActor, isFindDamageArea ) {
        let items = [];
        let result = [];
        switch ( typeOfActor ) {
            case 'staticNPC':
                items = staticNPC;
                //console.log( items );
                break;
            case 'enemys':
                items = enemys;
                //console.log( items );
                break;
            case 'damageArea':
                items = enemys;
                //console.log( items );
                break;
            }
        for ( const item of collidings[typeOfActor] ) {
        
            let tempResult = {actorA: {}, actorB: {}, normal: {}};
            let bodyB = item.bodyB; 
            let tempIdBodyB = bodyB.id;
            //let actorB = {};
            tempResult.normal = item.normal;
            //console.log( normal );
            //*get actorB
            for ( const item of items ) {
                if (  item.hasOwnProperty( 'body' ) ) {
                    let itemId = item.body.hull.id;
                    if ( tempIdBodyB === itemId ) {
                        tempResult.actorB = item;
                    }
                }
                if ( item.hasOwnProperty( 'damage' ) && isFindDamageArea ) {
                    let itemId = item.damage.area.hull.id;
                    if ( tempIdBodyB === itemId ) {
                        tempResult.actorB = item;
                    }
                }
            }
            //*get actorA (player)
            tempResult.actorA = player;
            result.push( tempResult );
        }
        //console.log( result );
        return result;
    }

    function initCanvas() {
        canvas.width = xMax;
        canvas.height = yMax;
    }

    function fillBackground() {
		// draw background
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
            case 'KeyA':
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
            case 'KeyA':
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

