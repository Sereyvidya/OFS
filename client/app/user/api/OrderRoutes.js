// APIs related to order_routes.py in the server

export const postOrder = async (
  API_URL,
  address,
  total,
  orderItems,
  paymentMethodId,
) => {
  try {
    const token = sessionStorage.getItem("authToken");
    const res = await fetch(`${API_URL}/order/post`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        total: total,
        orderItems: orderItems,
        paymentMethodId: paymentMethodId,
      }),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  } catch (error) {
    console.error("Error with placing an order:", error);
    return {
      ok: false,
      error: "Error with placing an order. Please try again.",
    };
  }
};
