const connection = require('../Models/connection');
const jwt = require('jsonwebtoken');


const validatePassword = (req, res,next) => {
    try {
        const {senha , confirmarSenha} = req.body;

        if (senha !== confirmarSenha) {
            return res.status(422).json({msg: 'As senhas não conferem!'})
        }

        next();
    } catch (error) {
        return res.status(500).json({ status: 10});
    }
    
};


const validateEmail = async(req, res, next) => {
    
    try{
        const {usu_email} = req.body;
        
        const queryEmail = 'SELECT * FROM Usuarios WHERE usu_email = ?';

        const [findEmail] = await connection.execute(queryEmail, [usu_email])
        if(findEmail.length !== 0) {
            return res.status(401).json({msg: "Email ja cadastrado! utilize outro email"});
        }

        next();
    } catch (error) {
        return res.status(500).json({ status:22 ,msg:error.message});
        //console.log(msg: error.message);
    }
};



const validarLogin = async (req, res, error, next) => {
    if (error) {
        return res.status(500).json({msg: error.message});
    }
    next();
};

const validarToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({msg: 'Token não encontrado'});
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({msg: 'Token inválido ou expirado'});
    }

};


module.exports = { 
    validarLogin,
    validateEmail,
    validatePassword,
    validarToken
 };
