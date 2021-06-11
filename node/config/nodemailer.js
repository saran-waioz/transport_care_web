const nodemailer = require('nodemailer');
const adminEmail = require('../models/adminEmail');
const strtr = require('./strtr');
const _ = require("lodash")
exports.sendMail = async(req, res, next) => {
    var email_username = process.env.EMAIL_USERNAME
    var email_password = process.env.EMAIL_PASSWORD
    var email_from = process.env.EMAIL_FROM
    var admin_email = await adminEmail.findOne({ slug:req.slug});
    var mail_content="";
    var subject = "";
    mail_content+='<div style="width:100%;font-size:15px;font-family:Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;"><div style="max-width:600px;margin:0 auto;background: #fff;border-radius: 5px;border: 1px solid #0c753c1f;"><div style="width: 100%;background: #3879CB;height: 5px;border-top-left-radius: 5px;border-top-right-radius: 5px;"></div><div style="text-align:center;width: 100%;"><img style="height:109px" src="'+process.env.APP_URL+'/assets/black_single.png"  /></div><div style="padding:10px">';
    if(admin_email && email_from!="")
    {
        mail_content+=strtr(admin_email.content, req.data);
        subject = strtr(admin_email.subject, req.data)
    }
    else if(req.data.content && req.data.content!="")
    {
        mail_content+=req.data.content;
        subject = req.data.subject;
    }
    mail_content+='</div><div style="width: 100%;background: #1E252E;height: 5px;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;"></div></div></div>';
    if(mail_content!="")
    {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, account) => 
        {
            // create reusable transporter object using the default SMTP transport
            const transporter = nodemailer.createTransport({
                service:'gmail',
                auth: {
                  user: email_username,
                  pass: email_password
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: email_from, 
                to: req.to, // list of receivers
                subject:subject, // Subject line
                html: mail_content // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                console.log(error, info,mailOptions)
                if (error) {
                    return false;
                }
                else
                {
                    return true;
                }
            });
        });
    }
    else
    {
        return true;
    }
};