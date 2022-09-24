import React from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import "bootswatch/dist/lux/bootstrap.min.css";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51LlZdMC1klrENHbhZ5fEnyAn4eYetqVUCyYE5MlTdZoUh9Q5OG2hupIeWJqb7MS1ywrBo3moqG2jRf8xLmxkCJhT00XJOsSVM0"
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });
    setLoading(true);
    if (!error) {
      const { id } = paymentMethod;

      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/checkout",
          {
            id,
            amount: 200000,
          }
        );
        console.log(data);
        elements.getElement(CardElement).clear();
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="card card-body">
      <h3 className="text-center my-2">Precio: $2000</h3>
      <img
        src="https://www.macstation.com.ar/img/productos/1675-1111.jpg"
        alt="iphone"
        className="img-fluid"
      />
      <div className="form-group">
        <CardElement className="form-control" />
      </div>
      <button className="btn btn-success" disabled={!stripe}>
        {loading ? (
          <>
            <div class="spinner-border text-primary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </>
        ) : (
          "Comprar"
        )}
      </button>
    </form>
  );
};

function StripeComponent() {
  return (
    <Elements stripe={stripePromise}>
      <div className="container p-4">
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <CheckoutForm />
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default StripeComponent;
