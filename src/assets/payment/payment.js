import { paymentAPI } from '../../api/axiosInstance';

const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SvVRHwVyrFghse';

export const handlePayment = async ({ cartItems, user, onSuccess, onError }) => {
  if (!window.Razorpay) {
    throw new Error('Razorpay checkout script is not loaded');
  }

  const { data: order } = await paymentAPI.createRazorpayOrder({
    items: cartItems.map((item) => ({
      productId: item.product?.id || item.productId || item.id,
      quantity: Number(item.quantity || 1),
    })),
  });

  const options = {
    key: order.key || razorpayKey,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: 'Shopcart',
    description: 'Secure checkout',
    order_id: order.razorpayOrderId,
    handler: async (response) => {
      try {
        const { data } = await paymentAPI.verifyRazorpayPayment({
          internalOrderId: order.internalOrderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        });
        onSuccess?.({ ...data, id: order.internalOrderId, orderId: order.internalOrderId });
      } catch (error) {
        onError?.(error);
      }
    },
    prefill: {
      name: user?.name || '',
      email: user?.email || '',
      contact: user?.phone || '',
    },
    theme: {
      color: '#4f46e5',
    },
    modal: {
      ondismiss: () => onError?.(new Error('Payment cancelled')),
    },
  };

  new window.Razorpay(options).open();
};
