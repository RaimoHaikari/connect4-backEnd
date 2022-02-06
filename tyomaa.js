const Game = require('./classes/Game')

const game = new Game()
const board = game.board

let gameOver = false;

let request = {
    firstMove: 0,
    moves: [35,38,28,37,41]
    //       1 -1  1
}
/*
let val = game.processMove(request)
//console.log(".................")
console.log(val)
board.printBoard()
*/

class Rectangle {

    constructor(height, width, color) {    
        console.log("Neliöä alustetaan")   
        
        this._width = width;
        this._height = height;
        this._color = color
    }

    getArea() {
        return this._width * this._height
    }

    printDescription(){
        console.log(`I'm a rectangle of ${this._width} x ${this._height} and I am ${this._color}`)
    }
    
}

class Sqare {

    constructor(side){
        this._width = side
        this._height = side

        this._numberOfRequestsForArea = 0;
    }

    get area() {
        this._numberOfRequestsForArea++;
        return this._height * this._width;
    }

    get height() {
        return this._height
    }

    get width() {
        return this._width
    }

    set area(a) {
        this._height = Math.sqrt(a)
        this._width = Math.sqrt(a)
    }



    static equals(a,b) {
        return a.height * a.width === b.height * b.width
    }
}

class Person {

    #name
    #age

    constructor(_name, _age) {
        this.#name = _name
        this.#age = _age
    }

    get name(){
        return this.#name
    }

    get age(){
        return this.#age
    }

    describe() {
        console.log(`I am ${this.#name} and I am ${this.#age} years old`)
    }
}

class Programmer extends Person {

    #yearsOfExperience

    constructor(_name, _age, _yearsOfExperience) {
        super(_name, _age);

        this.#yearsOfExperience = _yearsOfExperience

    }

    code() {
        console.log(`${this.name} i coding`)
    }

}

function developSoftware(programmesrs) {
    for(let p of programmesrs) {
        p.code()
    }
}

let p1 = new Person('Jeff', 45);
let c1 = new Programmer('Dom', 56, 12);

console.log(p1.name, p1.age)
console.log(c1.name, c1.age)

//p1.code()
const programmers = [
    new Programmer("D", 56, 12),
    new Programmer("K", 12, 3),
    new Programmer("S", 36, 10)
]

developSoftware(programmers)
