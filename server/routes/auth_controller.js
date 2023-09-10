const pool = require('./db');
const bcrypt = require('bcrypt');
const get_from_accounts_db = require('../get_from_accounts_db');


createAccount = async (req, res) =>{
    try{
        if(!req.body.firstName) return res.json({errMessage: "Must input your first name."});
        else if(!(/^[a-z ,.'-]+$/i.test(req.body.firstName))) return res.json({errMessage: "Invalid email."});

        if(!req.body.lastName) return res.json({errMessage: "Must input your last name."});
        else if(!(/^[a-z ,.'-]+$/i.test(req.body.firstName))) return res.json({errMessage: "Invalid email."});

        if(!req.body.email) return res.json({errMessage: "Must input your email."});
        else if(await get_from_accounts_db.getUserByEmail(req.body.email)) return res.json({errMessage: "Email already exists."});
        else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) return res.json({errMessage: "Invalid email."});
    
        if(!req.body.password) return res.json({errMessage: "Must input your password."});
        else{
            if(req.body.password.length <= 8) return res.json({errMessage: "Password must be at least 8 characters long."});
            if(!(/[A-Z]/.test(req.body.password))) return res.json({errMessage: "Password must contain at least one uppercase letter."});
            if(!(/[a-z]/.test(req.body.password))) return res.json({errMessage: "Password must contain at least one lowercase letter."});
        }
        
        if(!req.body.repeatPassword) return res.json({errMessage:"Must repeat password."});
        else if(req.body.repeatPassword != req.body.password) return res.json({errMessage:"Password does not match."});

        const {firstName, lastName, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query("INSERT INTO accounts (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)", [firstName, lastName, email, hashedPassword], async (error, result) => {
            if(error) throw error;

            const user = await get_from_accounts_db.getUserByEmail(email);
            
            pool.query("INSERT INTO profiles (user_id, name, tel_nr, country, city, address, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7)", [user.id, `${firstName} ${lastName}`, null, null, null, null, null], (error, result) => {
                if(error) throw error;
        
                res.status(201).json({succMessage:"Account created succesfully."});
            });

        });
    }
    catch(error){
        return res.status(500).json(error);
    }
};

getAccounts = (req, res) =>{
    pool.query("SELECT * FROM accounts", (error, result) => {
        if(error) throw error;

        res.status(200).json(result.rows);
    });
};

getProfiles = (req, res) =>{
    pool.query("SELECT * FROM profiles", (error, result) => {
        if(error) throw error;

        res.status(200).json(result.rows);
    });
};

getReviews = (req, res) =>{
    pool.query("SELECT * FROM reviews", (error, result) => {
        if(error) throw error;

        res.status(200).json(result.rows);
    });
};

getReviewsById = (req, res) =>{
    const id = parseInt(req.params.id);
    pool.query("SELECT * FROM reviews WHERE product_id = $1", [id], (error, result) => {
        if(error) throw error;

        res.status(200).json(result.rows);
    });
};

getEmail = async (req, res) =>{
    const user = await get_from_accounts_db.getUserByEmail("john@gmail.com");
    if(user) res.status(200).json(user);
    else res.send("Nu exista");
}

getUser = (req, res) =>{
    if(req.user) res.status(200).json(req.user);
    else res.status(200).json({errMessage: "No user"});
}

getProfile = (req, res) =>{
    if(req.user) {
        pool.query("SELECT * FROM profiles WHERE user_id = $1", [req.user.id], (error, result) => {
            if(error) throw error;
            res.status(200).json({...result.rows[0], email: req.user.email});
        });
    }
    else res.status(200).json({errMessage: "No user"});
}

postEditProfile = (req, res) =>{
    try{
        if(req.user.id)
        {
            
            let { tel_nr, country, city, address, zip_code} = req.body;
            
            if(tel_nr == "null") tel_nr = null;
            if(country == "null") country = null;
            if(city == "null") city = null;
            if(address == "null") address = null;
            if(zip_code == "null") zip_code = null;
            
            

            pool.query("UPDATE profiles SET tel_nr = $1, country = $2, city = $3, address = $4, zip_code = $5 WHERE user_id = $6", [tel_nr, country, city, address, zip_code, req.user.id], (error, result) => {
                if(error) throw error;
                
                
                res.status(201).json({succMessage:"Profile edited succesfully."});
            });
        }
    }
    catch(error){
        return res.status(500).json(error);
    }
};

addReview = (req, res) =>{
    try{
        const {name, product_id, comment, stars} = req.body;

        pool.query("INSERT INTO reviews (name, stars, comment, product_id) VALUES ($1, $2, $3, $4)", [name, stars, comment, product_id], (error, result) => {
            if(error) throw error;

            res.status(201).json({succMessage:"Review added succesfully."});

        });
    }
    catch(error){
        return res.status(500).json(error);
    }
};

module.exports = {
    createAccount,
    getAccounts,
    getEmail,
    getUser,
    getProfiles,
    getProfile,
    postEditProfile,
    addReview,
    getReviews,
    getReviewsById,
};