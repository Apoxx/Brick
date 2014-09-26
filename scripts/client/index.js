var {
	Game,
	AUTO
} = Phaser

import BrickGame from './BrickGame'

var game = new Game(1280, 720, AUTO, '', new BrickGame(), false, false)



class Person{
	constructor(name){
		this.name = name
	}

	sayName(){
		const {name} = this
		console.log(`My Name is ${name} !`)
	}

	setName(newName){
		this.name = newName
	}
}

var pers = new Person('Apox')
pers.setName('Test')
pers.sayName()