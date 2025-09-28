Paddle.Environment.set("sandbox");
Paddle.Initialize({
  token: "test_240df8400557075dffe82cf9649",
});

// define products and prices
var starterProduct = "pro_01k65jdxx468sjhcsratynbphx";
var proProduct = "pro_01k65jg8pgz1prpq13jzq1z0zk";
var monthItems = [
  {
    quantity: 1,
    priceId: "pri_01k65jfq4a2z34ak04ve0ghyzp",
  },
  {
    quantity: 1,
    priceId: "pri_01k65jhp014jyt08r6981f3v4y",
  },
];
var yearItems = [
  {
    quantity: 1,
    priceId: "pri_01k65k6px30xq1s4m1ffyfqb7x",
  },
  {
    quantity: 1,
    priceId: "pri_01k65jx1dk3htcrbd2ppp9j76d",
  },
];

// DOM queries
var starterPriceLabel = document.getElementById("starter-price");
var proPriceLabel = document.getElementById("pro-price");
const monthlyBtn = document.getElementById("monthlyBtn");
const yearlyBtn = document.getElementById("yearlyBtn");

/// set initial billing cycle
var billingCycle = "year";

// get prices
// get prices
function getPrices(cycle) {
  var itemsList = cycle === "month" ? monthItems : yearItems;
  var billingCycle = cycle;
  monthlyBtn.classList.toggle("bg-white", cycle === "month");
  yearlyBtn.classList.toggle("bg-white", cycle === "year");
  var request = {
    items: itemsList,
  };
  Paddle.PricePreview(request)
    .then((result) => {
      console.log(result);

      var items = result.data.details.lineItems;
      for (item of items) {
        if (item.product.id === starterProduct) {
          starterPriceLabel.innerHTML = item.formattedTotals.subtotal;
          console.log("starter " + item.formattedTotals.subtotal);
        } else if (item.product.id === proProduct) {
          proPriceLabel.innerHTML = item.formattedTotals.subtotal;
          console.log("pro " + item.formattedTotals.subtotal);
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
