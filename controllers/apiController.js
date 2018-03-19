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


/*----------  Read Config  ----------*/
const readConfig = (req, res)=>{

	console.log("readConfig");

	let go = tableIsGo(req.body);

	if( go != null ){

		getConfigTable(req.body.talbe).then(function(foo) {
			// console.log("foo");
			// console.log(foo);
			// console.log("");
			res.send(foo)
		})

	}else res.send('req.bod.talbe is undefined or null');

};

/*----------  Creat Config  ----------*/
const creatConfig = (req, res)=>{

	console.log("creatConfig");

	let go = tableIsGo(req.body);

	if( go != null ){
		if( docIsGo(req.body) != null){
			if(req.body.doc.name != null && req.body.doc.name && typeof req.body.doc.name === 'string'){
				if(req.body.doc.dataType != null && req.body.doc.dataType && typeof req.body.doc.dataType === 'string'){

					getConfigTable(req.body.talbe).then(function(foo) {

						let doTheThing = true;

						for(let i = 0; i < foo.length; i++){

							if(req.body.doc.name === foo[i].name){
								doTheThing = false;
							}

						}

						let newThingInDb = {
							'name' : req.body.doc.name,
							'dataType' : req.body.doc.dataType

						}

						let talbe = "config_" + req.body.talbe

						console.log('talbe');
						console.log(talbe);

						if(doTheThing === true){
							MongoClient.connect(url, function(err, db) {
								if (err) throw err;
								let dbo = db.db(nameOfDb);
								
								dbo.collection(talbe).insertOne(newThingInDb, function(err, res){
									if (err) throw err;
									console.log('insertOne into the infoCollection');
									db.close();
								});
								res.send(newThingInDb);
							});
						}else res.send('thats alread in the talbe');

					})

				}else res.send('req.body.doc.dataType is null or undefined');	
			}else res.send('req.body.doc.name is null or undefined');
		}else res.send('req.body.doc is undefined or null');
	}else res.send('req.body.talbe is not undefined or null');

};

/*----------  Update Config  ----------*/
const updateConfig = (req, res)=>{

	let go = tableIsGo(req.body);


	if( go != null){
		if( idIsGo(req.body) != null){
			let query = { _id : ObjectId(req.body.id) };
			if(docIsGo(req.body) != null){

				let newThingInDb;

				if(req.body.doc.name != null && req.body.doc.name && typeof req.body.doc.name === 'string'){
					if(req.body.doc.dataType != null && req.body.doc.dataType && typeof req.body.doc.dataType === 'string'){
							newThingInDb =
							{
								'name' : req.body.doc.name,
								'dataType' : req.body.doc.dataType
							};

							MongoClient.connect(url, function(err, db){
								if (err) throw err;
								let dbo = db.db(nameOfDb);
								dbo.collection("config_" + req.body.talbe).updateOne(query, {$set: newThingInDb}, function(err, res) {
									if (err) throw err;
									console.log("1 document updated");
									db.close();
								});
							});	

							res.send(newThingInDb);

					}else res.send('req.body.doc.dataType is null or undefined or not of type string')
				}else res.send('req.body.doc.name is null or undefined or not of type string')

			}else res.send('req.body.doc is null or undefined');
		}else res.send('req.bod.id is null or undefined');
	}else res.send('req.bod.talbe is null or undefined');

}

/*----------  Delete Config  ----------*/
const deleteConfig = (req, res)=>{

	let go = tableIsGo(req.body);

	if( go != null){
		if( idIsGo(req.body) != null){

			query = { _id : ObjectId(req.body.id) };

			MongoClient.connect(url, function(err, db) {
				if (err) throw err;
				var dbo = db.db(nameOfDb);
				dbo.collection("config_" + req.body.talbe).deleteOne(query, function(err, obj) {
					if (err) throw err;
					console.log("1 document deleted");
					db.close();
				});
			});

			res.send('1 document deleted')

		}else res.send('req.body.id is undefined or null');
	}else res.send('req.body.table is undefined or null');

}

/*----------  Query Config  ----------*/

const queryConfig = (req, res)=>{

	let query = {};
	let go = tableIsGo(req.body);

	if( go != null){

		if( idIsGo(req.body) != null){
			query._id = ObjectId(req.body.id);
		}

		if( docIsGo(req.body) ){

			if(req.body.doc.name != null || req.body.doc.name != undefined){
				query.name = req.body.doc.name;
			}

			if(req.body.doc.dataType != null || req.body.doc.dataType != undefined){
				query.dataType = req.body.doc.dataType;
			}

		}

		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection("config_" + req.body.talbe).find(query).toArray(function(err, result) {
				if (err) throw err;
				res.send(result);
				db.close();
			});
		});

	}else res.send('req.body.table is undefined or null');

}

