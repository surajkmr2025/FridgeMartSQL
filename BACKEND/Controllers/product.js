const db = require('../Config/db');

// ================= ADD PRODUCT =================
exports.addProduct = (req, res) => {
    const { name, brand, description, price, image_url } = req.body;

    if(!name || !brand || !description || !price || !image_url){
        return res.status(400).json({
            message: "Required fields missing",
        });
    }

    if (isNaN(price)) {
        return res.status(400).json({
            message: "Price must be a number",
        });
    }

    const query =
    "INSERT INTO products (name, brand, description, price, image_url) VALUES (?, ?, ?, ?, ?)";

    db.query(
        query,
        [name, brand, description, price, image_url],
        (err, result) => {
            if(err) {
                return res.status(500).json({
                    message: "Error adding product",
                    error: err.message,
                });
            }

            res.status(201).json({
                message: "Product added successfully",
                data: result,
            });
        }
    );
};


// ================= GET ALL PRODUCTS =================
exports.getProducts = (req, res) => {
    const query = "SELECT * FROM products";

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching products",
                error: err.message,
            });
        }

        res.status(200).json({
            success: true,
            products: results,
        });
    });
};

// ================= GET PRODUCTS BY ID =================
exports.getProductsById = (req, res) => {
    const { id } = req.params;
    console.log('REQ PARAMS', req.params);
    const query = "SELECT * FROM products WHERE id = ?"
    db.query(query, [id], (error, results) => {
        if(error){
            return res.status(500).json({
                message: "Error fetching product",
                error: error, 
            });
        }

        if(results.length == 0) {
            return res.status(404).json({
                message: "Product not found",
            });
        }
        res.status(200).json({
            product: results[0],
        })
    })
}

// ================= UPDATE PRODUCT =================
exports.updateProductId = (req, res) => {
    const { id } = req.params;
    console.log('REQ PARAMS', req.params);

    const {name, brand, description, price, image_url} = req.body;
    console.log('REQ BODY', req.body);

    if(!id){
        return res.status(404).json({ // FIX 2: was `.status(404).status({` — chained .status() twice; changed to .json()
            message: "Id not found",
        });
    }

    // FIX 3: UPDATE was running OUTSIDE the SELECT callback (race condition).
    // Moved UPDATE inside the SELECT callback so it only runs after existence is confirmed.
    db.query("SELECT * FROM products WHERE id=?", [id], (err, product) => {
        if(err){
            return res.status(500).json(err);
        }
        if(product.length === 0){
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const updateQuery = `UPDATE products SET name = ?, brand = ?, description = ?, price = ?, image_url = ? WHERE id=?`;

        db.query(updateQuery, [name, brand, description, price, image_url, id], (err, result)=> {
            if(err){
                return res.status(500).json({
                    message: "Error updating products",
                    error: err,
                });
            }
            
            res.status(200).json({
                success: true,
                data: result,
            });
        });
    });
}

// ================= DELETE PRODUCT =================
exports.deleteProduct = (req, res) => {
    const { id } = req.params;
    console.log("ID", id);

    if(!id){ // FIX 4: was `if(!id){x` — stray `x` was a ReferenceError that crashed the server
        return res.status(404).json({
            message: "Product id not found",
        })
    }

    db.query("DELETE FROM products WHERE id = ?", [id], (err, results) => {
        if(err){
            return res.status(500).json({
                message: "Error Deleting Product",
                error: err.message,
            });
        }
        
        if(results.affectedRows === 0){
            return res.status(404).json({
                message: "Product not found",
            });
        }

        console.log(results);
        
        return res.status(200).json({
            success: true,
            message: 'Product Deleted Successfully',
            data: results
        });
    });
}
