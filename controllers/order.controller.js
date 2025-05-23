import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";

export const newOrder = async ( req, res, next)=>{
    console.log("request for newOrder made")

    const buyerId = req.body.buyerId;
    const sellerId = req.body.sellerId;
    const gigId = req.body.gigId;
    const deliveryDays = req.body.deliveryDays;
    let deliveryCountdownEnd = new Date();
    deliveryCountdownEnd.setHours(deliveryCountdownEnd.getHours() + (deliveryDays * 24));

    try {
        const gig = await Gig.findById(gigId);
        const buyer = await User.findById(buyerId);

        if(buyer.walletBalance >= gig.price){
            const newBuyerBalance = buyer.walletBalance - gig.price;

            await User.findOneAndUpdate(
                {_id: buyerId, },
                {$set: {walletBalance: newBuyerBalance, },}
            );

            const newOrder = new Order({
                gigId: gig._id,
                img: gig.cover,
                title: gig.title,
                buyerId: buyerId,
                sellerId: gig.userId,
                price: gig.price,
                sellerCompleted:false,
                buyerCompleted:false,
                deliveryDays,
                deliveryCountdownEnd,
            });
            await newOrder.save();
            res.status(200).json("Order created successfully, you are being redirected to the orders page. Please do not close the page."); 
        } else if (buyer.walletBalance < gig.price){
            res.status(200).json("Order was not created due to insufficient balance");
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
};


export const getOrders = async (req, res, next) => {
    try {
        console.log("request for getOrder made")
      const orders = await Order.find({
        ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      });
  
      res.status(200).send(orders);
    } catch (err) {
      next(err);
    }
  };
  

export const completeBuyerOrder= async (req, res, next)=>{
    try {
        console.log("request for completeBuyerOrder made")

        const orderId = req.body.orderId;
        await Order.findOneAndUpdate(
            {_id: orderId, },
            {$set: {buyerCompleted:true }}
        );
    
        const order = await Order.findById(orderId);
        const sellerId = order.sellerId;
        const seller = await User.findById(sellerId);
        const newSellerBalance = seller.walletBalance + order.price

    
        if (order.buyerCompleted === true && order.sellerCompleted === true && order.orderCompleted === false){
            await User.findOneAndUpdate(
                {_id: sellerId, },
                {$set: {walletBalance: newSellerBalance}}
            );
            await Order.findOneAndUpdate(
                {_id: orderId, },
                {$set: {orderCompleted: true, deliveryCountdownEnd:0 }}
            );
        }
    
        res.status(200).json("Buyer Order marked as completed successfully")
    } catch (error) {
        res.status(500).json(error.message)
    }
};


export const completeSellerOrder= async (req, res, next)=>{
    try {
        console.log("request for completeSellerOrder made")

        const orderId = req.body.orderId;
        await Order.findOneAndUpdate(
            {_id: orderId, },
            {$set: {sellerCompleted:true }}
        );
    
        const order = await Order.findById(orderId);
        const sellerId = order.sellerId;
        const seller = await User.findById(sellerId);
        const newSellerBalance = seller.walletBalance + order.price
    
        if (order.buyerCompleted === true && order.sellerCompleted === true && order.orderCompleted === false ){
            await User.findOneAndUpdate(
                {_id: sellerId, },
                {$set: {walletBalance: newSellerBalance, },}
            );
            await Order.findOneAndUpdate(
                {_id: orderId, },
                {$set: {orderCompleted: true, deliveryCountdownEnd:0 }}
            );
        }
    
        res.status(200).json("Seller order marked as completed successfully")
    } catch (error) {
        res.status(500).json(error.message)
    }
};

export const checkOrderStatus= async (req,res)=>{
    try {
        console.log("request for checkOrderStatus made")
        const {orderId} = req.body;
        const order = await Order.findById(orderId);
        const buyerId = order.buyerId;
        const buyer = await User.findById(buyerId);

        const newBuyerBalance = order.price + buyer.walletBalance;

        if(order.buyerCompleted === false && order.sellerCompleted === false && order.orderCompleted === false){
            await User.findOneAndUpdate(
                {_id: buyerId, },
                {$set: {walletBalance: newBuyerBalance, },}
            );
            res.status(200).json("Buyer money has been refunded successfully")
        }else if (order.buyerCompleted === false && order.orderCompleted === false){
            await User.findOneAndUpdate(
                {_id: buyerId, },
                {$set: {walletBalance: newBuyerBalance, },}
            );
            res.status(200).json("Buyer money has been refunded successfully")
        }
        res.status(200).json("")
    } catch (error) {
        res.status(500).json(error.message)
    }
}