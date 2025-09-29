"use client";
import { initializePaddle } from "@paddle/paddle-js";
import { useState, useEffect } from "react";
import { PaddleCheckoutItem } from "./types";

export default function Home() {
  const [paddle, setPaddle] = useState<any>(null);
  const [billingCycle, setBillingCycle] = useState<"month" | "year">("year");
  const [starterPrice, setStarterPrice] = useState<string>("");
  const [proPrice, setProPrice] = useState<string>("");

  useEffect(() => {
    const initialize = async () => {
      const instanceOfPaddle = await initializePaddle({
        token: process.env.CLIENT_TOKEN,
      });

      setPaddle(instanceOfPaddle ?? null);
    };
    initialize();
  }, []);

  useEffect(() => {
    if (paddle) {
      paddle.Environment.set("sandbox");
    }
    getPrices("year");
  }, [paddle]);

  // define products and prices
  const starterProduct: string = "pro_01k65jdxx468sjhcsratynbphx";
  const proProduct: string = "pro_01k65jg8pgz1prpq13jzq1z0zk";
  const monthItems: PaddleCheckoutItem[] = [
    {
      quantity: 1,
      priceId: "pri_01k65jfq4a2z34ak04ve0ghyzp",
    },
    {
      quantity: 1,
      priceId: "pri_01k65jhp014jyt08r6981f3v4y",
    },
  ];
  var yearItems: PaddleCheckoutItem[] = [
    {
      quantity: 1,
      priceId: "pri_01k65k6px30xq1s4m1ffyfqb7x",
    },
    {
      quantity: 1,
      priceId: "pri_01k65jx1dk3htcrbd2ppp9j76d",
    },
  ];

  function getPrices(cycle: "month" | "year") {
    const itemsList = cycle === "month" ? monthItems : yearItems;
    setBillingCycle(cycle);

    const request = {
      items: itemsList,
    };
    paddle
      ?.PricePreview(request)
      .then((result: { data: any }) => {
        console.log(result);

        const items = result.data.details.lineItems;
        for (const item of items) {
          if (item.product.id === starterProduct) {
            setStarterPrice(item.formattedTotals.subtotal);
            console.log("starter" + item.formattedTotals.subtotal);
          } else if (item.product.id === proProduct) {
            setProPrice(item.formattedTotals.subtotal);
            console.log("pro " + item.formattedTotals.subtotal);
          }
        }
      })
      .catch((error: any) => {
        console.error(error);
      });
  }
  return (
    <>
      {/* <!-- Pricing Container --> */}
      <div className="text-center text-4xl pt-20">
        <h1 className="font-bold pb-2">Jon Leyshon Coding</h1>
        <h2>Choose your membership</h2>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* <!-- Billing Toggle --> */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              id="monthlyBtn"
              className={`px-4 py-2 rounded-md text-sm ${
                billingCycle === "month" ? "bg-white" : ""
              }`}
              onClick={() => getPrices("month")}
            >
              Monthly
            </button>
            <button
              id="yearlyBtn"
              className={`px-4 py-2 rounded-md text-sm ${
                billingCycle === "year" ? "bg-white" : ""
              }`}
              onClick={() => getPrices("year")}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>

        {/* <!-- Pricing Grid --> */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* <!-- Starter Plan --> */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Starter</h3>
            <div className="mb-4">
              <span id="starter-price" className="text-4xl font-bold">
                {`${starterPrice}`}
              </span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <button
              // onClick="openCheckout('starter')"
              className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors"
            >
              Get started
            </button>
          </div>

          {/* <!-- Pro Plan --> */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500 relative">
            <div className="absolute -top-3 right-12 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Popular
            </div>
            <h3 className="text-xl font-semibold mb-4">Pro</h3>
            <div className="mb-4">
              <span id="pro-price" className="text-4xl font-bold">
                {`${proPrice}`}
              </span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
            <button className="w-full bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-700 transition-colors">
              Get started
            </button>
          </div>

          {/* <!-- Enterprise Plan --> */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold">Contact us</span>
            </div>
            <button className="w-full bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors">
              Let's talk
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
