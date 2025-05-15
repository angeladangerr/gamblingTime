const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

// POSSIBLE VALUES TO SHOW UP IN THE SLOTS AND OCCURRENCES
// (DO NOT NEED QUOTATIONS AROUND THE LETTERS IN JAVASCRIPT)
const SYMBOLS_COUNT = {
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

// THE VALUE MULTIPLIERS
const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}



// FUNCTION TO DEPOSIT MONEY
const deposit = () => {
    while(true){
        const depositAmount = prompt("Enter a deposit amount: ");

        // CONVERT STRING INPUT TO NUMBER
        const numberDepositAmount = parseFloat(depositAmount);

        // INPUT VALIDATION
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount! Try again.");
        } 
        else{
            return numberDepositAmount;
        }
    }
};



// FUNCTION TO DETERMINE NUMBER OF LINES TO BET ON
const getNumberOfLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on (1-3): ");

        // CONVERT STRING INPUT TO NUMBER
        const numberOfLines = parseFloat(lines);

        // INPUT VALIDATION
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again!");
        }
        else {
            return numberOfLines;
        }
    }
};




// FUNCTION TO COLLECT TOTAL BET AMOUNT PER LINE
const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");

        // CONVERT STRING TO NUMBER
        const numberBet = parseFloat(bet);

        // INPUT VALIDATION
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance/lines){
            console.log("Invalid bet, try again!");
        }
        else {
            return numberBet;
        }
    }
};



// FUNCTION TO BUILD AND "SPIN" SLOT MACHINE
const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }

    // SLOT MACHINE COLUMNS
    const reels = [[], [], []];
    for(let i=0; i<COLUMNS; i++){
        reels.push([]);
        // COPY AVAILABLE SYMBOLS INTO ANOTHER ARRAY
        const reelSymbols = [...symbols];

        // RANDOM SELECT SYMBOLS
        for(let j=0; j<ROWS; j++){
            // ROUND NUMBERS DOWN TO NEAREST WHOLE NUMBER SO IT STAYS IN ARRAY
            const randomIndex = Math.floor(Math.random()*reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);

            // REMOVE ONE ELEMENT AT THE RANDOMLY SELECTED INDEX
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

// TRANSPOSE THE MATRIX/2D ARRAY SO IT IS IN THE "SLOT" FORMAT
const transpose = (reels) => {
    const rows = [];
    for(let i=0; i<ROWS; i++){
        rows.push([]);
        for(let j=0; j<COLUMNS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

// ADD "|" CHARACTER TO MAKE IT LOOK LIKE SLOT MACHINE
const printRows = (rows) => {
    for(const row of rows){
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol
            // DO NOT PUT "|" AT THE END
            if(i!=row.length-1){
                rowString+=" | "
            }
        }
        console.log(rowString);
    }
};



// FUNCTION TO CHECK IF USER WON
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for(let row=0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        // LOOP THROUGH ALL SYMBOLS TO CHECK IF THEYRE THE SAME AS THE FIRST SYMBOL
        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += bet * SYMBOL_VALUES[symbols[0]];
        }
    }
    return winnings;
};




const game = () => {
    let balance = deposit();

    while(true){
        console.log("You have a balance of $" + balance + "!");
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);

        // SUBTRACT BET AMOUNT FROM USER BALANCE
        balance -= bet*numberOfLines;
    
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        
        const winnings = getWinnings(rows, bet, numberOfLines);

        // ADD WINNING AMOUNTS TO USER BALANCE
        balance += winnings;

        console.log("You won $" + winnings.toString() + "!!!");

        if(balance <= 0){
            console.log("Oops! You ran out of money!")
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)?: ");
        if(playAgain != "y"){
            break;
        }


    }
}



game();


