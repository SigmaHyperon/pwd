const express = require('express');
const mongo = require('mongoose');
const config = require('config');
const app = express();

app.use(express.json());

mongo.connect(`mongodb://${config.get("mongo.host")}:${config.get("mongo.port")}/${config.get("mongo.db")}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongo.connection.once('open', () => {
	console.log('connected to database');
});


const pwdModel = {
	service: 	{type: String, required: true},
	userName:	String,
	eMail: 		String,
	password:	String
}

const pwd = mongo.model('password', pwdModel);

app.post("/pwd", (req, res) => {
	if(req.body){
		getPwdList(req.body).then(v => res.json(v));
	} else {
		res.sendStatus(400);
	}
});
app.put('/pwd', async function (req, res) {
	if(req.body){
		const existing = await getPwdList(req.body);
		if(existing.length === 0){
			createPwd(req.body).then(v =>{
				if(typeof v.errors === 'undefined'){
					res.sendStatus(200);
				} else {
					res.status(500).json({error: v.errors});
				}
			});
		} else {
			res.status(409).json({error: "document elready exists"});
		}
	} else {
		res.sendStatus(400);
	}
});

async function getPwdList(filter){
	let query = {};
	Object.entries(filter).forEach(e => {
		query[e[0]] = new RegExp(e[1], "i");
	});
	return pwd.find(query).exec();
}

async function createPwd(data){
	return pwd.create(data);
}

app.use("/", express.static("www"));
app.use("/bootstrap", express.static("node_modules/bootstrap/dist"));
app.use("/popperjs", express.static("node_modules/popper.js/dist"));

const port = config.get("port");
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})