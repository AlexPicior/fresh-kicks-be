const pool = require('./db');

getProducts = (req, res) =>{
    pool.query("SELECT * FROM products", (error, result) => {
        if(error) throw error;

        res.status(200).json(result.rows);
    });
};

addProduct = (req, res) =>{
    const {name, price, age_type, gender, color, images, brand, slug} = req.body;
    
    if(price < 0 || age_type < 0 || age_type > 1 || gender < 0 || gender > 2 || color < 0 || color > 12 || brand < 0 || brand > 5)
    {
        res.send("Invalid data.");
    }

    pool.query("INSERT INTO products (name, price, age_type, gender, color, images, brand, slug) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [name, price, age_type, gender, color, images, brand, slug], (error, result) => {
        if(error) throw error;

        res.status(201).send("Product added succesfully.");
    });
};

getProduct = (req, res) => {
    pool.query("SELECT * FROM products WHERE slug = $1", [req.params.slug], (error, result) => {
        if(error) throw error;
        res.status(200).json(result.rows[0]);
    });
}

getSimilarProducts = (req, res) => {
    const brand = parseInt(req.params.brand);
    const slug = req.params.slug;
    pool.query("SELECT * FROM products WHERE brand = $1 AND slug != $2", [brand, slug], (error, result) => {
        if(error) throw error;
        res.status(200).json(result.rows);
    });
}

getSlugs = (req, res) => {
    pool.query("SELECT * FROM products", (error, result) => {
        if(error) throw error;
        
        res.status(200).json(result.rows.slug);
    });
}

getFilterProducts = (req, res) => {
    const {age_type, brand, gender, size, price, sort_by, search} = req.params;
    let db_query = "SELECT * FROM products";
    let age_q = "";
    let barnd_q = "";
    let gender_q = "";
    let size_q = "";
    let price_q = "";
    let search_q = "";

    if (age_type != "all")
    {
        age_q = "(";
        if(age_type.includes("Adult")) age_q == "(" ? age_q = age_q + "age_type = 0" : age_q = age_q + " OR age_type = 0";
        if(age_type.includes("Kid")) age_q == "(" ? age_q = age_q + "age_type = 1" : age_q = age_q + " OR age_type = 1";
        age_q = age_q + ")";
    }
    
    if (brand != "all")
    {
        barnd_q = "(";
        if(brand.includes("Nike")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 0" : barnd_q = barnd_q + " OR brand = 0";
        if(brand.includes("Addidas")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 1" : barnd_q = barnd_q + " OR brand = 1";
        if(brand.includes("NewBalance")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 2" : barnd_q = barnd_q + " OR brand = 2";
        if(brand.includes("Puma")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 3" : barnd_q = barnd_q + " OR brand = 3";
        if(brand.includes("Converse")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 4" : barnd_q = barnd_q + " OR brand = 4";
        if(brand.includes("Vans")) barnd_q == "(" ? barnd_q = barnd_q + "brand = 5" : barnd_q = barnd_q + " OR brand = 5";
        barnd_q = barnd_q + ")";
    }    

    if (gender != "all")
    {
        gender_q = "(";
        if(gender.includes("Men")) gender_q == "(" ? gender_q = gender_q + "gender = 0" : gender_q = gender_q + " OR gender = 0";
        if(gender.includes("Women")) gender_q == "(" ? gender_q = gender_q + "gender = 1" : gender_q = gender_q + " OR gender = 1";
        if(gender.includes("Unisex")) gender_q == "(" ? gender_q = gender_q + "gender = 2" : gender_q = gender_q + " OR gender = 2";
        gender_q = gender_q + ")";
    }
    
    if (price != "all")
    {
        price_q = "(";
        if(price.includes("1-500RON")) price_q == "(" ? price_q = price_q + "(price > 0 AND price < 501)" : price_q = price_q + " OR (price > 0 AND price < 501)";
        if(price.includes("501-1000RON")) price_q == "(" ? price_q = price_q + "(price > 500 AND price < 1001)" : price_q = price_q + " OR (price > 500 AND price < 1001)";
        if(price.includes("1001-1500RON")) price_q == "(" ? price_q = price_q + "(price > 1000 AND price < 1501)" : price_q = price_q + " OR (price > 1000 AND price < 1501)";
        if(price.includes("1501-2000RON")) price_q == "(" ? price_q = price_q + "(price > 1500 AND price < 2001)" : price_q = price_q + " OR (price > 1500 AND price < 2001)";

        price_q = price_q + ")";
    }

    if (search != "all")
    {
        search_q = `(name LIKE \'%${search}%\')`;
    }

    if (age_q == "" && barnd_q == "" && gender_q == "" && size_q == "" && price_q == "" && search_q == "")
    {
        db_query = db_query;
    }
    else
    {
        db_query = db_query + " WHERE";
        if (age_q != "")
        {
            db_query = db_query + " " + age_q;
        }
        if (barnd_q != "")
        {
            db_query = db_query + (db_query == "SELECT * FROM products WHERE" ? " " : " AND " ) + barnd_q;
        }
        if (gender_q != "")
        {
            db_query = db_query + (db_query == "SELECT * FROM products WHERE" ? " " : " AND " ) + gender_q;
        }
        if (price_q != "")
        {
            db_query = db_query + (db_query == "SELECT * FROM products WHERE" ? " " : " AND " ) + price_q;
        }
        if (search_q != "")
        {
            db_query = db_query + (db_query == "SELECT * FROM products WHERE" ? " " : " AND " ) + search_q;
        }
    }

    if(sort_by.includes("Newest")) db_query = db_query + " ORDER BY id DESC";
    else if(sort_by.includes("Highest")) db_query = db_query + " ORDER BY price DESC";
    else if(sort_by.includes("Lowest")) db_query = db_query + " ORDER BY price ASC";

    pool.query(db_query, (error, result) => {
        if(error) throw error;
        
        res.status(200).json(result.rows);
    });
}

module.exports = {
    getProducts,
    addProduct,
    getProduct,
    getSimilarProducts,
    getSlugs,
    getFilterProducts,
};