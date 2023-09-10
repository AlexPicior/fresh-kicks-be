
const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const handler = async (req, res)=> {
  
  
  const session = await stripe.checkout.sessions.create({
    submit_type: 'pay',
    mode: 'payment',
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    line_items: req.body.map((item) => {
      const img = item.images[0];

      return {
        price_data: { 
          currency: 'ron',
          product_data: { 
            name: item.name,
            images: [img],
          },
          unit_amount: item.price * 100,
        },
        adjustable_quantity: {
          enabled:true,
          minimum: 1,
        },
        quantity: item.quantity
      }
    }),
    mode: 'payment',
    success_url: `${req.headers.origin}/success`,
    cancel_url: `${req.headers.origin}`,
  });

  res.status(200).json(session);

}

module.exports = {handler};