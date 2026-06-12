const db = require("../Config/db");

exports.addToCart = (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity = 1 } = req.body;

  if (!product_id) {
    return res.status(400).json({
      success: false,
      message: "Product id not found",
    });
  }

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Product should be more than one",
    });
  }

  const checkProduct = "SELECT * FROM products WHERE id = ?";
  db.query(checkProduct, [product_id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Error fetching products",
      });
    }

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const checkProductWithUser =
      "SELECT * FROM cart WHERE user_id = ? AND product_id = ?";
    db.query(checkProductWithUser, [userId, product_id], (err, product) => {
      if (err) {
        return res.status(500).json(err);
      }
      if (product.length !== 0) {
        const updateQuantityQuery =
          "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
        db.query(
          updateQuantityQuery,
          [quantity, userId, product_id],
          (err) => {
            if (err) {
              return res.status(500).json(err);
            }

            const getQuantity = 'SELECT quantity FROM cart WHERE product_id = ? AND user_id = ?';

            db.query(getQuantity, [product_id, userId], (err, rows) => {
              if(err){
                // FIX 10: was res.status('404') — status code was a string, must be a number
                return res.status(404).json({
                  success: false,
                  message: 'Did not get quantity',
                });
              }
              return res.status(200).json({
              success: true,
              message: "Quantity updated successfully",
              data: rows[0].quantity,
            });
            })
            
          },
        );
      } else {
        const setQuantity =
          "INSERT INTO cart(user_id, product_id, quantity) values(? ,?, ?)";
        db.query(setQuantity, [userId, product_id, quantity], (err, result) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }
          return res.status(201).json({
            success: true,
            message: "Product added successfully",
            data: quantity,
          });
        });
      }
    });
  });
};

exports.getUserCart = (req, res) => {
   const userId = req.user.id;

   const getCart = "SELECT cart.id, cart.product_id, products.name, products.image_url, products.price, cart.quantity FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?";

   db.query(getCart, [userId], (err, result) => {
      if(err){
         return res.status(500).json(err);
      }
      return res.status(200).json({
         success: true,
         message: "Cart fetched successfully",
         data: result,
      });
   });
}


exports.updateCartItem = (req, res) => {
   const { id } = req.params;
   console.log("ID ",id);
   const { quantity }  = req.body;
   console.log('QUNATITY ', quantity);

   if(quantity === undefined || quantity < 1){
      return res.status(400).json({
         message: "Valid qunatity required(min 1)",
      });
   }

   const updateCart = 'UPDATE cart SET quantity = ? WHERE id=?';
   db.query(updateCart, [quantity, id], (err, result) => {
      if(err){
         return res.status(500).json({
            message:"Error updating quantity",
         });
      }

      if(result.affectedRows === 0){
         return res.status(404).json({
            success: false,
            message:"Cart item not found",
         });
      }

      return res.status(200).json({
         success:true,
         message: "Quantity updated successfully",
         updatedCart: { id, quantity },
      });
   });
}


exports.removeCartItem = (req, res) => {
   const userId = req.user.id;
   const { id } = req.params;

   if (!id) {
      return res.status(400).json({ success: false, message: 'Cart item id is required' });
   }

   const removeQuery = 'DELETE FROM cart WHERE id = ? AND user_id = ?';
   db.query(removeQuery, [id, userId], (err, result) => {
      if(err){
         return res.status(500).json({
            error: err.message,
         });
      }
      if(result.affectedRows === 0){
         return res.status(404).json({
            message: "Product not found",
         })
      }
      return res.status(200).json({
         success: true,
         message: "Item deleted successfully",
      });

   });
}
