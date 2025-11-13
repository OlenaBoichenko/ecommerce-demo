import Stripe from 'stripe';

// Use a dummy key for development and testing purposes
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51placeholder1234567890';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-02-24.acacia',
});
