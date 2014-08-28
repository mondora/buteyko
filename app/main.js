var Exercise = function( exercise ){

	if ( exercise ){
		return exercise;
	}

	this.date = new Date();
	this.heartrate= {};
	this.cp = [];

};

Exercise.prototype.setHeart = function( type, value ){
	this.heartrate[type] = value;
};

Exercise.prototype.addCp = function( value ){
	this.cp.push(value);
};

Exercise.prototype.setNotes = function( notes ){
	this.notes = notes;
};

