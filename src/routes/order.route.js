const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenBoth,
} = require("../middleware/auth.middleware.js");
const Order = require("../models/order.model.js");
const Product = require("../models/product.model.js");
const upload = require("../middleware/multer.midddleware.js");

//Create Order

router.route("/create").post(verifyToken, async (req, res) => {
  const { products, address } = req.body;

  try {
    if (!products || !address) {
      return res.status(400).json("Required Fields");
    }

    let totalAmount = 0;
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (product) {
        const price = parseFloat(product.price.replace(/[^0-9.-]+/g, ""));
        totalAmount += price * item.quantity;
      } else {
        return res
          .status(400)
          .json(`Product with ID ${item.productId} not found`);
      }
    }

    const order = await Order.create({
      userId: req.user?.id,
      products: products,
      address,
      amount: `$${totalAmount}`,
    });

    if (!order)
      return res.status(500).json("Can't Create !! Please Try Again Later ");

    return res.status(200).json({ msg: "Order Placed", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Try again");
  }
});

//Update status

router.route("/updateStatus/:orderId").patch(verifyTokenAndAdmin, async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const validStatuses = ["Dispatched", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    if (!isValidObjectId(orderId)) return res.status(401).json("Invalid  Id");

    // Check if the product exists in the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order or product not found" });
    }

    const updatedStatus = await Order.findByIdAndUpdate(
      order?._id,
      { status: status },
      { new: true }
    );


    if (!updatedStatus) {
      return res.status(500).json({ msg: "Unable to update status" });
    }

    return res
      .status(200)
      .json({ msg: `Order ${status}`, data: updatedStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Order can't Update" });
  }
});


//Cancell Order By User
router.route("/cancelOrder/:orderId").patch(verifyToken, async (req, res) => {
  const { orderId } = req.params;
  try {
    if (!isValidObjectId(orderId)) return res.status(401).json("Invalid Order");

    // Check if the product exists in the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ msg: "Order or product not found" });
    }

    if(order?.userId !== req.user?.id) return res.status(401).json("You are not the Orderer !!");

    const updatedStatus = await Order.findByIdAndUpdate(
      order?._id,
      { status: "Cancelled" },
      { new: true }
    );

    if (!updatedStatus) {
      return res.status(500).json({ msg: "Unable to Cancel" });
    }

    return res
      .status(200)
      .json({ msg: "Order Cancelled", data: updatedStatus });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Order can't Update" });
  }
});


// get Order
router.route("/get/:orderId/:userId").get(verifyTokenBoth, async (req, res) => {
  const { orderId } = req.params;
  try {
    if (!isValidObjectId(orderId)) return res.status(402).json("Invalid Id");
    const order = await Order.findById(orderId);
    if (!order) return res.status(500).json("Order not Found");

    return res.status(200).json({ msg: "Order Found", data: order });
  } catch (error) {
    console.log(error);

    return res.status(502).json("try Again");
  }
});

// Get User order
router.route("/getUserOrder/:userId").get(verifyTokenBoth, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.user?.id }).sort({
      updatedAt: -1,
    });
    if (!order.length) return res.status(500).json("Order is Empty");

    return res.status(200).json({ msg: "Order Found", data: order });
  } catch (error) {
    console.log(error);
    return res.status(502).json("try Again");
  }
});

module.exports = router;
