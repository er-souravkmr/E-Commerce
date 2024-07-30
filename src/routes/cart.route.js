const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middleware/auth.middleware.js");
const Cart = require("../models/cart.model.js");
const upload = require("../middleware/multer.midddleware.js");

//Create Cart

router
  .route("/create")
  .post(verifyToken, async (req, res) => {
    const { products } = req.body;

    try {
      if (!products) {
        return res.status(400).json("Required Fields");
      }

      const cart = new Cart({
        userId: req.user?.id,
        products: products,
      });
      await cart.save();

      if (!cart)
        return res.status(500).json("Can't Create !! Please Try Again Later ");

      return res.status(200).json({ msg: "Cart Created", cart });
    } catch (error) {
      console.log(error);
      return res.status(500).json("Try again");
    }
  });

//Update Quantitiy

router
  .route("/cart/:cartId/product/:productId")
  .patch(verifyToken, async (req, res) => {
    const { cartId, productId } = req.params;
    const { quantity } = req.body;
    try {
      if (!quantity) return res.status(401).json("Quantity is required");

      if (!isValidObjectId(cartId) || !isValidObjectId(productId))
        return res.status(401).json("Invalid  Id's");
      // Convert IDs to ObjectId
      const cartObjectId = new mongoose.Types.ObjectId(cartId);
      const productObjectId = new mongoose.Types.ObjectId(productId);

      // Check if the product exists in the cart
      const cart = await Cart.findOne(
        { _id: cartObjectId, "products.productId": productObjectId },
        { "products.$": 1 }
      );

      if (!cart) {
        return res.status(404).json({ msg: "Cart or product not found" });
      }

      // Update the quantity of the product
      const updatedCart = await Cart.findOneAndUpdate(
        { _id: cartObjectId, "products.productId": productObjectId },
        {
          $set: {
            "products.$.quantity": quantity,
          },
        },
        { new: true }
      );

      if (!updatedCart) {
        return res.status(500).json({ msg: "Unable to update quantity" });
      }

      return res
        .status(200)
        .json({ msg: "Quantity updated", data: updatedCart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Cart can't Update" });
    }
  });

// get Cart
router.route("/get/:id").get(verifyTokenAndAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) return res.status(402).json("Invalid Id");

    const cart = await Cart.findById(id);
    if (!cart) return res.status(500).json("Cart not Found");

    return res.status(200).json({ msg: "Cart Found", data: cart });
  } catch (error) {
    console.log(error);

    return res.status(502).json("try Again");
  }
});

// Remove Cart
router.route("/delete/:id").delete(verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (!isValidObjectId(id)) return res.status(401).json("Invalid Id");

    const cart = await Cart.findById(id);
    if (!cart) return res.status(401).json("Cart not Found");

    if (req.user?.id !== cart.userId)
      return res.status(401).json("You are not cart Owner!");

    const deletedCart = await Cart.findByIdAndDelete(cart?._id);
    if (!deletedCart) return res.status(501).json("Cant Remove!! , Try Again");

    return res.status(200).json({ msg: "Cart Deleted", data: deletedCart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error", error: error });
  }
});
//remove Product from cart
router.route("/remove/:cartId/:productId").patch(verifyToken, async (req, res) => {
    const { cartId, productId } = req.params;

    try {
      if (!isValidObjectId(cartId) || !isValidObjectId(productId))
        return res.status(401).json("Invalid Ids");

      const cart = await Cart.findById(cartId);
      if (!cart) return res.status(401).json("Cart not Found");
      if (req.user?.id !== cart.userId)
        return res.status(401).json("You are not cart Owner!");

      const updatedCart = await Cart.updateOne(
        { _id: new mongoose.Types.ObjectId(cartId) },
        { $pull: { products: { productId: productId } } }
      );

      if (!updatedCart)
        return res.status(501).json("Cant Remove!! , Try Again");
      return res.status(200).json({ msg: "Product removed", data: updatedCart });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Error", error: error });
    }
});


  // Get User cart
  router.route("/getUserCart").get(verifyToken, async (req, res) => {
    try {
      const cart = await Cart.find({ userId: req.user?.id }).sort({updatedAt:-1});
      if (!cart.length) return res.status(500).json("Cart is Empty");
  
      return res.status(200).json({ msg: "Cart Found", data: cart });
    } catch (error) {
      console.log(error);
      return res.status(502).json("try Again");
    }
  });

module.exports = router;
