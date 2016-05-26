define(function(require){
    require("libs/functions");
    var Maths = new Object();

    var isOutside = Maths.isOutside = function(x1,x2,a1,a2){//x
        return x1 > a2 || x2 < a1;// x1,x2 - ninja; a1,a2 - solid x
    };
    Maths.isBetween = function(pt,a1,a2){//x
        return pt>a1&&pt<a2;
    };
    if (!Maths.isBetween(1,0,2)){
        throw "Maths.isBetween(1,0,2)" + "error";
    }
    if (!!Maths.isBetween(10,0,2)){
        throw "Maths.isBetween(10,0,2)" + "error";
    }
    if (!!Maths.isBetween(-10,0,2)){
        throw "Maths.isBetween(-10,0,2)" + "error";
    }

    Maths.isAbove = function(pt, a1){//y - flying down
        return pt > a1;
    }
    if (!Maths.isAbove(1,0)){
        throw "Maths.isAbove(1,0)" + "error";
    }
    if (!!Maths.isAbove(-10,0)){
        throw "Maths.isAbove(-10,0)" + "error";
    }

    delta = function(v1, v2){
        return v1-v2;
    }

    Math.objectsRelativity = function(obj1, obj2){
        //onTheGround
        //inTheSpace
        //touchingFromBelow/under
        //onTheEdge
    };

    Maths.closestToLand = function(ninja, grounds){
        // first filter should be 'x'
        return grounds.filter(function(solid){
            var result = !isOutside(ninja.left_x, ninja.right_x, solid.left_x, solid.right_x);
            return result;
        }).sort(function(solid1, solid2){
            console.log(solid1.top_y, solid2.top_y, ninja.bottom_y);
            if (delta(solid1.top_y, ninja.bottom_y)<delta(solid2.top_y, ninja.bottom_y)){
                return -1;
            }
            if (delta(solid1.top_y, ninja.bottom_y)>delta(solid2.top_y, ninja.bottom_y)){
                return 1;
            }
            if (delta(solid1.top_y, ninja.bottom_y)==delta(solid2.top_y, ninja.bottom_y)){
                return 0;
            }
        })[0];
    };

var ground1pos = {"left_x":3,"right_x":122,"top_y":521,"bottom_y":561,"width":128,"height":43},
ground2pos = {"left_x":166,"right_x":285,"top_y":227,"bottom_y":267,"width":128,"height":43},
ground3pos = {"left_x":781,"right_x":900,"top_y":618,"bottom_y":658,"width":128,"height":43},
ground4pos = {"left_x":382,"right_x":701,"top_y":332,"bottom_y":372,"width":329,"height":44},
ground5pos = {"left_x":974,"right_x":1293,"top_y":414,"bottom_y":454,"width":329,"height":44},
ground6pos = {"left_x":0,"right_x":1280,"top_y":824,"bottom_y":860,"width":1280,"height":38};
var grounds = [ground1pos, ground2pos, ground3pos, ground4pos, ground5pos, ground6pos];
var ninja2pos1 = {"left_x":168,"right_x":232,"top_y":154,"bottom_y":226,"width":268,"height":172};//after the initial jump
var ninja2pos2 = {"left_x":104,"right_x":168,"top_y":154,"bottom_y":226,"width":268,"height":172}; // on the left edge
if (Maths.closestToLand(ninja2pos2,grounds).left_x!=ground2pos.left_x){
    throw "wrong calculations for closestToLand(ninja2pos2,grounds)";
}
if (Maths.closestToLand(ninja2pos1,grounds).left_x!=ground2pos.left_x){
    throw "wrong calculations for closestToLand(ninja2pos2,grounds)";
}
return Maths;
});
