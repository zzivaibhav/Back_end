import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import { User } from "./model/User.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import {Product} from "./model/Product.js"
import { Category } from "./model/Category.js"
import {Carousal} from "./model/Carousal.js"
import jwt from "jsonwebtoken"
const app= express()

app.use(cors({
    origin:"*",
    credentials : true
}))

app.use(express.json({
    limit: "40kb"
}))
const connect = async()=>{
    try {
      const connectionInstance = await mongoose.connect("mongodb+srv://vaibhav:savi1703@cluster0.til2vdt.mongodb.net/");
      console.log(`Connected to mongodb of ClickCart ${connectionInstance.connection.host}`);
    } catch (err) {
      console.log('Error:' + err);
    }
  }
  connect()





//API to Register a user
app.post('/register', async (req, res) => {
    try {
      const {name, email, password} = req.body;
      //check if email is already registered.
      const exsitingUser = await User.findOne({email});
      if (exsitingUser) {
        return res
          .status(400)
          .send('Email already registered on the application.');
      }
      //create new user.
      const newUser = new User({name, email, password});
      //generate and store the verification token for this new user.
      newUser.verificationToken = crypto.randomBytes(20).toString('hex');
      //save the user to the database
      await newUser.save();
  
      //send verifica   tion email to the user.
      sendVerificationEmail(newUser.email, newUser.verificationToken);
      res
        .status(200)
        .send(
          'New user successfully created and verification mail is sent to the email',
        );
    } catch (e) {
      console.log('Error in registering new user', e);
      res.status(500).send(e);
    }
  });
  
//API to send verification email to the user.

const sendVerificationEmail = async (email, verificationToken) => {
    //create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      //configuration of the email servicessign
      service: 'gmail',
      auth: {
        user: 'amazoonllc@gmail.com',
        pass: 'ipiu xfgi jlsv pqeg',
      },
    });
    //compose the email messege.
    const mailOptions = {
      from: 'clickcart.com',
      to: email,
      subject: 'Email verification',
      text: `Click on the link to verify your registration : http://localhost:9000/verify/${verificationToken}`,
    };
    //send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (e) {
      console.log('Error in sending the verification email', e);
    }
  };

  app.get('/verify/:token', async (req, res) => {
    try {
      const token = req.params.token;
      //find the user with the given token
      const user = await User.findOne({verificationToken: token});
      if (!user) {
        return res.status(404).send('Invalid verification token');
      }
      //mark the user as verified
      user.verified = true;
      user.verificationToken = undefined;
      await user.save(); //saving the user again because the verification toke value is updated.
      res.status(200).send('Email verified successfully');
    } catch (e) {
      res.state(500).send('Email verification failed');
    }
  });

  const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
  }; 
  const secretKey = generateSecretKey();
 
 
  app.get('/getProductSliderOne', async (req, res) => {
    try {
      //filtering the product from root directory
      const data = await Product.find({productSlider: 'true'}).select(
        //select is used to filter the properties in the backend
        'name imageOne',
      );
  
      res.status(201).send(data);
    } catch (e) {
      console.log(e);
      res.status(500).send('ERROR WHILE RETRIEVING THE DATA');
    }
  });
 
  //API to get categories data
app.get('/getCategory', async (req, res) => {
  try {
    const categories = await Category.find();
    console.log(categories);

    res.status(200).send(categories);
  } catch (e) {
    console.log(e);
    res.status(500).send('ERROR WHILE RETRIEVING THE DATA');
  }
});
 

//API to get carousal data


app.get('/getCarousal', async (req, res) => {
    try {
      const images = await Carousal.find();
  
      res.status(200).send(images);
    } catch (e) {
      res.status(401).send('ERROR IN GETTING IMAGE CAROUSAL FROM DATABASE.');
      console.log(e);
    }
  });


  //API to get DealsSquare
app.get('/getDealsSquare', async (req, res) => {
    try {
      const data = await Product.find({deals: true});
      console.log(data);
      res.status(201).send(data);
    } catch (e) {
      console.log(e);
      res.status(401).send('ERROR IN GETTING DATA OF SQUARES OF DEALS');
    }
  });



//API to load categories in the second tab screen
app.get('/catLoad/:name', async (req, res) => {
    try {
      const name = req.params.name;
      if (name === 'Clothes') {
        const data = await Product.find({category: 'c'});
  
        res.status(201).send(data);
      }
      if (name === 'Shoes') {
        const data = await Product.find({category: 's'});
        res.status(201).send(data);
      }
      if (name === 'Gadgets') {
        const data = await Product.find({category: 'g'});
        res.status(201).send(data);
      }
      if (name === 'Jewelries') {
        const data = await Product.find({category: 'j'});
        res.status(201).send(data);
      }
      if (name === 'Beauty') {
        const data = await Product.find({category: 'b'});
        res.status(201).send(data);
      }
    } catch (error) {
      console.log(
        'ERROR WHILE LOADING ITEMS IN THE DIFFERENT CATEGORIES: ' + error,
      );
      res.status(503).send(error);
    }
  });

  // API to fetch data for the ProductScreen.
app.get('/navigateToProduct/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const data = await Product.findOne({_id: productId});
      console.log(data);
      res.status(201).send(data);
    } catch (error) {
      console.log('ERROR WHILE REACHING TO PRODUCT PAGE: ' + error);
      res.status(501).send(error);
    }
  });


  app.post('/loginToApplication', async (req, res) => {
    try {
      const {email, password} = req.body;
      //check if user exists.
      const user = await User.findOne({email});
      if (!user) {
        return res.status(401).send('Invalid Email');
      }
      //check if password is right or not.
      if (user.password !== password) {
        return res.status(401).send('Invalid Password');
      }
      //generate a token.
      const token = jwt.sign({userId: user._id}, secretKey);
      console.log(token);
  
      res.status(200).send(token);
    } catch (error) {
      res.status(501).send('Login Failed');
    }
  });
  
  app.listen(9000,()=>{
    console.log("Server running on the : 9000")
  })