/*----------------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------
----------------------------------------				Info 					----------------------------------------
------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------*/

/*----------  Read info  ----------*/
const readInfo = (req, res)=>{

	let go = tableIsGo(req.body);

	if( go != null ){

		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db(nameOfDb);
			dbo.collection(req.body.talbe).find({}).toArray(function(err, result){
				if (err) throw err;
				res.send(result);
				db.close();
			});
});

	}else res.send('req.bod.talbe is undefined or null');

};

/*----------  Create Info   ----------*/
const creatInfo = (req, res)=>{

	let talbe;

	let tempPromis = new Promise((resolve, reject) =>{
		if(req.body.talbe != undefined || req.body.talbe != null ){
			if(req.body.talbe.length != 0){
				talbe = req.body.talbe;
				console.log(talbe);
				MongoClient.connect(url, function(err, db){
					if (err) throw err;
					let dbo = db.db(nameOfDb);
					dbo.collection('config_' + talbe).find({}).toArray(function(err, result){
						if (err) throw err;
						//console.log(result);
						resolve(result);
				    	db.close();
					});
				});
			}else resolve(null); 
		}else resolve(null); 
	});

	tempPromis.then( (tempVar)=>{
		//res.send(tempVar);

		console.log('tempVar');
		console.log(tempVar)

		if(tempVar != null){

			let newThingInDb = {};
			let insertIsGo = true;

			for(let i = 0; i < tempVar.length; i++){

				console.log('tempVar[i].name');
				console.log(tempVar[i].name);

				// console.log('hotSecVar');
				// console.log(hotSecVar);

				if(req.body.doc[tempVar[i].name] != undefined  || req.body.doc[tempVar[i].name] != null){
					if( typeof req.body.doc[tempVar[i].name] === tempVar[i].dataType ){
						newThingInDb[tempVar[i].name] = req.body.doc[tempVar[i].name];
						insertIsGo = true;
					}else{
						insertIsGo = false;
						res.send(`datatype of ${tempVar[i].name} is not correct`);
					}
					
				}

			}

			console.log(newThingInDb);

			if(insertIsGo === true){
				MongoClient.connect(url, function(err, db) {
					if (err) throw err;
					let dbo = db.db(nameOfDb);
					
					dbo.collection(talbe).insertOne(newThingInDb, function(err, res){
						if (err) throw err;
						// console.log('insertOne into the infoCollection');
						// res.send(newThingInDb);
					db.close();
					});
				});
				res.send(newThingInDb);
			}

		}else req.send('req.bod.talbe is null or undefined');

	});
	// res.send('it broke');
}

