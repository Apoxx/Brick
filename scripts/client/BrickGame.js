require('./VirtualJoystick')

import Rocket from './Rocket'

export
default class BrickGame {
	constructor() {
		this.map
		this.world
	}

	preload(game) {

		window.addEventListener('keydown', event => event.preventDefault())		
		game.load.spritesheet('rocket', 'assets/sprites/rocket.png', 32, 32)

		game.load.spritesheet('spritesheet', 'assets/sprites/spritesheet2.png', 16, 16)

		game.load.tilemap('map', 'assets/maps/map.json', null, Phaser.Tilemap.TILED_JSON)

	}

	create(game) {

		game.physics.startSystem(Phaser.Physics.ARCADE)

		this.map = game.add.tilemap('map')
        this.map.addTilesetImage('spritesheet')
        this.map.createLayer('background')
		this.rocket = new Rocket(game)
		this.rocket.position.x = game.world.centerX
		this.rocket.position.y = game.world.centerY


        this.map.createLayer('ground')
        this.map.createLayer('decorations')
        this.collisions = this.map.createLayer('collisions')
        this.collisions.resizeWorld()

        this.collisions.visible = false

        this.map.setCollisionBetween(0, 100, true, 'collisions')

	}

	update(game) {
		game.physics.arcade.collide(this.rocket, this.collisions)
		game.physics.arcade.collide(this.rocket.bullets, this.collisions, (bullet) => bullet.kill())

	}

	render(game){
	}
}