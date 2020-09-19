// access the input values

let incomeInput = document.querySelector(".income-input");
let dividendInput = document.querySelector(".dividend-input");
let frankingPercentageInput = document.querySelector(".input__box--franking");
let deductionsInput = document.querySelector(".deductions-input");

// update input values to display as currency

document.querySelectorAll(".input__box").forEach((input) => {
  input.addEventListener("change", (event) => {
    console.log(input.value);
    input.value = Intl.NumberFormat().format(input.value);
  });
});

// income.addEventListener("change", toCurrency);

let toNumber = function (currency) {
  return parseFloat(currency.replace(/,/g, ""));
};

let formatCurrency = function (int) {
  return `$${Number(Math.round(int)).toLocaleString()}`;
};

let marginalTax;
let medicareTax;
let frankingCredits;
let assessableIncome;
let lito;
let lmto;
let helpRepayment;
let totalTax;

let incomeValue;
let dividendValue;
let taxValue;

// calculate franking credits

let frankingCalc = () => {
  frankingCredits =
    toNumber(dividendInput.value) *
    (30 / 70) *
    (frankingPercentageInput.value / 100);

  return frankingCredits;
};

let assessableIncomeCal = () => {
  frankingCalc();
  assessableIncome =
    toNumber(incomeInput.value) +
    frankingCredits +
    toNumber(dividendInput.value) -
    toNumber(deductionsInput.value);
};

let marginalTaxCalc = (assessment) => {
  let marginalRate = document.querySelector(".outcome__text-marginal");

  switch (true) {
    case assessment < 18200:
      marginalTax = 0;
      marginalRate.innerHTML = "0%";
      break;

    case assessment < 37000:
      marginalTax = (assessment - 18200) * 0.19;
      marginalRate.innerHTML = "19%";
      break;

    case assessment < 90000:
      marginalTax = (assessment - 37000) * 0.325 + 3572;
      marginalRate.innerHTML = "32.5%";
      break;

    case assessment < 180000:
      marginalTax = (assessment - 90000) * 0.37 + 20797;
      marginalRate.innerHTML = "37%";
      break;

    case assessment >= 180000:
      marginalTax = (assessment - 180000) * 0.45 + 54097;
      marginalRate.innerHTML = "45%";
      break;
  }

  return marginalTax;
};

let medicareTaxCalc = (assessment) => {
  medicareTax = assessment * 0.02;

  return medicareTax;
};

let litoCalc = (assessableIncome) => {
  switch (true) {
    case assessableIncome < 37000:
      lito = 445;
      break;

    case assessableIncome < 66667:
      lito = 445 - (assessableIncome - 37000) * 0.015;
      break;

    case assessableIncome >= 66667:
      lito = 0;
      break;
  }

  return lito;
};

let lmtoCalc = (assessableIncome) => {
  switch (true) {
    case assessableIncome < 37000:
      lmto = 255;
      break;

    case assessableIncome < 48000:
      lmto = 255 + 0.075 * (assessableIncome - 37000);
      break;

    case assessableIncome < 90000:
      lmto = 1080;
      break;

    case assessableIncome < 126000:
      lmto = 1080 - (assessableIncome - 90000) * 0.03;
      break;

    case assessableIncome >= 126000:
      lmto = 0;
      break;
  }

  return lmto;
};

let calculateTax = () => {
  assessableIncomeCal();
  marginalTaxCalc(assessableIncome);
  medicareTaxCalc(assessableIncome);
  litoCalc(assessableIncome);
  lmtoCalc(assessableIncome);

  marginalTax + medicareTax - (lito + lmto) < 0
    ? (totalTax = 0 - frankingCredits)
    : (totalTax = marginalTax + medicareTax - (lito + lmto + frankingCredits));

  let taxOutcomeTitle = document.querySelector(".outcome__title--totalTax");
  let taxOutcomeText = document.querySelector(".totalTaxOutcome");
  let taxRateOutcomeText = document.querySelector(".taxRateOutcome");

  if (totalTax < 0) {
    taxOutcomeTitle.innerHTML = "Tax Refund";
    taxOutcomeText.innerHTML = formatCurrency(totalTax * -1);
    taxOutcomeText.classList.remove("outcome__text--negative");
    taxOutcomeText.classList.add("outcome__text--positive");
  } else {
    taxOutcomeTitle.innerHTML = "Tax Payable";
    taxOutcomeText.classList.remove("outcome__text--positive");
    taxOutcomeText.classList.add("outcome__text--negative");
    taxOutcomeText.innerHTML = formatCurrency(totalTax);
  }

  taxRateOutcomeText.innerHTML = `${Math.round(
    (totalTax / assessableIncome) * 100
  )}%`;

  let cashAfterTax =
    toNumber(incomeInput.value) +
    toNumber(dividendInput.value) -
    toNumber(deductionsInput.value) -
    totalTax;

  document.querySelector(".cashOutcome").innerHTML = formatCurrency(
    cashAfterTax
  );

  // console.log(`assessable income totals $${toNumber(assessableIncome)}`);
  // console.log(`income is $${toNumber(incomeInput.value)}`);
  // console.log(`dividends $${toNumber(dividendInput.value)}`);
  // console.log(`franking credits $${Math.round(frankingCredits)}`);
  // console.log(`dividends $${toNumber(deductionsInput.value)}`);
  // console.log(`total tax payable is $${totalTax}`);

  document.querySelector(".totalIncomeTable").innerHTML = formatCurrency(
    toNumber(incomeInput.value) + toNumber(dividendInput.value)
  );

  document.querySelector(".frankingCreditsTable").innerHTML = formatCurrency(
    frankingCredits
  );

  document.querySelector(".deductionsTable").innerHTML = formatCurrency(
    toNumber(deductionsInput.value)
  );

  document.querySelector(".taxableIncomeTable").innerHTML = formatCurrency(
    assessableIncome
  );

  document.querySelector(".marginalTaxTable").innerHTML = formatCurrency(
    marginalTax
  );

  document.querySelector(".medicareTable").innerHTML = formatCurrency(
    medicareTax
  );

  document.querySelector(".litoTable").innerHTML = formatCurrency(lito);
  document.querySelector(".lmtoTable").innerHTML = formatCurrency(lmto);
  document.querySelector(".frankingCreditsTable2").innerHTML = formatCurrency(
    frankingCredits
  );

  document.querySelector(".totalTaxTable").innerHTML = formatCurrency(totalTax);

  incomeValue = parseFloat(cashAfterTax);

  taxValue = Math.round(totalTax);

  let info = [incomeValue, taxValue];
  chart.data.datasets[0].data = info;
  chart.update();
};

let button = document.querySelector(".btn");

button.addEventListener("click", calculateTax);

var ctx = document.getElementById("myChart");

var chart = new Chart(ctx, {
  // The type of chart we want to create
  type: "pie",

  // The data for our dataset
  data: {
    labels: ["income", "tax"],
    datasets: [
      {
        data: [50, 50],
        backgroundColor: ["#507c57", "#ee6c4d"],
        width: "100%",
      },
    ],
  },

  // Configuration options go here
  options: {
    legend: {
      labels: {
        // This more specific font property overrides the global property
        fontColor: "#2f394b",
        fontStyle: "bold",
        fontSize: 16,
        fontFamily: "Helvetica",
      },
    },
  },
});

// collapsible
let collapser = document.querySelector(".collapser");

collapser.addEventListener("click", function () {
  collapser.classList.toggle("open");
});

let helpCalc = function (assessableIncome) {
  switch (true) {
    case assessableIncome < 46620:
      helpRepayment = 255;
      break;
  }

  return lmto;
};
