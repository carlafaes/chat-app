const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    console.log('controller register', req.body);
    try {

        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({
                message: 'El nombre de usuario ya existe',
                status: false
            });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({
                message: 'El correo electronico ya existe',
                status: false
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })
        delete user.password;
        return res.status(201).json({ status: true, user });
    }
    catch (err) {
        return res.status(500).json({
            message: 'error registrando usuario',
            error: err
        });
    }
}

module.exports.login = async (req, res, next) => {
    console.log('controller login', req.body);
    try {

        const { email, password } = req.body;
     
        const emailCheck = await User.findOne({ email });
        if (!emailCheck) {
            return res.json({
                message: 'Correo electronico o contraseña incorrectos',
                status: false
            });
        }

        const validPassword = await bcrypt.compare(password, emailCheck.password);
        if (!validPassword) {
            return res.json({
                message: 'Correo electronico o contraseña incorrectos',
                status: false
            });
        }
        delete emailCheck.password;
        return res.status(200).json({ status: true, user: emailCheck });
    }
    catch (err) {
        return res.status(500).json({
            message: 'error iniciando sesion de usuario',
            error: err
        });
    }
}

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        });
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage
        });
    }
    catch (err) {
        next(err)
    }
    console.log(avatarImage,'avatarImage');
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.params.id } }).select([
                'username',
                'email',
                'avatarImage'
            ]);
        return res.json(users);
    }
    catch (err) {
        next(err)
    }
}