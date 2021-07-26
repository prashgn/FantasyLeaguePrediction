const db = require('../config/db.config.js');
const User = db.user;

// Save FormData - User to MySQL
exports.save = (req, res) => {
    console.log('Post a Customer: ' + JSON.stringify(req.body));

    User.create(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        },
        {
            attributes: { include: ['firstname', 'lastname'] },
        }
    ).then((user) => {
        res.send(user);
    });
};

// Fetch all Users
exports.findAll = (req, res) => {
    console.log('Get All Customers');
    User.findAll({
        attributes: ['id', 'name', 'email'],
    }).then((user) => {
        /* res.send(users); */
        console.log(user);
        res.render('profiles', { data: user });
        console.log('profiles');
    });
};