const jwt = require("jsonwebtoken")
const BlogModel = require("../models/blogsModel")
const authenticate = function(req, res, next) {
    //check the token in request header
    //validate this token

    let token = req.headers["x-api-key"]
    if (!token) return res.send({ status: false, msg: "token must be present in the request header" })
    let decodedToken = jwt.verify(token, 'functionup-thorium')

    if (!decodedToken) return res.send({ status: false, msg: "token is not valid" })

    next()
};

const authorisation = async function(req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        let decodedtoken = jwt.verify(token, "functionup-thorium")

        let toBeupdatedblogId = req.params.blogId
        if (toBeupdatedblogId) {
            let updatingAuthorId = await BlogModel.find({ _id: toBeupdatedblogId }).select({ authorId: 1, _id: 0 })
            let authorId = updatingAuthorId.map(x => x.authorId)
            console.log(authorId)
            let id = decodedtoken.AuthorId
            if (id != authorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        } else {
            let AuthorId = req.query.authorId
            toBeupdatedblogId = AuthorId
            let id = decodedtoken.AuthorId
            if (id != AuthorId) return res.status(403).send({ status: false, msg: "You are not authorised to perform this task" })
        }
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({ msg: error.message })
    }
}

module.exports.authenticate = authenticate;
module.exports.authorisation = authorisation;


// const jwt = require("jsonwebtoken");
// const BlogModel = require("../models/blogsModel");

// const mid3 = async function(req, res, next) {
//     try {
//         //Authentication
//         const token = req.headers["x-api-key"];
//         if (!token) {
//             return res
//                 .status(401)
//                 .send({ status: false, msg: "token must be present" });
//         }

//         //Authorization
//         var decodedToken = jwt.verify(token, "backend-project");

//         next();

//         req.user = decodedToken.authorId;
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message });
//     }
// };

// module.exports = { mid3 };