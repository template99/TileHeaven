// fresh match 3 lib

// The function gets called when the window is fully loaded
window.onload = function() {
    // Get the canvas and context
    console.log('window onload loaded');
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");


    // Level object
    var level = {
        x: 250,         // X position of canvas?
        y: 113,         // Y position
        tiles: [],      // The two-dimensional tile array
        score: 0,
        colorInPlay: -1, // positive - tileColor when clicked
        totalTurns: 0
    };

    // constants
    var XCANVASOFFSET=  250         // X position of canvas?(for coords 0,0)
    var YCANVASOFFSET=  113         // Y position
    var TOTALCOLUMNS=  8     // Number of tile columns
    var TOTALROWS=  8        // Number of tile rows
    var TILEWIDTH=  40  // Visual width of a tile
    var TILEHEIGHT=  40 // Visual height of a tile    

    var Buttons = [ { x: 30, y: 270, width: 150, height: 50, text: "New Game"},
                    { x: 30, y: 330, width: 150, height: 50, text: "Refresh tiles"}];    


    // Game states
    var gamestates = { init: 0, ready: 1, resolve: 2, inprogress: 3 };
    var gamestate = gamestates.init;       

    // are we using this?
    const myTileTypes = {
        plainTile: Symbol("plainTile"),
        empty: Symbol("empty"),
        Bomb: Symbol("bomb"),
        Unknown: Symbol("unknown")
    }

    // TODO: can toggle diversity level
    // with wrapper function
    var tilecolors = [[0, 22, 128],
                      [128, 255, 255],
                      [255, 1, 255],
                      [50, 255, 255],
                      [255, 155, 4]];    




    // trying to incorporate
    class gameTile
     {
        constructor(xcor,ycor){
            this.xcor = xcor;  // fraw ints(0,1,2,3)
            this.ycor = ycor;            
            this.markedForPlay = false; // mark when it will be eliminated
            this.tileType = myTileTypes.plainTile;
            this.tileColor  = returnRandomTileColor(); 
            //console.log(`fresh tile color ${this.tileColor}`);
        }

        // in play!
        markTileToDelete()
        {
            console.log(`  tile ${this.xcor},${this.ycor} marked`);
            this.markedForPlay = true;
        }

        eraseTile()
        {
            this.tileColor = -1;
            this.tileType = myTileTypes.empty;
            this.markedForPlay = false; // might need to change later
            console.log(`&&  tile ${this.xcor},${this.ycor} erased`);
        }

        Regenerate(){ 
            this.markedForPlay = false;
            this.tileType = myTileTypes.plainTile;
            this.tileColor  = returnRandomTileColor();  // redraw itself maybe?
        }


    }

    function startNewGame(){
        console.log('starting new game');
        level.totalTurns = 0; 
        regenerateTiles(); 
        level.targetColor = -1;        
        drawTheGrid(); 
        gamestate = gamestates.inprogress;
    }


    //outer function
    function drawGUI(){
        console.log("drawing whole GUI");        
        drawGridFrame();
        drawButtons();  
        drawTheGrid(); // draw tile grid(done repeatedly)
    }



    // Draw a frame with a border
    // blanks it all out
    // fun first?
    function drawGridFrame() {
        console.log('drawing grid frame');
        context.fillStyle = "#d0d0d0";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#e8eaec";
        context.fillRect(1, 1, canvas.width-2, canvas.height-2);

        // Draw header block
        context.fillStyle = "#603030";
        context.fillRect(0, 0, canvas.width, 65);

        // Draw title
        context.fillStyle = "#ffffff";
        context.font = "24px Verdana";
        context.fillText("Match 3 Game", 10, 30);
        console.log('drawing grid frame FINISHED');
    }

    // Draw buttons
    // runs quite often
    function drawButtons() {
        for (var thisButton=0; thisButton<Buttons.length; thisButton++) {
            context.fillStyle = "#000000";
            context.fillRect(Buttons[thisButton].x, Buttons[thisButton].y, Buttons[thisButton].width, Buttons[thisButton].height);

            context.fillStyle = "#ffffff";
            context.font = "18px Verdana";
            var textdim = context.measureText(Buttons[thisButton].text);
            context.fillText(Buttons[thisButton].text, Buttons[thisButton].x + (Buttons[thisButton].width-textdim.width)/2, Buttons[thisButton].y+30);
        }
    }    

    
    // Get the mouse position
    function getMousePosition(canvas, event) {
        var boundingRectangle = canvas.getBoundingClientRect();
        return {
            x: Math.round((event.clientX - boundingRectangle.left)/(boundingRectangle.right - boundingRectangle.left)*canvas.width),
            y: Math.round((event.clientY - boundingRectangle.top)/(boundingRectangle.bottom - boundingRectangle.top)*canvas.height)
        };        
    }


    // get exact function coordinates
    // NOW WORKS
    // old code:
    function getTileCoordinate(column, row, columnOffset, rowOffset) {
        var thisTile = level.tiles[column][row];   
        var translatedTileX =  thisTile.xcor + (column + columnOffset) * TILEWIDTH;
        var translatedTileY = thisTile.ycor + (row + rowOffset) * TILEHEIGHT;  
        return { tilex: translatedTileX, tiley: translatedTileY};
    }


    // draw grid tiles
    // the outer loop
    function drawTheGrid(){
        //console.log('drawing the grid of tiles');        
        for (var column=0; column<TOTALCOLUMNS; column++) {
            for (var row=0; row<TOTALROWS; row++) {
                        drawTile(row,column);                    
                }
            }
    }

    // for new games
    function regenerateTiles(){
        for (var column=0; column<TOTALCOLUMNS; column++) {
            for (var row=0; row<TOTALROWS; row++) {
                        level.tiles[column][row].Regenerate();
                }
            } 
    }


    function drawTile(x,y){
        //console.log(`drawing tile x:${x} y:${y}`);
        var myCoordinates = getTileCoordinate(x, y, 6, 3);     
        if (level.tiles[x][y].tileType  == myTileTypes.plainTile)
        {
            var thisTile = level.tiles[x][y];            
            var redValue = tilecolors[thisTile.tileColor][0];
            var blueValue = tilecolors[thisTile.tileColor][1];
            var greenValue = tilecolors[thisTile.tileColor][2];
            
            context.fillStyle = "rgb(" +  redValue  + "," + blueValue + "," + greenValue + ")"; 
            context.fillRect(myCoordinates.tilex + 2, myCoordinates.tiley + 2, TILEWIDTH - 4, TILEHEIGHT - 4); 
        }
        else if (level.tiles[x][y].tileType == myTileTypes.empty){
            //console.log(`empty `);
            context.fillStyle = "#d0d0d0";
            context.fillRect(myCoordinates.tilex + 2, myCoordinates.tiley + 2, TILEWIDTH - 4, TILEHEIGHT - 4); 
        }
        else if (level.tiles[x][y].tileType == myTileTypes.Bomb){
            console.log('bomb');
        }

    }


    // Draw a tile.
    // needs whole object passed in
    // note: don't need to really pass in object
    function drawTile_old(x, y, tileObject) {
        var redValue = tilecolors[tileObject.tileColor][0];
        var blueValue = tilecolors[tileObject.tileColor][1];
        var greenValue = tilecolors[tileObject.tileColor][2];
        context.fillStyle = "rgb(" +  redValue  + "," + blueValue + "," + greenValue + ")"; // set color
        context.fillRect(x + 2, y + 2, TILEWIDTH - 4, TILEHEIGHT - 4); // actual drawing function
    }


    // graphics library
    // TODO: tweakable diversity
    function returnRandomTileColor() {
        var myValue = Math.floor(Math.random() * tilecolors.length); 
        //console.log(`returnrandomtilecolor: myvalue: ${myValue}`);
        return myValue;
    }    


    // ENTRY POINT
    function init()
    {   
        console.clear(); 
        console.log("MAIN INIT");
        canvas.addEventListener("mousedown", onMouseDown);  
        // initialize the tile grid(mandatory)
        for (var thisColumn=0; thisColumn<TOTALCOLUMNS; thisColumn++) {
            level.tiles[thisColumn] = []; // fresh row init(mandatory)
            for (var thisRow=0; thisRow<TOTALROWS; thisRow++) {
                level.tiles[thisColumn][thisRow] =  new gameTile(thisColumn,thisRow); 
                //level.tiles[thisColumn][thisRow].tileColor = returnRandomTileColor();
            }
        }        

        regenerateTiles(); // fresh board
        console.log('init FINISHED');
        drawGUI(); // works
        gamestate = gamestates.ready;
    }




    // CLICK FUNCTION EVENT
    function onMouseDown(event){
        var mousePos = getMousePosition(canvas, event); // Get the mouse position
        mt = getMouseTile(mousePos);
        // GAME BUTTON CLICK
        for (var aGameButton=0; aGameButton<Buttons.length; aGameButton++) {
            if (mousePos.x >= Buttons[aGameButton].x && mousePos.x < Buttons[aGameButton].x+Buttons[aGameButton].width &&
                mousePos.y >= Buttons[aGameButton].y && mousePos.y < Buttons[aGameButton].y+Buttons[aGameButton].height)
                 {
                    if (aGameButton == 0) {
                        startNewGame();
                    } else if (aGameButton == 1) {
                        drawTheGrid();
                    } 
            }
        }
        // TODO:
        // you can refresh things here

    }
    

    // Get the tile under the mouse
    // keep this one
    function getMouseTile(position) {
        var mouseX = Math.floor((position.x - level.x) / TILEWIDTH);
        var mouseY = Math.floor((position.y - level.y) / TILEHEIGHT);
        // Check if the tile is valid
        if (mouseX >= 0 && mouseX < TOTALCOLUMNS && mouseY >= 0 && mouseY < TOTALROWS) {
            // Tile is valid
            playTile(mouseX,mouseY); // might move elsewhere
            return {
                validTileClick: true,
                x: mouseX,
                y: mouseY
            };
        }
        return {            
            valid: false,
            x: 0,
            y: 0
        };
    }

    // actually do something
    function playTile(x, y){
        console.log(`clicking tile at ${x},${y}`);                
        checkNeighbors(x,y); // check neighbors
        eraseMarkedPieces();
        // END OF TURN
        // now redraw the screen?
        fallDownPieces(); // gravity        
        // refresh screen
        drawTheGrid(); 

        // update score
        document.title = `moves:${level.totalTurns} score:${level.score}`;
    }

    // the big function
    //
    function checkNeighbors(x,y){
        var foundMatches = 0; 
        var targetColor = level.tiles[x][y].tileColor;
        level.colorInPlay = level.tiles[x][y].tileColor;
        console.log(`${x},${y}   color in play: ${level.colorInPlay}`);

        // mark clicked tag for self-notcied in play
        level.tiles[x][y].markTileToDelete();

        var scanX = x+1; 
        var lastXFound = -1; //self marker
        while (scanX<TOTALCOLUMNS-1)
        {
            if (level.tiles[scanX][y].tileColor == level.colorInPlay &&
                level.tiles[(scanX-1)][y].tileColor == level.colorInPlay)
            {
                console.log(`${foundMatches}  EAST MATCH >>>> ${scanX},${y}`);
                lastXFound = scanX; 
                foundMatches+=1;
                level.tiles[scanX][y].markTileToDelete(); 
            }            
            scanX++;
        }

            

        // if we found matches, we need to mark the tile itself as 'in play'
        if (foundMatches>0){
            console.log(`tiles played this turn: ${foundMatches}`);
            level.totalTurns+=1; 
        }
        else
        {
            console.log(`no matches found: `);
        }

        // END OF TURN(handled in next method)
    }

    // converts marked to delete pieces
    // to empty
    function eraseMarkedPieces(){
        console.log('about to erase marked pieces');
        for (let row = 0; row < TOTALROWS-1; row++) {
            for (let col = 0; col < TOTALCOLUMNS-1; col++) {
                if (level.tiles[row][col].markedForPlay == true)
                {           
                    console.log('erasing tile... ');
                    level.tiles[row][col].eraseTile(); 
                }
            }
        }         
    }


    function fallDownPieces(){
        //console.log(`falling down the pieces`);
     
        // BOTTOM TO TOP
        for (let row = TOTALROWS-1; row > 0; row--) {
            //console.log(`FDP: row:${row}`);
            for (let col = 0; col < TOTALCOLUMNS-1; col++) {

                //level.tiles[row][col].markTileToDelete(); 
            }
        }        

    }
   
    
    // primary entry point
    init();
}    