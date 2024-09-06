const ProductsDB = require('../schemas/products-schema');
const UsersDB = require('../schemas/users-schema');
const OrdersDB = require('../schemas/checkoutschema');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const usersSchema = require('../schemas/users-schema');
const jwtkey = "passwordofme1234";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "judoboxing1234@gmail.com",
        pass: "lcgnmfvlsbgzdwtm",
    },
    tls: {
        rejectUnauthorized: false // This allows self-signed certificates
    }
});

const sendMail = async (transporter, info) => {
    //console.log("here2")
    try {
        await transporter.sendMail(info)
        console.log("email send succ")

    } catch (error) {
        console.log(error)
    }
}

exports.getIndexPage = async (req, res) => {
    let products = await ProductsDB.find();
    //search for user
    const user = await UsersDB.findById(req.session.userID);
    
    
    res.render('index', {
        products: products,
        cartlen: (req.session.isLoggedIn ? user.cart.length : 0),
        isLogged: req.session.isLoggedIn,
        searchFilter: req.flash('searchFilter'),
        isAdmin:(user?.email?user.email==='o.alaa51003@gmail.com':false)
    })

}

exports.getSignUpPage = (req, res) => {
    res.render('signup', {
        signupData: req.flash('signupData')
    });
}

exports.getSignInPage = async(req, res) => {
    res.render('signin', {
        errorMessage: req.flash('signinError')
    });
};

