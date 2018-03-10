/*=======================================================
=            bringing in and seting up NPM's            =
=======================================================*/

//mongo stuff
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const url = `mongodb://localhost:27017/`;

const nameOfDb = 'ancon'
const aboutCollection = 'about';
const infoCollection = 'info';

/*=====  End of bringing in and seting up NPM's  ======*/

/*=================================
=            funcitons            =
=================================*/

/*----------  Read About  ----------*/
const readAbout = (req, res)=>{

	let tempPromis = new Promise((resolve, reject) =>{
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection(aboutCollection).find({}).toArray(function(err, result){
				if (err) throw err;
				//console.log(result);
				resolve(result);
		    	db.close();
			});
		});
	});

	tempPromis.then((tempVar) =>{
		res.send(tempVar);
	});

};

/*----------  Creat About  ----------*/
const creatAbout = (req, res)=>{
	// console.log('at the creatAbout function');

	let tempPromis = new Promise((resolve, reject) =>{
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db(nameOfDb);
			dbo.collection(aboutCollection).find({}).toArray(function(err, result) {
				if (err) throw err;
				//console.log(result);
				resolve(result);
				db.close();
			});
		});
	});

	let doTheThing = false;
	let doTheThing2 = true;
	let newThingInDb;
	let docsInAobutCollection;

	tempPromis.then((tempVar) =>{
		//console.log(tempVar);
		docsInAobutCollection = tempVar;

		// console.log('docsInAobutCollection')
		// console.log(docsInAobutCollection);

		if(req.body.name != null && req.body.name && typeof req.body.name === 'string' ){
			// console.log('name is good');
			if(req.body.dataType != null && req.body.dataType && typeof req.body.dataType === 'string' ){
				// console.log('dataType is good');
				doTheThing = true
				for(let i = 0; i < docsInAobutCollection.length; i++){
					if(req.body.name === docsInAobutCollection[i].name){
						doTheThing2 = false;
					}
				}

			}else{
				res.send('err the dataType was eather null or not of type string');
			}
		}else{
			res.send('err the name was eather null or not of type string')
		}

		if(doTheThing == true && doTheThing2 == true){

			// console.log(req.body)
			// console.log('in the insert if')

			let newThingInDb =
			{
				'name' : req.body.name,
				'dataType' : req.body.dataType
			};

			// console.log(newThingInDb);

			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				let dbo = db.db(nameOfDb);
				
				dbo.collection(aboutCollection).insertOne(newThingInDb, function(err, res){
					if (err) throw err;
					// console.log('insertOne into the infoCollection');
				db.close();
				});
			});
			res.send(newThingInDb);
		}else{
			res.send('this feild is already in the db');			
		}

		res.send('it broke');
	});

};

/*----------  Read info  ----------*/
const readInfo = (req, res)=>{

	let tempPromis = new Promise((resolve, reject) =>{
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection(infoCollection).find({}).toArray(function(err, result){
				if (err) throw err;
				// console.log(result);
				resolve(result);
		    	db.close();
			});
		});
	});

	tempPromis.then((tempVar) =>{
		res.send(tempVar);
	});

};

/*----------  Create Info   ----------*/
const creatInfo = (req, res)=>{

	let tempPromis = new Promise((resolve, reject) =>{
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection(aboutCollection).find({}).toArray(function(err, result){
				if (err) throw err;
				//console.log(result);
				resolve(result);
		    	db.close();
			});
		});
	});

	tempPromis.then( (tempVar)=>{
		//res.send(tempVar);

		let newThingInDb = {};
		let insertIsGo = true;

		for(let i = 0; i < tempVar.length; i++){

			// console.log('tempVar[i].name');
			// console.log(tempVar[i].name);

			//console.log('hotSecVar');
			// console.log(hotSecVar);

			if(req.body[tempVar[i].name] != undefined ){
				if( typeof req.body[tempVar[i].name] === tempVar[i].dataType ){
					newThingInDb[tempVar[i].name] = req.body[tempVar[i].name];
				}else{
					insertIsGo = false;
					res.send(`datatype of ${tempVar[i].name} is not correct`);
				}
				
			}

		}

		if(insertIsGo === true){
			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				let dbo = db.db(nameOfDb);
				
				dbo.collection(infoCollection).insertOne(newThingInDb, function(err, res){
					if (err) throw err;
					// console.log('insertOne into the infoCollection');
				db.close();
				});
			});
			res.send(newThingInDb);
		}

	});
	res.send('it broke');
}

/*----------  Upadte Info  ----------*/
const updateInfo = (req, res)=>{

	/*
	* get id
	* query for it
	* get updte ojb 
	* make sure update obj is valad (simaler to creat)
	* update and send back new object
	
	{
		id : < id >
		newDoc : {
			< thing > : < thing >,
			.
			.
			.
		}
	}
	*/

	let newThingInDb = {};
	let updateIsGo = true;

	let tempPromis = new Promise((resolve, reject) =>{
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection(aboutCollection).find({}).toArray(function(err, result){
				if (err) throw err;
				console.log('result');
				console.log(result);
				resolve(result);
		    	db.close();
			});
		});
	});

	tempPromis.then((tempVar)=>{
		for(let i = 0; i < tempVar.length; i++){

			if(req.body.id != undefined){
				if(req.body.newDoc != undefined && typeof req.body.newDoc === 'object' ){
					if(req.body.newDoc[tempVar[i].name] != undefined ){
						if( typeof req.body.newDoc[tempVar[i].name] === tempVar[i].dataType ){
							newThingInDb[tempVar[i].name] = req.body.newDoc[tempVar[i].name];
						}else{
							res.send(`datatype of ${tempVar[i].name} is not correct`);
							updateIsGo = false;
						}
					}
				}else{
					res.send(`the req.body.newDoc is undefined or is not of type object`);
					updateIsGo = false;
				}
			}else{
				res.send(`the req.body.id is undefined`);
				updateIsGo = false;
			}

		}
		console.log('req.body.id');
		console.log(req.body.id);
		console.log('req.body.newDoc');
		console.log(req.body.newDoc);
		console.log('newThingInDb');
		console.log(newThingInDb);
		res.send(newThingInDb);

		if(updateIsGo === true){

			let query = { _id : ObjectId("5aa40efce48ccf815eb5fccd") };

			// console.log('newThingInDb');
			// console.log(newThingInDb);
			// console.log()
			// console.log('query');
			// console.log(query);


			MongoClient.connect(url, function(err, db){
				if (err) throw err;
				let dbo = db.db(nameOfDb);
				dbo.collection(infoCollection).updateOne(query, {$set: newThingInDb}, function(err, res) {
					if (err) throw err;
					console.log("1 document updated");
					db.close();
				});
			});
			res.send(newThingInDb);

			// // test to make sure my query works
			// MongoClient.connect(url, function(err, db){
			// 	if (err) throw err;
			// 	let dbo = db.db(nameOfDb);
			// 	dbo.collection(infoCollection).find(query).toArray(function(err, result) {
			// 		if (err) throw err;
			// 		console.log('test result');
			// 		console.log(result);
			// 		db.close();
			// 	});
			// });

		}

	})

}

/*=====  End of funcitons  ======*/

/*----------  exports  ----------*/
module.exports = {
	readAbout,
	creatAbout,
	readInfo,
	creatInfo,
	updateInfo
}