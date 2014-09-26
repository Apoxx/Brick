var {
	Group,
	Sprite,
	Rectangle
} = Phaser


export default class Rocket extends Group {
	constructor(...params) {
		super(...params)

		this.nextFire = 0
		this.gunSwitch = true

		this.maxSpeed = 500
		this.acceleration = 100
		this.resistance = 1.1

		this.bullets = new Group(this.game)
		this.bullets.createMultiple(20, 'rocket', 7, false)
		this.game.physics.arcade.enable(this.bullets)
		this.bullets.setAll('anchor.x', 0.5)
		this.bullets.setAll('anchor.y', 0.5)			
		this.bullets.setAll('outOfBoundsKill', true)
		this.bullets.setAll('checkWorldBounds', true)


		this.bar = new Sprite(this.game, 0, 0, 'rocket', 0)
		this.ghostX = new Sprite(this.game, -this.game.width, 0, 'rocket', 0)
		this.ghostY = new Sprite(this.game, 0, -this.game.height, 'rocket', 0)
		this.ghostXY = new Sprite(this.game, -this.game.width, -this.game.height, 'rocket', 0)
		this.gun1 = new Sprite(this.game, 0, 0, 'rocket', 6)
		this.gun2 = new Sprite(this.game, 0, 0, 'rocket', 6)

		this.rockets = [this.bar, this.ghostX, this.ghostY, this.ghostXY]



		this.gun1.crop(new Rectangle(12, 11, 14, 8))
		this.gun2.crop(new Rectangle(12, 11, 14, 8))

		this.bar.addChild(this.gun1)
		this.bar.addChild(this.gun2)

		this.gun1.anchor.set(0.25, 0.60)
		this.gun1.position.set(-10, -6)
		this.gun1.rotation = -Math.PI


		this.gun2.anchor.set(0.25, 0.60)
		this.gun2.position.set(10, -6)

		//this.gun2.size.set(10, 10)



		this.add(this.bar)
		this.add(this.ghostX)
		this.add(this.ghostY)
		this.add(this.ghostXY)


		this.bar.animations.add('idle', [1,2])

		this.rockets.forEach(child => {			
			child.anchor.x = .5
			child.anchor.y = .5
		})

		this.game.physics.arcade.enable(this.bar)

		this.bar.body.maxVelocity.x = this.maxSpeed
		this.bar.body.maxVelocity.y = this.maxSpeed

		console.log(this.game.input)


        this.virtualJoystick = new Phaser.Plugin.VirtualJoystick(this.game)
        this.virtualJoystick.init(500, 500)
        //this.virtualJoystick.start()


	}

	update(){


		var state = 0

		if(this.game.input.activePointer.isDown){
			if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
		    {
		        this.nextFire = this.game.time.now + 100

		        var bullet = this.bullets.getFirstExists(false)

		        var p = this.gunSwitch ? this.gun1.world.clone() : this.gun2.world.clone()
		        this.gunSwitch = !this.gunSwitch		        

		        bullet.reset(p.x, p.y)

		        bullet.rotation = this.game.physics.arcade.moveToPointer(bullet, 1000, this.game.input.activePointer, 500) + Math.PI / 2 
		    }
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.virtualJoystick.deltaX < -0.2) {
			this.bar.body.velocity.x -= this.acceleration * (-this.virtualJoystick.deltaX || 1)

			state += 1
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.virtualJoystick.deltaX > 0.2) {
			this.bar.body.velocity.x += this.acceleration * (this.virtualJoystick.deltaX || 1)

			state += 2
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.virtualJoystick.deltaY < -0.2) {
			this.bar.body.velocity.y -= this.acceleration * (-this.virtualJoystick.deltaY || 1)

			state += 4
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.virtualJoystick.deltaY > 0.2) {
			this.bar.body.velocity.y += this.acceleration * (this.virtualJoystick.deltaY || 1)

			state += 8
		}

		if([8, 9, 10, 11].indexOf(state) !== -1) {this.rockets.forEach(child => child.frame = 0); this.bar.animations.stop()}
		if([2, 6, 14].indexOf(state) !== -1) {this.rockets.forEach(child => child.frame = 3); this.bar.animations.stop()}
		if([1, 5, 13].indexOf(state) !== -1) {this.rockets.forEach(child => child.frame = 4); this.bar.animations.stop()}
		if([4].indexOf(state) !== -1) {this.rockets.forEach(child => child.frame = 5); this.bar.animations.stop()}
		if([0, 12, 15, 3].indexOf(state) !== -1) {this.bar.animations.play('idle', 20)}


		this.bar.body.velocity.x /= this.resistance
		this.bar.body.velocity.y /= this.resistance




		this.bar.body.velocity.x = Math.abs(this.bar.body.velocity.x) < 2 ? 0 : this.bar.body.velocity.x
		this.bar.body.velocity.y = Math.abs(this.bar.body.velocity.y) < 2 ? 0 : this.bar.body.velocity.y

		if(this.bar.body.x > this.game.world.width) this.bar.body.x = 0
		if(this.bar.body.x < 0) this.bar.body.x = this.game.world.width
		if(this.bar.body.y > this.game.world.height) this.bar.body.y = 0
		if(this.bar.body.y < 0) this.bar.body.y = this.game.world.height

		this.ghostX.position.x =  this.bar.position.x - this.game.world.width
		this.ghostX.position.y =  this.bar.position.y
		this.ghostY.position.x =  this.bar.position.x
		this.ghostY.position.y =  this.bar.position.y - this.game.world.height
		this.ghostXY.position.x = this.bar.position.x - this.game.world.width
		this.ghostXY.position.y =  this.bar.position.y - this.game.world.height

		this.rockets.forEach(child => {
			child.rotation = this.bar.body.velocity.x / this.bar.body.maxVelocity.x * Math.PI / 6
		})

		var pos = this.bar.body.position.clone()

		pos.x += 16

		this.gun1.rotation = this.game.physics.arcade.angleToPointer(pos) - this.bar.rotation
		this.gun2.rotation = this.game.physics.arcade.angleToPointer(pos) - this.bar.rotation
	}
/*
	update(){

		//Apply acceleration
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && this.speedX > -this.speedCap ) {
			this.speedX -= this.acceleration

		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && this.speedX < this.speedCap ) {
			this.speedX += this.acceleration
		}

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.speedY > -this.speedCap ) {
			this.speedY -= this.acceleration
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.speedY < this.speedCap ) {
			this.speedY += this.acceleration
		}

		//Apply friction
	    this.speedX *= this.friction
	    this.speedY *= this.friction

	    //Apply Gravity
		if(this.speedY < this.speedCap) this.speedY += this.gravity

		//Calculate new position
		this.position.x += this.speedX
		this.position.y += this.speedY

		//Warp if necessary
		if(this.position.x > this.game.width + this.children[0].pivot.x) this.position.x = this.children[0].pivot.x
		if(this.position.x < this.children[0].pivot.x) this.position.x = this.game.width + this.children[0].pivot.x
		if(this.position.y > this.game.height + this.children[0].pivot.y) this.position.y = this.children[0].pivot.y
		if(this.position.y < this.children[0].pivot.y) this.position.y = this.game.height + this.children[0].pivot.y

		//Apply Rotation
		this.children.forEach(child => {
			var rot = this.speedX / this.speedCap * Math.PI / 3
			if(rot > Math.PI / 3) rot = Math.PI / 3
			else if(rot < -Math.PI / 3) rot = -Math.PI / 3
			child.rotation = rot
		})
	}
	*/
}