exports.postSignup = async (req, res) => {
    const {
        username,
        email,
        password,
        confirm_password
    } = req.body;
    if (!username) {
        return res.status(400).json("please enter your email"); //400 bad request
    }
    if (!email) {
        return res.status(400).json("please enter your email");
    }
    if (!password) {
        return res.status(400).json("please enter your password"); //400 bad request
    }
    if (!confirm_password) {
        return res.status(400).json("please confirm your password");
    }
    req.flash('signupData', username)
    req.flash('signupData', email)
    req.flash('signupData', password)
    req.flash('signupData', confirm_password);

    // let score=0;
    // //console.log(password.length);
    // if(password.length<7)
    // {
    //     req.flash('signupData','password length must be 8 or greater');
    //     return res.status(400).redirect('/signup');
    // }

    // if (password.match((/[a-z]+/)))
    // {
    //     score++;
    // }
    // if (password.match((/[A-Z]+/)))
    // {
    //     score++;
    // }
    // if(password.match(/[0-9]+/))
    // {
    //     score++;
    // }
    // if(password.match(/[$@#&!]+/))
    // {
    //     score+=2;
    // }
    //console.log(passwordStrength('asdfasdf').value);
    /* if(passvald(req.body.password).value==0 || passvald(req.body.password).value==0 )
    {
        return res.status(400).json("weak password");
    }*/

    const user1 = await UsersDB.find({
        email: req.body.email
    });
    if (user1.length && user1.isverify=="true") {
        req.flash('signupData', 'this email alerady taken');
        return res.status(400).redirect('/signup');
    }

    const verificationToken = crypto.randomBytes(64).toString('hex');

    link=`http://127.0.0.1:3000/verify/${verificationToken}`
    

    
    const info = {
        from: {
            name: 'Marshmello',
            address: "judoboxing1234@gmail.com" // Your website email
        },
        to: [req.body.email], // List of receivers
        subject: "Verify Your Email Address to Complete Your Registration", // Subject line
        text: "Please verify your email address to complete your registration.",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <!-- Header with Company Name -->
                <div style="background-color: #00563f; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Marshmello</h1>
                </div>
        
                <!-- Main Content -->
                <div style="padding: 20px;">
                    <p style="font-size: 16px;">Hello ${req.body.username},</p>
        
                    <p style="font-size: 14px; line-height: 1.6;">
                        Welcome to <strong>Marshmello</strong>! We're excited to have you as part of our community. To complete your registration, please verify your email address by clicking the button below.
                    </p>
        
                    <!-- Verification Button -->
                    <p style="text-align: center;">
                        <a href="${link}" style="display: inline-block; padding: 12px 24px; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Your Email</a>
                    </p>
        
                    <p style="font-size: 14px; line-height: 1.6;">
                        If you did not create an account with us, please disregard this email. If you have any questions or need assistance, feel free to contact our support team.
                    </p>
        
                    <p style="font-size: 14px; line-height: 1.6;">
                        Thank you for joining Marshmello! We look forward to providing you with an exceptional shopping experience.
                    </p>
        
                    <p style="font-size: 14px; line-height: 1.6;">
                        Best Regards,<br>
                        The Marshmello Team
                    </p>
                </div>
        
                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;">
                    <p>Need help? Contact us at <a href="mailto:support@marshmello.com" style="color: #00563f;">support@marshmello.com</a></p>
        
                    <!-- Social Media Links -->
                    <div style="margin: 10px 0;">
                        <a href="your-facebook-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;">
                        </a>
                        <a href="your-twitter-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;">
                        </a>
                        <a href="your-instagram-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;">
                        </a>
                    </div>
        
                    <p>&copy; 2024 Marshmello. All rights reserved.</p>
                </div>
            </div>
        `,
    };
    
    
   
    
    if (req.body.password === req.body.confirm_password) {
        req.body.cart = [];
        const hashpassword = req.body.password;
        bcrypt.hash(hashpassword, 5, async(err, hash) => {
            if (err) {
                console.log("hash failed");
                return;
            }
            req.body.password = hash;
            await sendMail(transporter, info);
            const newUser = new UsersDB({
                username,
                email,
                password:hash,
                isverify: false, 
                Vcode:verificationToken 
            });
            newUser.save().then(() => {
                res.redirect('/signin');
            })
        })
        // if(score>=3)
        // {

        // }
        // else
        // {
        // return res.status(400).json("please enter a stronger password");

        // }

    } else {
        req.flash('signupData', 'confirmation password does not match');
        return res.status(400).redirect('/signup');
    }
}


exports.getverify=async(req,res)=>
{
    //console.log("asser")
    token=req.params.token;
    const user=await usersSchema.findOne({Vcode:token})
    //console.log(user)

    if (!user) {
        return res.status(400).json("Invalid or expired verification token");
    }

    user.isverify = true;
    user.Vcode =null;
    await user.save(); 
    res.redirect('/signin');


}



exports.postsignin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email) {
        return res.status(400).json("please enter your email");
    }
    if (!password) {
        return res.status(400).json("please enter your password");
    }
    console.log(email);
    console.log(password);
    const user = await UsersDB.find({
        email: req.body.email
    })


    if (user.length == 0) {
        req.flash('signinError', 'invalid email or password');
        return res.redirect('/signin');
    }


    bcrypt.compare(password, user[0].password, async (err, result) => {
        if (err) {
            // Handle error
            console.error('Error comparing passwords:', err);
            return;
        }

        if (result && user[0].isverify==true) {
            req.session.isLoggedIn = true;
            req.session.userID = user[0]._id;
            res.status(200).redirect('/');
        } else {
            req.flash('signinError', 'invalid email or password');
            res.status(400).redirect('/signin');

        }
    })
}

function calcSum(cart) {
    let sum = 0;
    for (product of cart) {
        sum += product.qnty * product.price;
    }
    return sum;
}

exports.getcartpage = async (req, res) => {
    const user = await UsersDB.findById({
        _id: req.session.userID
    });
    // console.log(cartProdID);
    let cart = [];
    let usercart=[];
    let sum = 0;
    for (product of user.cart) {
        const prod = await ProductsDB.findById(product.prodId);
        if(prod)
        {
            cart.push({
                prod: prod,
                qnty: product.qnty
            });

            usercart.push({
                prodId:product.prodId,
                qnty:product.qnty
            })
           
            sum += prod.price * product.qnty;
            
        }
        else
        {
            console.log(`not found ${product.prodId}`)

        }
        
    }
    
     user.cart=usercart;
     user.save()
    
    res.render('cart', {
        cart: cart,
        totalPrice: sum
    });

}



exports.postCart = (req, res) => {
    const prodID = req.params.ID;
    user=UsersDB.findById(req.session.userID)
        .then((user) => {
            if (!user) {
                throw new Error('User not found'); 
            }

            const cart = user.cart;
            // Check if product exists
            const idx = cart.findIndex(prod => prod.prodId === prodID);

            if (idx === -1) {
                // Not found
                cart.push({
                    prodId: prodID,
                    qnty: 1
                });
            } else {
                // Found
                cart[idx].qnty++;
            }

            return user.save(); 
        })

        
       
           
        res.json({
            usercart:user
            
        })
        
};


exports.clearCart = async (req, res) => {
    await UsersDB.findOneAndUpdate({
        _id: req.session.userID
    }, {
        cart: []
    }, {
        new: true
    });
    res.redirect('/');
}


exports.getChangePassword = (req, res) => {
    res.render('changepassword');
}

exports.postChangePassword = async (req, res) => {

    const email1 = req.body.email;
    const isfound = await UsersDB.find({
        email: email1
    });
    //console.log(isfound);

    const oldpassword = req.body.current_password;
    const newpassword = req.body.new_password;

    const confirmpassword = req.body.confirm_password;
    if (!oldpassword) {
        return res.status(400).json("enter your current password");

    }
    if (!newpassword) {
        return res.status(400).json("enter your new password");

    }
    if (!confirmpassword) {
        return res.status(400).json("enter your confirmation password");
    }

    if (isfound.length === 0) {
        return res.status(400).json("incorrect email");
    }
    if (newpassword !== confirmpassword) {
        return res.status(400).json("password dosnt match");
    }

    bcrypt.compare(oldpassword, isfound[0].password, async (err, result) => {
        if (err) {
            console.error('Error in comparing passwords:', err);
            return;
        }
        if (result) {
            bcrypt.hash(newpassword, 5, async (err, hash) => {
                if (err) {
                    console.log("hash failed");
                    return;
                }

                await UsersDB.findOneAndUpdate({
                    email: email1
                }, {
                    password: hash
                }, {
                    new: true
                });
                res.redirect("/signin");

            })

        }
        if (!result) {
            return res.status(400).json("password dosnt match");
        }

    })

}

exports.postlogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/signin');
    })
}

async function cartSum(cart) {
    let sum = 0;
    for (cartItem of cart) {
        let product = await ProductsDB.findById(cartItem.prodId)

        sum += product.price * cartItem.qnty;
    }
    return sum;
}

exports.getCheckoutpage = async (req, res) => {
    UsersDB.findById(req.session.userID)
        .then((user) => {

            cartSum(user.cart).then((sum) => {
                res.render('checkout', {
                    totalPrice: sum
                });
            })
        })
}
exports.postcheckoutpage = async (req, res) => {
    if (!req.body.phone) {
        res.status(400).json("please enter your phone number");
    }

    if (!req.body.address) {
        res.status(400).json("please enter your address");
    }

    //console.log(req.body);
    const user = await UsersDB.findById(req.session.userID);
    req.body.email = user.email;
    req.body.cart = user.cart;
    //console.log(user.cart.name);
    req.body.status = 'pending'
    user.cart = [];
    const info = {
        from: {
            name: 'Marshmello Notifications',
            address: "judoboxing1234@gmail.com" // Website email
        },
        to: ["assermohamed337@gmail.com"], // Admin email
        subject: "New Order Received", // Subject line
        text: "A new order has been placed. Check it on your website.",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <!-- Header with Company Name -->
                <div style="background-color: #00563f; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Marshmello</h1>
                </div>
    
                <!-- Main Content -->
                <div style="padding: 20px;">
                    <h3 style="font-size: 20px; margin: 0 0 10px;">Congratulations!</h3>
                    <p style="font-size: 14px; line-height: 1.6;">
                        A new order has been successfully placed on your website. Please review the details and process the order promptly.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;"><strong>Customer Email:</strong> ${user.email}</p>
                    <p style="font-size: 14px; line-height: 1.6;"><strong>Phone Number:</strong> ${req.body.phone}</p>
    
                    <!-- Call to Action Button -->
                    <p style="text-align: center;">
                        <a href="http://127.0.0.1:3000/admin/signin" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">View Order Details</a>
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        Thank you for managing your orders diligently. If you have any questions, feel free to contact support.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        Best Regards,<br>
                        The Marshmello Team
                    </p>
                </div>
    
                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;">
                    <p>Need assistance? Contact us at <a href="mailto:support@marshmello.com" style="color: #00563f;">support@marshmello.com</a></p>
    
                    <p>&copy; 2024 Marshmello. All rights reserved.</p>
                </div>
            </div>
        `,
    };
    


    const info2 = {
        from: {
            name: 'Marshmello Support',
            address: "judoboxing1234@gmail.com" // Website email
        },
        to: [user.email], // User email
        subject: "Order Confirmation - Thank You for Your Purchase!", // Subject line
        text: "Thank you for your order! Your order has been received and is being processed.",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <!-- Header with Company Name -->
                <div style="background-color: #00563f; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Marshmello</h1>
                </div>
    
                <!-- Main Content -->
                <div style="padding: 20px;">
                    <h3 style="font-size: 20px; margin: 0 0 10px;">Thank You for Your Order!</h3>
                    <p style="font-size: 14px; line-height: 1.6;">
                        Dear ${user.username}, your order has been successfully received and is now being processed. Our team is reviewing your order, and an admin will be in touch with you shortly to confirm the details.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        If you have any questions or need further assistance, please don't hesitate to reach out to our support team. We're here to help you every step of the way.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        Thank you for choosing Marshmello. We appreciate your business and look forward to serving you!
                    </p>
    
                    <!-- Footer -->
                    <p style="font-size: 14px; line-height: 1.6;">
                        Best Regards,<br>
                        The Marshmello Team
                    </p>
                </div>
    
                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;">
                    <p>Need help? Contact us at <a href="mailto:support@marshmello.com" style="color: #00563f;">support@marshmello.com</a></p>
    
                    <p>&copy; 2024 Marshmello. All rights reserved.</p>
                </div>
            </div>
        `,
    };
    

    await user.save();
    const addcheckout = new OrdersDB(req.body);
    await sendMail(transporter, info);
    await sendMail(transporter, info2);
    addcheckout.save().then(() => {
        res.redirect('/');
    })


}
exports.postSearch = async (req, res) => {
    //updated
    const {
        search
    } = req.body;
    req.flash('searchFilter', search);
    res.redirect('/');
}

exports.getOrdersPage = async (req, res) => {

    const user = await UsersDB.findById(req.session.userID);
    const emailofuser = user.email



    const orders = await OrdersDB.find({
        email: emailofuser
    });

    res.render('userOrdersPage', {
        orders: orders,
        orderData: req.flash('orderData')

    });
}

exports.getOrderDetails = async (req, res) => {
    const orderid = req.params.ID

    const order = await OrdersDB.findById(orderid);
    const idofproduct = [];
    const qnties = [];

    for (let item of order.cart) {
        idofproduct.push(item.prodId);
        qnties.push(item.qnty);
    }
    const products = [];
    for (let i = 0; i < idofproduct.length; i++) {
        const product = await ProductsDB.findById(idofproduct[i]);
        products.push(product)
        products.push(qnties[i]);

    }


    res.render('details-orders', {
        products: products,
        isAdmin: false
    });
}

exports.removeCartItem = async (req, res) => {
    const prodID = req.params.ID;
    const user = await UsersDB.findById(req.session.userID);
    let cart = user.cart;


    const idx = cart.findIndex(product => product.prodId === prodID);
    // console.log(cart[idx].qnty);
    if (cart[idx].qnty == 1) {
        cart = cart.filter(product => product.prodId !== prodID);
    } else
        cart[idx].qnty--;
    // console.log(cart);
    user.cart = cart;
    user.save().then(() => {
        res.redirect('/cart');
    })
}

exports.deleteOrder = async (req, res) => {
    const orderID = req.params.ID;
    //realtime error fix
    const order = await OrdersDB.findById(orderID);
    if (order.status === 'pending') {
        await OrdersDB.findByIdAndDelete(orderID);
    } else {
        //flash required
        req.flash('orderData', 'Can not delete order it is on its way!');
    }

    res.redirect('/orders');
}

exports.getforgetpassword = (req, res) => {
    res.render('forgetpassword');

}

exports.postforgetpassword = async (req, res) => {

    const useremail = req.body.email;
    if (!useremail) {
        res.status(400).json("please enter your email");
    }
    const user = await UsersDB.find({
        email: useremail
    });
    if (!user) {
        res.status(400).json("email not found");
    }``
    const token = await jwt.sign({
        email: user[0].email,
        id: user[0]._id
    }, jwtkey, {
        expiresIn: '50m'
    });

    const userId = user[0]._id;
    const tokenParam = token;

    //console.log(userId);


    const link = `http://127.0.0.1:3000/resetpassword/${userId}/${token}`


    const info = {
        from: {
            name: 'Marshmello Support',
            address: "judoboxing1234@gmail.com"
        },
        to: [req.body.email], // list of receivers
        subject: "Email Verification Required", // Subject line
        text: "New order - check it on your website.",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <!-- Header with Company Name -->
                <div style="background-color: #00563f; padding: 20px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 24px;">Marshmello</h1>
                </div>
    
                <!-- Main Content -->
                <div style="padding: 20px;">
                    <p style="font-size: 16px;">Dear ${user[0].username},</p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        We have received a request to verify your email address associated with your account. To complete this process and ensure the security of your account, please click the button below to validate your email.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        If you did not make this request, please ignore this email or contact our support team for assistance.
                    </p>
    
                    <!-- Call to Action Button -->
                    <p style="text-align: center;">
                        <a href="${link}" style="display: inline-block; padding: 12px 24px; margin: 20px 0; font-size: 16px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        Thank you for your attention, and please feel free to reach out if you have any questions.
                    </p>
    
                    <p style="font-size: 14px; line-height: 1.6;">
                        Best Regards,<br>
                        The Marshmello Team
                    </p>
                </div>
    
                <!-- Footer -->
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #555;">
                    <p>Need help? Contact us at <a href="mailto:support@marshmello.com" style="color: #00563f;">support@marshmello.com</a></p>
    
                    <!-- Social Media Links -->
                    <div style="margin: 10px 0;">
                        <a href="your-facebook-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;">
                        </a>
                        <a href="your-twitter-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" style="width: 24px; height: 24px;">
                        </a>
                        <a href="your-instagram-url" style="text-decoration: none; margin: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" style="width: 24px; height: 24px;">
                        </a>
                    </div>
    
                    <p>&copy; 2024 Marshmello. All rights reserved.</p>
                </div>
            </div>
        `,
    };
    


    
    await sendMail(transporter, info);
    res.render('forgetpassword');
}



exports.getresetpassword = async (req, res) => {
    const userId = req.params.userId;
    const token = req.params.token;
    //console.log(token);

    try {
        jwt.verify(token, jwtkey);
    } catch (err) {
        console.error(err);
        return res.status(401).json("invalid token");
    }

    res.render('resetpassword', {
        userId,
        token
    });

};


exports.postresetpassword = async (req, res) => {
    const pass = req.body.password;
    const newpass = req.body.confirmpassword;
    const token = req.params.token
    //console.log("asser");



    if (!pass) {
        return res.status(401).json("enter password");
    }
    if (!newpass) {
        return res.status(401).json("enter confirmation password");
    }


    try {
        jwt.verify(token, jwtkey);
    } catch (err) {
        console.error(err);
        return res.status(401).json("invalid token");
    }



    if (pass === newpass) {
        bcrypt.hash(pass, 5, async (err, hash) => {
            if (err) {
                console.log("hash failed");
                return;
            } else {
                //console.log(hash);

                await UsersDB.findOneAndUpdate({
                    _id: req.params.userId
                }, {
                    password: hash
                }, {
                    new: true
                });
                res.redirect('/signin');
            }

        })


    } else {
        return res.status(401).json("incorrect confirmation");
    }


}