import { grid } from './grid.js';
//import { cloneArray } from './grid.js';
//const lodashClonedeep = require('lodash.clonedeep');

export class play{
    static turn(mod,mySign,gridData,rowLength){
        //getting oponent sign
        var oponentSign;
        var esCount;
        if (mySign == 1){
            oponentSign = 2;
        } else {
            oponentSign = 1;
        }
        
        if (mod == 1){
            esCount = 1;
        } else {
            esCount = 2;
        }
        // exception - go center move on 3x3 grid if not yet played
        if (grid.calGridSize(gridData) == 3 && grid.getStateCount(oponentSign,gridData) == 1 && gridData["1_1"]["state"] == 0){
            return {x:gridData["1_1"]["gridX"],y:gridData["1_1"]["gridY"]};
        }
        //calculating top row +2 empty (doesn't add 2 empty in a row)
        let oponentTopRowData = grid.getTopRow(oponentSign,gridData,esCount);
        let findOponentWin = grid.getTopRow(oponentSign,gridData,1);
        //calculating next move win
        let myTopRowData = grid.getTopRow(mySign,gridData,esCount);
        let findMyWin = grid.getTopRow(mySign,gridData,1);
        //if win, execute
        var i;
        if (findMyWin.length == rowLength){
            //console.log("doing my Win")
            for (i = 0; i < findMyWin.length; i++){
                if (findMyWin[i]["state"] == 0){
                    return {x:findMyWin[i]["gridX"],y:findMyWin[i]["gridY"]};
                }
            }
        }
        //if next move oponent win, block
        if (findOponentWin.length == rowLength){
            //console.log("blocking oponent win")
            for (i = 0; i < findOponentWin.length; i++){
                if (findOponentWin[i]["state"] == 0){
                    return {x:findOponentWin[i]["gridX"],y:findOponentWin[i]["gridY"]};
                }
            }
        }
        //long term blocking
        if (oponentTopRowData.length > myTopRowData.length){
            //console.log("blocking long term")
            //prioritize blocking central empty spaces in row
            if (oponentTopRowData.length > 2){
                var i;
                for (i = 1; i < oponentTopRowData.length-1; i++){
                    if (oponentTopRowData[i]["state"] == 0){
                        return {x:oponentTopRowData[i]["gridX"],y:oponentTopRowData[i]["gridY"]};
                    }  
                }
            }
            //else block edges
            if (oponentTopRowData[0]["state"] == 0){
                return {x:oponentTopRowData[0]["gridX"],y:oponentTopRowData[0]["gridY"]};
            }
            if (oponentTopRowData[oponentTopRowData.length-1]["state"] == 0){
                return {x:oponentTopRowData[oponentTopRowData.length-1]["gridX"],y:oponentTopRowData[oponentTopRowData.length-1]["gridY"]};
            }  
        }
        
        //long term building row
        if (myTopRowData.length > 1){
            //building long term
            var i;
            for (i = 1; i < myTopRowData.length-1; i++){
                if (myTopRowData[i]["state"] == 0){
                    return {x:myTopRowData[i]["gridX"],y:myTopRowData[i]["gridY"]};
                }  
            }
        }
        if (myTopRowData[0]["state"] == 0){
            return {x:myTopRowData[0]["gridX"],y:myTopRowData[0]["gridY"]};
        }
        if (myTopRowData[myTopRowData.length-1]["state"] == 0){
            return {x:myTopRowData[myTopRowData.length-1]["gridX"],y:myTopRowData[myTopRowData.length-1]["gridY"]};
        }
        //if move not found, go random for top empty row
        let avalRow = grid.getTopRow(0,gridData);
        if (avalRow.length == 0){
            for (const property in gridData) {
                if (gridData[property]["state"] == 0){
                    return {x:gridData[property]["gridX"],y:gridData[property]["gridY"]};
                }
            }
        }
        
        var r = Math.floor(Math.random() * avalRow.length);
        return {x:avalRow[r]["gridX"],y:avalRow[r]["gridY"]};
        
    }
}