const express = require('express')
const router = express.Router()
const multer = require('multer');
const Posts = require('../database').Posts
const {Op} = require('sequelize');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + '_' + file.originalname.toLowerCase();
        cb(null, fileName)
    }
});


const upload = multer({storage: storage});

router.get('/timeline', (req, res) => {
    Posts.findAll(
        {
            order: [
                ['createdAt', 'DESC'],
            ], raw: true
        },
    )
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            console.log(error)
        })
})

router.get('/loadInitPosts', (req, res, next) => {
    Posts.findAll(
        {
            order: [
                ['createdAt', 'DESC'],
            ], raw: true, limit: 3
        },
    )
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            console.log(error)
        })
})
router.post('/loadNextPosts', (req, res, next) => {
    Posts.findAll(
        {
            order: [
                ['createdAt', 'DESC'],
            ],
            where: {
                postId: {
                    [Op.lt]: req.body.postId
                }
            },
            raw: true, limit: 3
        },
    )
        .then(result => {
            res.json(result)
        })
        .catch(error => {
            console.log(error)
        })
})


router.post('/post', upload.single('imageUrl'), (req, res, next) => {
    var post = req.body
    if (!post.fullName || !post.captionText) {
        res.status(400)
        res.json({
            "error": "bad data"
        })
    } else {
        Posts.create({fullName: post.fullName, captionText: post.captionText, imageUrl: req.file.path});
        res.json({
            "success": "Created successfully"
        })
    }
})

module.exports = router;