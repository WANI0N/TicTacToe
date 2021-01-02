export class grid {
    static getTopRow(submitState,gridData,submitEsCount = 0){
        /*
        calculate max in a row of sign
        submitEsCount = number of empty spaces that the row can contain
        2 empty spaces cannot occur in a row
        in case of 2 equal rows found, row with higher number of target sign in a row takes priority
        */
        var gridSize = grid.calGridSize(gridData);
        var returnTopData = [];
        var topData = [];
        // loop through entire grid
        for (const property in gridData) {
            if (gridData[property]["state"] == submitState){
                topData = [];
                var coorArr = property.split("_");
                var way
                var inRow;
                var topInRow = 0;
                var finInRow = 0;
                var clock;
                //calculate 8 possible ways
                for (way = 0; way < 8; way++){ // going around the target looking for 2nd in a row
                    topData = [gridData[property]]
                    clock = 0; // ensures 2 empty spaces are not in a row
                    inRow = 1; // aggregates how many target signs are in a row
                    topInRow = inRow; // stores inRow
                    var esCount = submitEsCount; // stores esCount (deducts if aggregated)
                    var newCoor = grid.getMoveCoor(way,coorArr,gridSize);
                    // returns 0 if out of grid
                    if (newCoor == 0){
                        continue
                    }
                    var cNewCoor = cloneArray(coorArr)
                    var i
                    for (i = 0; i < gridSize; i++){
                        
                        var cNewCoor = grid.getMoveCoor(way,cNewCoor,gridSize);
                        
                        // returns 0 if out of grid
                        if (cNewCoor == 0){
                            break
                        }
                        // if target sign match, aggregate inRow count
                        if (gridData[cNewCoor[0] + "_" + cNewCoor[1]]["state"] == submitState){
                            if (topData.length > 1){
                                if (gridData[ topData[i-1]["gridX"] + "_" + topData[i-1]["gridY"] ] == submitState){
                                    inRow += 1
                                }
                                if (topInRow < inRow){
                                    topInRow = inRow;
                                }
                            }
                            
                            clock = 0;
                            topData.push(gridData[cNewCoor[0] + "_" + cNewCoor[1]]);
                        } else if (esCount > 0 && clock == 0 && gridData[cNewCoor[0] + "_" + cNewCoor[1]]["state"] == 0){
                            esCount += -1
                            inRow = 0;
                            // on last esCount, counterWay position if first position is checked for empty space
                            if (esCount == 1){
                                var counterWay = Math.abs(way-7)
                                var submitCoor = [topData[0]["gridX"],topData[0]["gridY"]];
                                var counterNewCoor = grid.getMoveCoor(counterWay,submitCoor,gridSize);
                                if (counterNewCoor != 0 && gridData[counterNewCoor[0] + "_" + counterNewCoor[1]]["state"] == 0){
                                    topData.splice(0, 0, gridData[counterNewCoor[0] + "_" + counterNewCoor[1]]);
                                    esCount += -1
                                }
                            }
                            clock = 1;
                            topData.push(gridData[cNewCoor[0] + "_" + cNewCoor[1]]);
                        } else {
                            break
                        }
                        if (returnTopData.length < topData.length){
                            returnTopData = cloneArray(topData);
                            finInRow = topInRow;
                        } else if (returnTopData.length == topData.length){
                            if (topInRow > finInRow){
                                returnTopData = cloneArray(topData);
                                finInRow = topInRow;
                            }
                        }
                    }
                }
            }
            
        }
        
        return returnTopData
    }
    
    static getStateCount(submitState,gridData){
        //returns number of available target position in the grid
        let count = 0;
        for(let key in gridData) {
            if (gridData[key]["state"] == submitState)
                ++count;
        }
        return count
    }

    static getMoveCoor(way,submitArr,gridSize){

        // returns position of next square based on input position and way
        var returnCoor = cloneArray(submitArr);
        returnCoor[0] = parseFloat(returnCoor[0])
        returnCoor[1] = parseFloat(returnCoor[1])
        if (way == 0){
            //top left
            returnCoor[0] += -1
            returnCoor[1] += -1
        }
        if (way == 1){
            //top
            returnCoor[1] += -1
        }
        if (way == 2){
            //top right
            returnCoor[0] += 1
            returnCoor[1] += -1
        }
        if (way == 3){
            //left
            returnCoor[0] += -1
        }
        if (way == 4){
            //right
            returnCoor[0] += 1
        }
        if (way == 5){
            //bottom left
            returnCoor[0] += -1
            returnCoor[1] += 1
        }
        if (way == 6){
            //bottom
            returnCoor[1] += 1
        }
        if (way == 7){
            //bottom right
            returnCoor[0] += 1
            returnCoor[1] += 1
        }
        if (returnCoor[0] < 0 || returnCoor[1] < 0){
            return 0
        }
            
        if (returnCoor[0] > gridSize-1 || returnCoor[1] > gridSize-1){
            return 0
        }
            
        return returnCoor
    }
    static getCell(x,y,gridData,canv){
        // player interaction with grid, calculates grid position based on mouse coordinates, returns key of gridData
        var gridSize = grid.calGridSize(gridData);
        var convX = x - parseFloat(canv.style.left);
        var convY = y - parseFloat(canv.style.top);
        for (const property in gridData) {
            if (gridData[property]["x"] > convX){
                continue
            }
            if (gridData[property]["y"] > convY){
                continue
            }
            if ((gridData[property]["x"] + canv.width/gridSize) < convX){
                continue
            }
            if ((gridData[property]["y"] + canv.height/gridSize) < convY){
                continue
            }
        return property
        }
    }

    static markCell(key,state,gridData,ctx,canv,cellColorData,blackStone,whiteStone){
    
        var gridSize = grid.calGridSize(gridData);
        gridData[key]["state"] = state;
    
        var x = gridData[key]["x"]
        var y = gridData[key]["y"]
        var w = canv.width/gridSize
        var h = canv.height/gridSize
        ctx.strokeStyle = cellColorData[state]["color"];
        ctx.lineWidth = w*0.08;
        
        // shadow effect
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.lineWidth = w*0.08;
        ctx.ellipse(x+(w*0.05)+w*0.5, y+(h*0.05)+h*0.5, w*0.4, h*0.4, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();

        if (cellColorData[state]["sign"] == "ex" ){    
            /*
            ctx.beginPath();
            ctx.moveTo(x+w*0.1, y+h*0.1);
            ctx.lineTo(x+w*0.9, y+h*0.9);
            ctx.stroke();
    
            ctx.moveTo(x+w*0.9, y+h*0.1);
            ctx.lineTo(x+w*0.1, y+h*0.9);
            ctx.stroke();
            */
            ctx.drawImage(blackStone, x+(w*0.05), y+(h*0.05),w-(w*0.1),h-(h*0.1));
        }
        if (cellColorData[state]["sign"] == "circle" ){
            /*
            ctx.beginPath();
            ctx.ellipse(x+w*0.5, y+h*0.5, w*0.4, h*0.4, Math.PI / 4, 0, 2 * Math.PI);
            ctx.stroke();
            */
           ctx.drawImage(whiteStone, x+(w*0.05), y+(h*0.05),w-(w*0.1),h-(h*0.1));
        }
    
        return gridData
    }

    static calGridSize(gridData){
        let count = 0;
        for(let key in gridData) {
            ++count;
        }
        return Math.sqrt(count)
    }
}

export function cloneArray(submitArray){
    var returnArray = [];
    var i = -1;
    while (++i < submitArray.length) {
        returnArray[i] = submitArray[i];
    }
    return returnArray
}