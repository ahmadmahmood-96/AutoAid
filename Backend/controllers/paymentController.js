const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`)
// ('sk_test_51OvjfW047NJZ4EdhjkW2fTfZuzLiqtLIhBHLyxNiVxztR9odiDlm5wZnUnF4Kc7eAy5YDwDVLmJyUVrx7FZq1nZw00xaCOPjcx')

exports.intents = async (req, res) => {
    try {
        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'pkr',
            automatic_payment_methods: {
                enabled: true
            }
        });
        // Return the secret
        res.json({
            paymentIntent: paymentIntent.client_secret
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
};