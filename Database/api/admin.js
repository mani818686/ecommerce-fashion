const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")

const itemLib = require("../lib")
const adminModel = require("../models/admin")
const secretKey = process.env.secretOrPrivateKey


router.post("/signup", (req, res) => {
    adminModel.find({ email: req.body.email })
        .then((admin)=>{

            if (admin.length >= 1) {
                res.status(409).json({
                    message: "Email already exists",
                });
            } else {

                bcrypt.hash(req.body.password, 10, function(err, hash) {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        });
                    } else {
                        const admin = {
                            _id: new mongoose.Types.ObjectId(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email: req.body.email,
                            password: hash,
                            phoneNumber: req.body.phoneNumber,
                            address: req.body.address
                        };

                        var ti = new adminModel(admin);
                        ti.save()
                            .then((result)=>{
                                    res.status(201).json({
                                        message: "Admin created",
                                        userDetails: {
                                            userId: result._id,
                                            firstName:req.body.firstName,
                                            lastName:req.body.lastName,
                                            email: req.body.email,
                                            password: hash,
                                            phoneNumber: req.body.phoneNumber,
                                            address: req.body.address
                                        
                                        },
                                    })
                                })
                        .catch((err)=>{
                            res.status(500).json({
                                error: err,
                            })
                        })
                    }
                });
            }
        })
        .catch((err)=>{
            res.status(500).json({
                error: err.toString(),
            });
        })

    })



router.post("/login", (req, res) => {
    adminModel.find({email:req.body.email})
    .then((admin)=>{
        if (admin.length < 1) {
            return res.status(401).json({
                message: "Auth failed: Email not found probably",
            });
        }
        console.log(req.body, admin)
        bcrypt.compare(req.body.password, admin[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Auth failed",
                });
            }
            if (result) {
                const token = jwt.sign({
                        userId: admin[0]._id,
                        firstName:admin[0].firstName,
                        lastName:admin[0].lastName,
                        email: admin[0].email,
                        password: admin[0].password,
                        phoneNumber: admin[0].phoneNumber,
                        address: admin[0].address
                       
                    },
                    process.env.jwtSecret, {
                        expiresIn: "1d",
                    },
                );

                return res.status(200).json({
                    message: "Auth successful",
                    userDetails: {
                        userId: admin[0]._id,
                        firstName:admin[0].firstName,
                        lastName:admin[0].lastName,
                        email: admin[0].email,
                        password: admin[0].password,
                        phoneNumber: admin[0].phoneNumber,
                        address: admin[0].address
                      
                    },
                    token: token,
                });
            }
            res.status(401).json({
                message: "Auth failed1",
            });

        })
    })
    .catch((err)=>{
        res.status(500).json({
            error: err,
        });
    })

})


module.exports = router