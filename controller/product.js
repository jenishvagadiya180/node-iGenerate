import productModel from "../model/product.js";
import mongoose from "mongoose";
import productDetailsModel from "../model/productDetails.js"
import userModel from "../model/user.js";
import cartModel from "../model/cart.js";


class product {
    static addProduct = async (req, res) => {
        try {
            const product = new productModel({
                name: req.body.name,
                price: req.body.price,
                mrp: req.body.mrp,
            });

            const productDetails = new productDetailsModel({
                productId: product._id,
                description: req.body.description
            })
            const productData = await product.save();
            const productDetailsData = await productDetails.save();

            console.log('productData :>> ', productData);
            console.log('productDetailsData :>> ', productDetailsData);

            return res.status(200).send("data saved successfully");

        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static productList = async (req, res) => {
        try {
            let filter = [{ isDeleted: false }]
            if (req.query.search) {
                filter = [
                    ...filter,
                    {
                        $or: [
                            { name: { $regex: `${req.query.search}`, $options: "i" } },
                            { price: { $regex: `${req.query.search}`, $options: "i" } },
                            { mrp: { $regex: `${req.query.search}`, $options: "i" } },
                            { 'productDetails.description': { $regex: `${req.query.search}`, $options: "i" } }
                        ]
                    },
                ]
                console.log('filter search:>> ', filter);
            }

            if (req.query.price) {
                filter = [
                    ...filter,
                    {
                        price: { $gte: parseInt(req.query.price.split('-')[0]), $lte: parseInt(req.query.price.split('-')[1]) }
                    }
                ]
            }

            if (req.query.mrp) {
                filter = [
                    ...filter,
                    {
                        mrp: {
                            $gte: parseInt(req.query.mrp.split('-')[0]), $lte: parseInt(req.query.mrp.split('-')[1])
                        }
                    }
                ]
            }

            const productData = await productModel.aggregate([
                {
                    $lookup: {
                        from: "productdetails",
                        localField: "_id",
                        foreignField: "productId",
                        as: "productDetails"
                    }
                },
                {
                    $match: { $and: filter }
                },

                { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },

                {
                    $project: {
                        description: '$productDetails.description',
                        _id: 1,
                        name: 1,
                        price: 1,
                        mrp: 1,
                    }
                },
            ]).collation({ locale: "en" })

            console.log('productData :>> ', productData);
            return await res.status(200).send(productData);
        } catch (error) {
            console.log('error :>> ', error)
        }
    }

    static productListInSpecifiedId = async (req, res) => {
        try {
            const productData = await productModel.find({ isDeleted: false, _id: { $in: ["6328616eaa4f7d73c382f181", "632c1964efd89d1cdae44360"] } });
            console.log('productData :>> ', productData);

            return res.status(200).send(productData);
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static updateProduct = async (req, res) => {
        try {
            console.log("this is update product")
            const product = await productModel.findOne({ isDeleted: false, _id: req.params.productId });
            if (!product) {
                return await res.status(402).send("product not found");
            }
            console.log('product :>> ', product);

            product.name = req.body.name
            product.price = req.body.price
            product.mrp = req.body.mrp

            const productData = await product.save();
            console.log('productData :>> ', productData);

            return res.status(200).send("data updated successfully");
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static deleteProduct = async (req, res) => {
        try {
            const product = await productModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(req.params.productId) });
            console.log('product :>> ', product);

            product.isDeleted = true;

            const productData = await product.save();
            console.log('productData :>> ', productData);

            return res.status(200).send("data deleted successfully");
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static addToCart = async (req, res) => {
        try {
            let { userId, productId } = req.query;
            const user = await userModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(userId) });
            if (!user) {
                return await res.status(402).send("user not found");
            }
            console.log('user :>> ', user);

            const availableCart = await cartModel.findOne({ isDeleted: false, userId: mongoose.Types.ObjectId(userId), isCheckout: false });
            if (availableCart) {
                const product = await productModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(productId) });
                if (!product) {
                    return await res.status(402).send("product not found");
                }
                console.log('availableCart :>> ', availableCart);
                availableCart.productId.push(`${productId}`)
                availableCart.amount += product.price
                const cartData = availableCart.save();
                console.log('cartData :>> ', cartData);
                return res.status(200).send("add to cart successfully");
            }
            if (req.query.productId) {
                const product = await productModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(productId) });
                if (!product) {
                    return await res.status(402).send("product not found");
                }
                console.log('product :>> ', product);

                const cart = new cartModel({
                    userId: userId,
                    productId: [productId],
                    amount: parseInt(product.price)
                });

                console.log('cart :>> ', cart);
                const cartData = await cart.save();
                console.log('cartData :>> ', cartData);
            }
            return res.status(200).send("add to cart successfully");
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static placeOrder = async (req, res) => {
        try {
            let cartId = req.query.cartId;
            const checkCart = await cartModel.findOne({ isDeleted: false, isCheckout: false, _id: mongoose.Types.ObjectId(cartId) });
            if (!checkCart) {
                return await res.status(402).send("cart not found");
            }
            console.log('checkCart :>> ', checkCart);

            checkCart.isCheckout = true;
            const cartData = await checkCart.save();
            console.log('cartData :>> ', cartData);
            return res.status(200).send("order placed successfully")

        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static removeProductFromCart = async (req, res) => {
        try {
            let userId = req.query.userId;
            let productId = req.query.productId
            const user = await userModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(userId) });
            if (!user) {
                return await res.status(402).send("user not found");
            }
            console.log('user :>> ', user);

            const availableCart = await cartModel.findOne({ isDeleted: false, userId: mongoose.Types.ObjectId(userId), isCheckout: false });
            if (availableCart) {
                const product = await productModel.findOne({ isDeleted: false, _id: mongoose.Types.ObjectId(productId) });
                console.log('product :>> ', product);
                if (!product) {
                    return await res.status(402).send("product not found");
                }
                console.log('availableCart :>> ', availableCart);
                availableCart.amount -= product.price;

                let productIndex = availableCart.productId.indexOf(`${productId}`)
                console.log('productIndex :>> ', productIndex);

                if (productIndex == -1) {
                    return await res.status(402).send("product not found in cart");
                }
                availableCart.productId.splice(productIndex, 1);
                console.log('availableCart :>> ', availableCart);
            }
            return res.status(200).send("product removed from cart successfully")
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

    static viewCart = async (req, res) => {
        try {
            let { cartId } = req.query;
            const checkCart = await cartModel.findOne({ isDeleted: false, isCheckout: false, _id: mongoose.Types.ObjectId(cartId) });
            if (!checkCart) {
                return await res.status(402).send("cart not found");
            }
            console.log('checkCart :>> ', checkCart);

            const cartData = await cartModel.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(cartId) } },
                {
                    $addFields: {
                        productId: {
                            $map: {
                                input: "$productId",
                                as: "p",
                                in: {
                                    k: "$$p",
                                    v: {
                                        $size: {
                                            $filter: {
                                                input: "$productId",
                                                cond: { $eq: ["$$this", "$$p"] }
                                            }
                                        }
                                    },
                                },
                            }
                        }
                    }
                },

                // {
                //     $addFields: {
                //         quantity: {
                //             $cond: { if: { $eq: ["$products._id", "$productId.k"] }, then: { count: "$productId.v" }, else: { product: '$products' } }
                //         }
                //     }
                // }
                // {
                //     $redact: {
                //         $cond: [{
                //             $eq: ["$productId.k", "$products._id"]
                //         },
                //             '$$KEEP',
                //             '$$PRUNE'
                //         ]
                //     },
                // }

                // {
                //     $project: {
                //         productDetails: {
                //             $map:
                //             {
                //                 input: "$products",
                //                 as: "product",
                //                 in: {
                //                     "name": '$$product.name', "price": "$$product.price", "quantity": {}
                //                 }
                //             },
                //         },
                //         amount: 1
                //     }
                // }
            ]);

            console.log('cartData :>> ', cartData);

            return res.status(200).send({ cartData })
        } catch (error) {
            console.log('error :>> ', error);
        }
    }

}

export default product