const Settings = require('./Settings')

class Node {

    #board;
    #bruningMsg = '';
    #children = [];

    #intent;

    #parent;

    #selection = null;
    #title
    #value;


    constructor(title = 'r', parent = null) {
        this.#title = title
        this.#parent = parent

        this.#intent = (parent === null) ? "" : parent.intent + "\t"
    }

    get bruningMsg() {
        return this.#bruningMsg
    }

    get children() {
        return this.#children
    }

    get intent(){
        return this.#intent
    }

    get parent() {
        return this.#parent
    }

    get title() {
        return this.#title
    }

    get selection() {
        return this.#selection === null ? "" : `(${this.#selection})`
    }

    get value() {
        return this.#value
    }

    set bruningMsg(msg){
        this.#bruningMsg = `[${msg}]`
    }

    set selection(s) {
        this.#selection = s;
    }

    set value(v) {
        this.#value = v
    }


    addChild(n) {
        this.#children.push(n)
    }

    static TreeWalk(n) {

        let nodes = n.children

        for(let i = 0; i < nodes.length; i++) {
            Node.TreeWalk(nodes[i])
        }

        console.log(`${n.intent} col: ${n.title}, val: ${n.value} ${n.selection} ${n.bruningMsg}`)

    }

}

module.exports = Node