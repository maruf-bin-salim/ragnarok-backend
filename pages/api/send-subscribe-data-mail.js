const nodemailer = require('nodemailer');
import Cors from 'cors';


const send_to = 'info@thecreditrivercompany.com';

// Helper function to initialize middleware
function initMiddleware(middleware) {
    return (req, res) =>
        new Promise((resolve, reject) => {
            middleware(req, res, (result) => {
                if (result instanceof Error) {
                    return reject(result);
                }
                return resolve(result);
            });
        });
}

// Create CORS middleware
const corsMiddleware = initMiddleware(
    Cors({
        origin: '*', // Replace with your frontend domain
        methods: ['GET', 'POST'], // Add the allowed HTTP methods
        optionsSuccessStatus: 200, // Set the CORS success status
    })
);

// Your API route handler
export default async function handler(req, res) {
    // Run the CORS middleware
    await corsMiddleware(req, res);

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(404).json({
            error: 'Method not allowed'
        });
        return;
    }

    // get email from request body
    const email = req.body.email;

    if (!email) {
        res.status(404).json({
            error: 'Invalid request'
        });
        return;
    }

    // create html template
    const html = `
        <div style="border: 3px solid #000; padding: 10px;">
            A user with Email "${email}" has signed up for info on new products and discount code
        </div>
    `;

    // create message object
    const message = {
        from: 'creditriver01@gmail.com', // Sender address
        to: send_to, // List of recipients
        subject: 'New Sign-up for Product Info and Discount Code, on The Credit River Company Website',
        text: '',
        html: html
    };

    // create transporter object
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'creditriver01@gmail.com',
            pass: 'tjtnsaiifbqzaybf'
        }
    });

    // send mail
    transporter.sendMail(message, (err, info) => {
        // if error, return error
        if (err) {
            res.status(500).json({
                error: `${err}`
            });
        } else {
            // if success, return success message
            res.status(200).json({
                success: `Message delivered to: ${info.accepted}`
            });
        }
    });
}


// curl -X POST -H "Content-Type: application/json" -d '{"email":"marufbinsalim01@gmail"}' http://localhost:3000/api/send-subscribe-data-mail