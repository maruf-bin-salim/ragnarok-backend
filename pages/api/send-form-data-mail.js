const nodemailer = require('nodemailer');
import Cors from 'cors';


const cors = Cors({
    origin: '*',
    methods: ['POST'], // Specify the allowed HTTP methods
});



export default async function handler(req, res) {

    // Run cors
    await cors(req, res);

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(404).json({
            error: "Method not allowed"
        });
        return;
    }


    if (!req.body.email) {
        res.status(404).json({
            error: "Invalid request"
        });
        return;
    }




    let html = `
        <div style="border: 3px solid #000; padding: 10px;">
            <p> Name : ${req.body.name} </p> 
            <p> Email Address : ${req.body.email} </p> 
            <p> Phone Number : ${req.body.phone} </p> 
            <p> User's Message : ${req.body.message} </p>
        </div>
    `;



    // create message object
    const message = {
        from: "creditriver01@gmail.com", // Sender address
        to: "marufbinsalim01@gmail.com", // List of recipients
        subject: "New Message from a user on The Credit River Company Website, Contact Form",
        text: "",
        html: html,
    };

    // create transporter object
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "creditriver01@gmail.com",
            pass: "tjtnsaiifbqzaybf",
        },
    });

    // send mail
    transporter.sendMail(message, (err, info) => {

        // if error, return error
        if (err) {
            res.status(404).json({
                error: `${err}`
            });
        } else {
            // if success, return success message
            res.status(200).json({
                success: `Message delivered to : ${info.accepted}`
            });
        }
    });

}

// curl -X POST -H "Content-Type: application/json" -d '{"name":"Maruf Bin Salim","email":"marufbinsalim01@gmail","phone":"647-786-1234","message":"Hello, I am interested in your products"}' http://localhost:3000/api/send-form-data-mail