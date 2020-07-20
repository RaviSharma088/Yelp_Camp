var express =  require("express");
var router  =  express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment    = require("../models/comment");
var middleware    = require("../middleware");


router.get("/campgrounds/:id/comments/new",middleware.isLoggedin,function(req,res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {campground : campground});
        }
    });
});

router.post("/campgrounds/:id/comments",middleware.isLoggedin, function(req, res){
    // lookup for campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});
// commetns edit route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {comment : foundComment, campground_id : req.params.id});
        }
    });
});

//commetn update route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }   else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

//comment delete route
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }   else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

module.exports = router;