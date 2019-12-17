const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rhuysen@gmail.com', 
        subject: 'Thanks for using our app!',
        text: `Welcome to you, ${name}`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rhuysen@gmail.com',
        subject: 'We are sad', 
        text: `Why are you leaving us, ${name}?`
    })
}

const sendPasswordResetEmail = (email, password) => {
    console.log('firing');
    sgMail.send({
        to: email,
        from: 'rhuysen@gmail.com',
        subject: 'Request new password',
        text: `Dear Person, here is your new password: ${password}`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail,
    sendPasswordResetEmail
}
