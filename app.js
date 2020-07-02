const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { check, validationResult } = require('express-validator');
const errors = []
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("index",{errors:errors,name:"",email:"",number:"",password:"",})
});

app.post("/",
[
    // Name Validation
    check('name', 'Name is required.')
    .not().isEmpty(),
    // .isAlpha().withMessage('Name must contain only letters'),
    
    // Email validation
    check("email","Invalid email id").trim().isEmail(),

    // Phone number
    check("number")
    .isInt().withMessage('phone field must contain numbers only')
    .isLength({min: 10, max: 10}).withMessage('must be 10 digits'),

    // confirm password validation
    check('password', 'The password must be 5+ chars long and contain a number')
    .not().isIn(['123', 'password', 'god','qwerty']).withMessage('Do not use a common word as the password')
    .isLength({ min: 5 })
    .matches(/\d/),

    // confirm password validation
    check('cpassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        return true;
    })
],(req,res)=>{
    const errors = validationResult(req);
    const {name,email,password,cpassword,number} = req.body
    console.log(errors.mapped());
    if(!errors.isEmpty()){
        res.render("index",{
            errors:errors.mapped(),
            name:name,
            email:email,
            password:password,
            number:number
        });
    }else{
        res.render("login",{
            name:name,
            email:email,
            password:password,
            number:number
        })
    }
    
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


