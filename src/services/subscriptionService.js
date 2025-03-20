import api from './api';

class SubscriptionService {
    static async getPlans() {
        try {
            const response = await api.get('/api/subscription/plans/');
            return response.data;
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            throw error;
        }
    }

    static async getCurrentSubscription() {
        try {
            const response = await api.get('/api/subscription/subscriptions/summary/');
            return response.data;
        } catch (error) {
            console.error('Error fetching current subscription:', error);
            throw error;
        }
    }

    static async createPaymentIntent(planId) {
        try {
            console.log('Creating payment intent for plan:', planId);
            const response = await api.post('/api/subscription/subscriptions/create_payment_intent/', {
                plan_id: planId
            });
            console.log('Payment intent created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }

    static async subscribe(planId, paymentMethodId = null, billingInterval = 'month') {
        try {
            console.log('Subscribing to plan:', planId, 'with payment method:', paymentMethodId, 'billing interval:', billingInterval);
            
            const data = {
                plan_id: planId,
                billing_interval: billingInterval,
                ...(paymentMethodId && { payment_method_id: paymentMethodId })
            };

            const response = await api.post('/api/subscription/subscriptions/', data);
            console.log('Subscription created:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error creating subscription:', error);
            throw error;
        }
    }

    static async confirmSubscription(subscriptionId, paymentMethodId) {
        try {
            const response = await api.post(`/api/subscription/subscriptions/${subscriptionId}/confirm/`, {
                payment_method_id: paymentMethodId
            });
            return response.data;
        } catch (error) {
            console.error('Error confirming subscription:', error);
            throw error;
        }
    }

    static async cancelSubscription(subscriptionId) {
        try {
            const response = await api.post(`/api/subscription/subscriptions/${subscriptionId}/cancel/`);
            return response.data;
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            throw error;
        }
    }

    static async checkAccess(feature) {
        try {
            const response = await api.post('/api/subscription/subscriptions/check_access/', {
                feature: feature
            });
            return response.data;
        } catch (error) {
            console.error('Error checking feature access:', error);
            throw error;
        }
    }
}

export default SubscriptionService; 