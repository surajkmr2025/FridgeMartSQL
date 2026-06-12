const db = require("../Config/db");

exports.checkOut = (req, res) => {
  const userId = req.user.id;

  const getCartQuery = `SELECT cart.product_id, cart.quantity, products.price FROM cart JOIN products 
                          ON cart.product_id = products.id
                          WHERE cart.user_id = ?`;

  db.query(getCartQuery, [userId], (err, cartItems) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalPrice = 0;
    for (let i = 0; i < cartItems.length; i++) {
      totalPrice += cartItems[i].price * cartItems[i].quantity;
    }
    console.log("TOTAL PRICE: ", totalPrice);

    const insertIntoOrders = "INSERT INTO orders (user_id, total_price) VALUES (?, ?)";

    db.query(insertIntoOrders, [userId, totalPrice], (err, ordersData) => {
      if (err) {
        return res.status(500).json(err);
      }
      console.log("ORDERS DATA: ", ordersData);

      const orderId = ordersData.insertId;
      console.log("ORDER ID: ", orderId);

      const getUserCart =
        "SELECT cart.product_id, cart.quantity, products.name, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?";

      db.query(getUserCart, [userId], (err, cartItems) => {
        if (err) {
          return res.status(500).json(err);
        }

        const value = cartItems.map((item) => [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
        ]);

         const insertQuery = "INSERT INTO order_items(order_id, product_id, quantity, price) VALUES ?";

         db.query(insertQuery, [value], (err, result) => {
            if(err){
               return res.status(400).json(err);
            }
            console.log('RES: ', result);

            db.query('DELETE FROM cart WHERE user_id = ?', [userId], (err, result) => {
               if(err){
                  return res.status(500).json(err);
               }
               return res.status(200).json({
                  success: true,
                  message: "Order placed successfully",
               });
            })
         });
        }
      );
    });
  });
};



exports.getUserOrders = (req, res) => {
    const userId = req.user.id;
    const getUserQuery = `SELECT orders.id AS order_id, orders.status, products.name, products.image_url, products.description, order_items.quantity, order_items.price, orders.total_price FROM orders JOIN order_items ON orders.id = order_items.order_id JOIN products ON products.id = order_items.product_id WHERE orders.user_id = ?`
     db.query(getUserQuery, [userId], (err, orders) => {
        if(err) {
            return res.status(500).json(err);
        }
        console.log('ORDERS: ', orders);
        if(orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Order Fetched successfully",
            order: orders,
        });
    });
}

exports.getOrderById = (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;
  const getOrders = 'SELECT orders.id AS order_id, orders.status, orders.total_price, order_items.price, order_items.quantity, products.name, products.brand, products.image_url, products.description FROM orders JOIN order_items ON order_items.order_id = orders.id JOIN products ON order_items.product_id = products.id WHERE orders.id = ? AND orders.user_id = ?';

  db.query(getOrders, [orderId, userId], (err, orders) => {
    if(err) return res.status(500).json(err);

    if(orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      })
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  });
}

exports.cancelOrder = (req, res) => {
  const userId = req.user.id;
  const { orderId } = req.params;

  const cancelQuery = 'SELECT status FROM orders WHERE id = ? AND user_id = ?';
  db.query(cancelQuery, [orderId, userId], (err, order) => {
    if(err){
      return res.status(500).json(err);
    }
    console.log('ORDERS: ', order);
    if(order.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order not found",
      });
    }
    if(order[0].status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }
    if(order[0].status === 'delivered'){
      return res.status(400).json({
        success: false,
        message: "Order can not be cancelled",
      });
    }

    else{
      db.query('UPDATE orders set status = "cancelled" WHERE id = ?', [orderId], (err) => {
        if(err){
          return res.status(500).json(err);
        }
        return res.status(200).json({
          success: true,
          message: "Order Cancelled",
        });
      });
    }
  })
}

exports.updateOrderStatus = (req, res) => {
  const { orderId } = req.params;
  console.log('ORDER ID: ',orderId)
  const { status } = req.body;
  console.log('STATUS : ',status);


  const validStatus = ['pending','confirmed','shipped','delivered','cancelled'];

  if(!validStatus.includes(status)){
    return res.status(400).json({
      success: false,
      message: "Wrong status",
    });
  }

  if(status === 'cancelled'){
    return res.status(403).json({
      success: false,
      message: "You can not cancel order",
    });
  }

  db.query('SELECT status FROM orders WHERE id = ?',[orderId], (err, result) => {
    if(err) {
      return res.status(500).json(err);
    }
    console.log('RESULT: ', result);
    if(result.length === 0) {
      return res.status(404).json({
        message: "Order not found"
      })
    }

    if(result[0].status === 'cancelled'){
      return res.status(400).json({
        status: false,
        message: "Order cancelled by user",
      });
    }
    if(result[0].status === 'delivered'){
      return res.status(400).json({
        success: false,
        message: "Order already delivered",
      })
    }
    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId], (err) => {
      if(err){
        return res.status(500).json(err);
      }

      return res.status(200).json({
        success: true,
        message: "Order updated successfully",
      })
    });
    
  })
}

exports.allOrders = (req, res) => {

  let query = 
  `SELECT orders.id AS order_id,
    users.name AS user_name,
    products.name AS product_name,
    order_items.price,
    orders.status,
    orders.total_price,
    users.email,
    orders.created_at
    FROM orders
    JOIN users ON orders.user_id = users.id
    JOIN order_items ON order_items.order_id = orders.id
    JOIN products ON order_items.product_id = products.id
    ORDER BY orders.created_at DESC`
  ;
  
  db.query(query, (err, result) => {
    if(err) return res.status(500).json(err);
    if(result.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Empty order",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  });
}
