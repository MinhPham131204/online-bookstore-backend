class OrderController {
  
  // [GET] /order-info
  async showOrderInfo(req, res) {
    try {
      const userInfo = await OrderService.getOrderInfo();

      if(userInfo && userInfo.cart && userInfo.cart.length > 0) {
        res.status(200).json(userInfo)
      } else {
        res.status(404).json({error: '404 Not Found'})
      }
    }
    catch (err) {
      console.error('Error in showOrderInfo:', err); 
      res.status(500).json('Server error')
    }
  }

  // [POST] /order
  async confirmOrder(req, res) {
    try {
      const order = await OrderService.createOrder(req.body);

      if(order) {
        res.status(201).json({message: 'Order created successfully', order})
      } else {
        res.status(400).json({error: 'Failed to create order'})
      }
    }
    catch(err) {
      console.log(err)
      res.status(500).json('Server error')
    }
  }

  //[GET] /orders
  async showOrderList(req,res){
    try{
        const result = await OrderService.getOrderList(req.user)

      if(result && result.length) {
        res.status(200).json(result)
      } else {
        res.status(404).json({error: '404 Not Found'})
      }
    }
    catch (err){
      console.log(err)
      res.status(500).json('Server error')
    }
  }

  //[PUT] /orders/:id
  async cancelOrder(req, res) {
    try {
      const { orderID } = req.params;

      const isCancelled = await orderService.cancelOrder(orderID);

      if (isCancelled) {
        return res.status(200).json({ 
          message: 'Order cancelled successfully' 
        });
      } else {
        return res.status(409).json({ 
          error: 'Failed to cancel order', 
        });
      }
    } catch (err) {
      console.error('Error in cancelOrder:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new OrderController();