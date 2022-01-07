'use strict';
module.exports = function (app) {

	let Library = require('../routes/database.js')

  app.route('/api/books')
    .get(function (req, res){

			let booksArr = []
			
			Library.find({}, function(err, books) {
				if (err || !books) {
					console.error(err)
					res.json({error: 'no book exists'})
					} else {
						books.forEach(book => {
							booksArr.push({
								comments: book.comments,
								_id: book._id,
								title: book.title,
								commentcount: book.comments.length
							})
						})
					}
				res.json(booksArr)
				})
			})
    
    .post(function (req, res){
      let title = req.body.title;

			if (title) {
				let newBook = new Library({
					title: title,
					comments: []
				})
				newBook.save(function(err, data) {
				if (err || !data) {
					console.error(err)
					res.json('missing required field title')
				}
				res.json(data)
				})
			} else {
				res.json('missing required field title')
			}
    })
    
    .delete(function(req, res){
			Library.deleteMany({}, function(err) {
				if (err) {
					console.log("unable to delete all books")
					res.json('unable to delete all books')
				} else {
					console.log('complete delete successful')
					res.json('complete delete successful')
				}
			})
    });

  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
 
			Library.findOne({_id: bookid}, function(err, data) {
				if (err || !data) {
					res.json('no book exists')
				} else {
					res.json({
						comments: data.comments,
						_id: bookid,
						title: data.title,
						commentcount: data.comments.length
					})
				}
			})
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      
			if (!comment) {
				res.json('missing required field comment')
			} else {
				Library.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, function(err, data) {
					if (err || !data) {
						res.json('no book exists')
					} else {
						res.json({
							comments: data.comments,
							_id: bookid,
							title: data.title,
							commentcount: data.comments.length
						})
					}
				})
			}
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      
			Library.findOneAndDelete({_id: bookid}, function(err, data) {
				if (err || !data) {
					console.log('no book exists')
					res.json('no book exists')
				} else {
					console.log('delete successful')
					res.json('delete successful')
				}
			})
    });
};
