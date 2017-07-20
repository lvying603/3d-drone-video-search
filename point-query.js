// Installed npm packages: jquery underscore request express
// jade shelljs passport http sys lodash async mocha chai sinon
// sinon-chai moment connect validator restify ejs ws co when
// helmet wrench brain mustache should backbone forever debug

var _ = require('underscore');




//var query_point = {lantitude: 0.0, longitude: 0.0, height: 0.0}; //Inside
//var query_point = {lantitude: 0.0, longitude: 0.0, height: 0.5}; //Inside
//var query_point = {lantitude: 0.0, longitude: 0.0, height: 2.0}; //Outside
var query_point = {lantitude: 0.5, longitude: 0.5, height: 1.0}; //Outside


var pyramid = 
    {
        p: {lantitude: 0.0, longitude: 0.0, height: 1.0}, //camera point
        A: {lantitude: 1.0, longitude: -1.0, height: 0.0}, //Base polygon corner point 1
        B: {lantitude: 1.0, longitude: 1.0, height: 0.0}, //Base polygon corner point 2
        C: {lantitude: -1.0, longitude: 1.0, height: 0.0}, //Base polygon corner point 3
        D: {lantitude: -1.0, longitude: -1.0, height: 0.0}  //Base polygon corner point 4
    }; 


if(pointQuery(query_point, pyramid)) console.log("Inside");
else console.log("Outside");




/*** function definitions ***/



/**
 * Produce a vector pq from point p to point q.
 * @param point p
 * @param point q
 * @return vector pq. 
 */
function formVector(p, q)
{
    var pq = {lantitude: 0.0, longitude: 0.0, height: 0.0};
    pq.lantitude = q.lantitude - p.lantitude;
    pq.longitude = q.longitude - p.longitude;
    pq.height = q.height - p.height;
    return pq;
}



/**
 * Calculate the dot production of two vectors v1 and v2.
 * @param vector v1
 * @param vector v2
 * @return dot production of v1 and v2. 
 */
function dotProduct(v1, v2)
{
    var product = v1.lantitude * v2.lantitude + 
                  v1.longitude * v2.longitude +
                  v1.height * v2.height;
    return product;
}



/**
 * Calculate the cross production of two vectors v1 and v2.
 * @param vector v1
 * @param vector v2
 * @return cross production of v1 and v2: a vector. 
 */
function crossProduct(v1, v2)
{
    var cp = {lantitude: 0.0, longitude: 0.0, height: 0.0};
    // v1: lantitude, longitude, height
    // v2: lantitude, longitude, height
    cp.lantitude = v1.longitude * v2.height - v1.height * v2.longitude;
    cp.longitude = v1.height * v2.lantitude - v1.lantitude * v2.height;
    cp.height = v1.lantitude * v2.longitude - v1.longitude * v2.lantitude;
    return cp;
}




/**
 * Calculate the normal vector of the plane formed from three points p1, p2 and p3.
 * @param point p1
 * @param point p2
 * @param point p3
 * @return the normal vector of the plane, i.e., vec(p1p2) X vec(p2p3). 
 */
function calc_PlaneNormal(p1, p2, p3)
{
    var normal = {lantitude: 0.0, longitude: 0.0, height: 0.0};
    var vec_p1p2 = formVector(p1, p2);
    var vec_p2p3 = formVector(p2, p3);
    var normal = crossProduct(vec_p1p2, vec_p2p3);
    return normal;
}





/**
 * Determine whether a point is inside of a pyramid.
 * @param query_point: a point
 * @param pyramid
 * @return true if inside; false if outside. 
 */
function pointQuery(query_point, pyramid)
{
    /** Basic idea:
     * 1)Calculate the normal for each of the four faces of the pyramid.
     * 2)Next calculate the inner product(DOT) between this vector and the face normal - the result is a scalar
     * 3)The point is inside the pyramid if the four scalars are negative.
     *
     * @reference: 
     *    https://forum.thegamecreators.com/thread/179559
     *    https://www.gamedev.net/forums/topic/639324-finding-a-point-inside-a-pyramid/
     *    http://tutorial.math.lamar.edu/Classes/CalcIII/EqnsOfPlanes.aspx
     */

    var normal_pAB = calc_PlaneNormal(pyramid.p, pyramid.A, pyramid.B);
    var normal_pBC = calc_PlaneNormal(pyramid.p, pyramid.B, pyramid.C);
    var normal_pCD = calc_PlaneNormal(pyramid.p, pyramid.C, pyramid.D);
    var normal_pDA = calc_PlaneNormal(pyramid.p, pyramid.D, pyramid.A);
    
    var pq = formVector(pyramid.p, query_point);
    var fDistAB = dotProduct(pq, normal_pAB);
    var fDistBC = dotProduct(pq, normal_pBC);
    var fDistCD = dotProduct(pq, normal_pCD);
    var fDistDA = dotProduct(pq, normal_pDA);
    
    if(fDistAB<0 && fDistBC<0 && fDistCD<0 && fDistDA<0) return true;
    else return false;
}

