function BehaviorFlock(boid) {
	Behavior.call(this, boid); // call super constructor.
}


// subclass extends superclass
BehaviorFlock.prototype = Object.create(Behavior.prototype);
BehaviorFlock.prototype.constructor = BehaviorFlock;


BehaviorFlock.prototype = {

	update:function(objs){
		var separation = this.calcSeparate(objs);
		var alignment = this.calcAlignment(objs);
		var cohesion = this.calcCohesion(objs);
		separation = separation.multiply(this.boid.sepWeight, this.boid.sepWeight);
    alignment = alignment.multiply(this.boid.aligWeight,this.boid.aligWeight);
    cohesion = cohesion.multiply(this.boid.cohWeight,this.boid.cohWeight);

    this.boid.entity.body.acceleration.add(separation.x,separation.y);
    this.boid.entity.body.acceleration.add(alignment.x,alignment.y);
    this.boid.entity.body.acceleration.add(cohesion.x,cohesion.y);

    this.boid.entity.body.velocity.add(this.boid.entity.body.acceleration.x, this.boid.entity.body.acceleration.y)
    this.boid.entity.body.acceleration.multiply(0,0);
    this.boid.entity.angle = MovementUtils.facing(this.boid.entity.body.velocity);
		MovementUtils.loopWalls(this.boid.entity.position,this.boid.game.world);

	},
	calcAlignment:function(objs){

		var total = new Phaser.Point(0,0);
		var count = 0;
	 	for(var j = 0; j < objs.length; ++j)
	  {
	  	if (this.boid != objs[j])
			{
				var distance = Phaser.Math.distance(this.boid.entity.position.x, this.boid.entity.position.y, objs[j].entity.position.x, objs[j].entity.position.y);
				if(distance > 0 && distance < this.boid.aligInfluence)
				{
					total.add(objs[j].entity.body.velocity.x, objs[j].entity.body.velocity.y)
					count++;
				}
			}
		}

		if (count > 0)
		{

			total = total.divide(count,count);
			total.normalize();
			total.setMagnitude(this.boid.maxSpeed);
			var steer = new Phaser.Point(0, 0);
			steer = Phaser.Point.subtract(total, this.boid.entity.body.velocity);
			steer = MovementUtils.limit(steer, this.boid.maxForce);
			return steer;
		}

		else
		{
			return new Phaser.Point(0, 0);
		}

	},
	calcCohesion:function(objs){

		var total = new Phaser.Point(0,0);
		var count = 0;
		for(var j = 0; j < objs.length; ++j)
	  {
	  	if (this.boid != objs[j])
			{
				var distance = Phaser.Math.distance(this.boid.entity.position.x, this.boid.entity.position.y, objs[j].entity.position.x, objs[j].entity.position.y);
				if (distance > 0 && distance < this.boid.cohInfluence)

				{
					total.add(objs[j].entity.position.x,  objs[j].entity.position.y)
					count++;
				}
			}

		}

		if (count > 0)
		{
			total = total.divide(count,count);
			return MovementUtils.seek(total, this.boid.entity.position,this.boid.entity.body.velocity, this.boid.maxSpeed, this.boid.maxForce);
		}
		else
		{
			return new Phaser.Point(0,0);
		}

	},

	calcSeparate:function(objs){
		var steer = new Phaser.Point(0,0);
		var count = 0;
		var vector = new Phaser.Point(0,0);
		for(var j = 0; j < objs.length; ++j)
		{
			if (this.boid != objs[j])
			{
				var distance = Phaser.Math.distance(this.boid.entity.position.x, this.boid.entity.position.y, objs[j].entity.position.x, objs[j].entity.position.y);

				if((distance > 0) && (distance < this.boid.sepInfluence))
				{
					var diff = Phaser.Point.subtract(this.boid.entity.position, objs[j].entity.position);
					diff.normalize();
					diff = diff.divide(distance, distance);
					steer = steer.add(diff.x, diff.y)
					count++;
		 		}
		 	}
	  }

	  if (count > 0)
	 	{
	 		steer = steer.divide(count, count);
	 	}
	 	if (steer.getMagnitude() > 0)
	 	{
	 		steer.setMagnitude(this.boid.maxSpeed);
	 		steer = steer.subtract(this.boid.entity.body.velocity.x,this.boid.entity.body.velocity.y);
	 		steer = MovementUtils.limit(steer, this.boid.maxForce)
	 	}
		return steer;

		}
}