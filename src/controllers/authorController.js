const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken");

const createAuthors = async function(req, res) {
    try {
        let author = req.body
        let fname = req.body.fname
        let lname = req.body.lname
        let title = req.body.title
        let email = req.body.email
        let password = req.body.password
        if (!fname) return res.status(400).send({ status: false, msg: "fname is required" })
        if (!lname) return res.status(400).send({ status: false, msg: "lname is required" })
        if (!title) return res.status(400).send({ status: false, msg: "title is required" })
        if (!email) return res.status(400).send({ status: false, msg: "email is required" })
        if (!password) return res.status(400).send({ status: false, msg: "password is required" })
        const isEmailUsed = await AuthorModel.findOne({ email });
        if (isEmailUsed) {
            return res.status(400).send({
                status: false,
                msg: "email already used "
            })
        }

        let authorCreated = await AuthorModel.create(author)
        res.status(201).send({ status: true, msg: authorCreated })
    } catch (error) {
        res.status(400).send({ status: false, msg: error.message })
    }
}

const loginAuthor = async function(req, res) {
    try {
        let userName = req.body.email;
        let password = req.body.password;

        let author = req.body
        if (Object.keys(author) == 0) return res.status(400).send({ status: false, msg: "No input provided" })


        if (!userName) return res.status(400).send({ status: false, msg: "userName is required" })
        if (!password) return res.status(400).send({ status: false, msg: " password  is required" })

        let Author = await AuthorModel.findOne({ email: userName, password: password });
        if (!Author)
            return res.status(400).send({
                status: false,
                msg: "username or the password is not correct",
            });


        let token = jwt.sign({
                AuthorId: Author._id,
            },
            "functionup-thorium"
        );
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, data: token });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
};

module.exports.createAuthors = createAuthors
module.exports.loginAuthor = loginAuthor