/*----------  Upadte Info  ----------*/
const updateInfo = (req, res)=>{

	let newThingInDb = {};
	let updateIsGo = true;
	let talbe;

	let tempPromis = new Promise((resolve, reject) =>{
		if(req.body.talbe != undefined || req.body.talbe != null ){
			if(req.body.talbe.length != 0){
				talbe = req.body.talbe;
				console.log(talbe);
				MongoClient.connect(url, function(err, db){
					if (err) throw err;
					let dbo = db.db(nameOfDb);
					dbo.collection('config_' + talbe).find({}).toArray(function(err, result){
						if (err) throw err;
						//console.log(result);
						resolve(result);
				    	db.close();
					});
				});
			}else resolve(null); 
		}else resolve(null); 
	});


	tempPromis.then((tempVar)=>{
		for(let i = 0; i < tempVar.length; i++){

			if(req.body.id != null || req.body.id != undefined){
				if(req.body.doc != undefined && typeof req.body.doc === 'object' ){
					if(req.body.doc[tempVar[i].name] != undefined ){
						if( typeof req.body.doc[tempVar[i].name] === tempVar[i].dataType ){
							newThingInDb[tempVar[i].name] = req.body.doc[tempVar[i].name];
						}else{
							res.send(`datatype of ${tempVar[i].name} is not correct`);
							updateIsGo = false;
						}
					}
				}else{
					res.send(`the req.body.doc is undefined or is not of type object`);
					updateIsGo = false;
				}
			}else{
				res.send(`the req.body.id is undefined`);
				updateIsGo = false;
			}

		}
		// console.log('req.body.id');
		// console.log(req.body.id);
		// console.log('req.body.doc');
		// console.log(req.body.doc);
		// console.log('newThingInDb');
		// console.log(newThingInDb);
		// res.send(newThingInDb);

		if(updateIsGo === true){

			let query = { _id : ObjectId(req.body.id) };

			// console.log('newThingInDb');
			// console.log(newThingInDb);
			// console.log()
			// console.log('query');
			// console.log(query);


			MongoClient.connect(url, function(err, db){
				if (err) throw err;
				let dbo = db.db(nameOfDb);
				dbo.collection(talbe).updateOne(query, {$set: newThingInDb}, function(err, res) {
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

/*----------  Delete Info  ----------*/

const deleteInfo = (req, res)=>{

	let deleteIsGo = false;
	let query;

	if(req.body.talbe != undefined || req.body.talbe != null ){
		if(req.body.talbe.length != 0){
			talbe = req.body.talbe;
			console.log("talbe" + talbe)

			if(req.body.id != null || req.body.id != undefined){
				deleteIsGo = true;
				query = { _id : ObjectId(req.body.id) };
			}else{
				res.send('id is null or undefined');
			}

			if(deleteIsGo === true){
				MongoClient.connect(url, function(err, db) {
					if (err) throw err;
					var dbo = db.db(nameOfDb);
					dbo.collection(talbe).deleteOne(query, function(err, obj) {
						if (err) throw err;
						console.log("1 document deleted");
						db.close();
					});
				});
				res.send('you just deleted that thing and it can not be restored ever');	
			}else res.send('you broke it');
		}else res.send("req.body.talbe is undefined or null");
	}else res.send("req.body.talbe is undefined or null");

}

/*----------  Query Info  ----------*/

const queryInfo = (req, res)=>{
	/*
	* see if there is an id
	* run though a for loop to get all about docs
	* see if there is anything in any of the about docs
	* do the search
	{
		id : ,
		doc{
			" " : " ",
			.
			.
			.
		} 
	}
	*/

	let talbe;

	let tempPromis = new Promise((resolve, reject) =>{
		if(req.body.talbe != undefined || req.body.talbe != null ){
			if(req.body.talbe.length != 0){
				talbe = req.body.talbe;
				console.log(talbe);
				MongoClient.connect(url, function(err, db){
					if (err) throw err;
					let dbo = db.db(nameOfDb);
					dbo.collection('config_' + talbe).find({}).toArray(function(err, result){
						if (err) throw err;
						//console.log(result);
						resolve(result);
				    	db.close();
					});
				});
			}else resolve(null); 
		}else resolve(null); 
	});

	tempPromis.then((tempVar)=>{

		if(tempVar != null){

			let query = {};

			if(req.body.id != undefined || req.body.id != null ){	
				query._id = ObjectId(req.body.id)
			}
			
			if(req.body.doc != undefined || req.body.doc != null){
				for(let i = 0; i < tempVar.length; i++){
					if(req.body.doc[tempVar[i].name] != null || req.body.doc[tempVar[i].name] != undefined){
						query[tempVar[i].name] = req.body.doc[tempVar[i].name];
					}
				}
			}

			

			let data;

			MongoClient.connect(url, function(err, db){
				if (err) throw err;
				let dbo = db.db(nameOfDb);
				dbo.collection(talbe).find(query).toArray(function(err, result){
					if (err) throw err;
					data = result;
					res.send({
						"query" : query,
						"results" : result
					});
					// console.log(result);
			    	db.close();
				});
			});

		}else{
			req.send('req.body.talbe is undefined or null');
		}

	})

}

/*=====  End of funcitons  ======*/

/*============================================================
=            Rework of how logic is going to work            =
============================================================*/

// req.body.table is good
const tableIsGo = (body)=>{
	let talbe = null;
	if(body.talbe != undefined && body.talbe != null ){
		if(body.talbe.length != 0){
			talbe = body.talbe; 
		}
	}
	return talbe;
}

//req.body.doc is good
const docIsGo = (body)=>{
	let doc = null;
	if(body.doc != null || body.doc ){
		if(typeof body.doc === 'object'){
			doc = body.doc;
		}
	}
	return doc;
}

//req.body.id is good
const idIsGo = (body)=>{
	let id = null;
	if(body.id != null || body.id ){
		if(body.id.length != 0){
			id = body.id;
		}
	}
	return id;
}

//Get Config Tabl
const getConfigTable = (talbe)=>{
  
	let promis = new Promise((resolve, reject)=>{
    
		MongoClient.connect(url, function(err, db){
			if (err) throw err;
			let dbo = db.db('ancon');
			dbo.collection('config_' + talbe).find({}).toArray(function(err, result){
			if (err) throw err;
			//console.log(result);
			resolve(result);
			db.close();
			});
		});

	});

	return promis.then((result)=>{
		// console.log("result");
		// console.log(result);
		// console.log("");
		return result;
	})

};

//this is an example of who to call this 

// getConfigTable("people").then(function(foo) {
// 	console.log("foo");
// 	console.log(foo);
// 	console.log("");
// 	return foo;
// })


/*=====  End of Rework of how logic is going to work  ======*/


/*----------  exports  ----------*/
module.exports = {
	readConfig,
	creatConfig,
	updateConfig,
	deleteConfig,
	queryConfig,
	readInfo,
	creatInfo,
	updateInfo,
	deleteInfo,
	queryInfo
}