const express 				= require('express');
const app 					= express();
const request 				= require('request');
const mongoose 				= require("mongoose");
const Comment    			= require("./models/comments");
const Movie    				= require("./models/movies");
const bodyParser			= require("body-parser");

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser());

mongoose.connect("mongodb://localhost/movieApp", {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/",(req,res)=>{
	res.render("search");
})


app.get("/result",(req,res)=>{
	let query = req.query.search
	let url = "http://www.omdbapi.com/?s="+query+"&apikey=thewdb"
	request(url,(error,response,body)=>{
		if(!response || error){
			console.log("this is error" + error);
		}
		else{
			let data = JSON.parse(body);
			
			if(data.Response == "False"){
			res.redirect("/");
		}else{
			res.render("results",{data : data});
		}
		}
	});
})

app.get("/result/:id",(req,res)=>{
	let query = req.params.id;
	let url = "http://www.omdbapi.com/?i="+query+"&apikey=thewdb"
	request(url,(error,response,body)=>{
		if(!error && response.statusCode == 200){
			let data = JSON.parse(body);
			// console.log(data);
			Comment.find({movie:query},(err,comment)=>{
				if(err) throw err;
				// console.log(comment);
				res.render('show',{data:data,comment:comment});
			});
		}
	});
	
});



app.get("/result/:id/comments/new",(req,res)=>{
	let movID = req.params.id;
	res.render("comment",{movID:movID});
	
	
});

app.post("/result/:id/comments",(req,res)=>{
	let movID = req.params.id;
	let com = {
		text: req.body.text,
		author: req.body.author,
		movie: movID
	}
	
	let newComment = Comment(com).save((err,data)=>{
		if (err) throw err;
		res.redirect('/result/'+ movID);
	});	
	
});





app.listen(3000,()=>{
	console.log('Server started on port 3000');
});