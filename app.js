const selectOptions = document.querySelector("#countrySelect");
const countryFlag = document.querySelector("#countryFlag");
const country = document.querySelector("#country");
const officialName = document.querySelector("#officialName");
const capital = document.querySelector("#capital");
const region = document.querySelector("#region");
const population = document.querySelector("#population");
const area = document.querySelector("#area");
const languages = document.querySelector("#languages");
const currencies = document.querySelector("#currencies");
const currenciesName = document.querySelector("#currenciesName");
const callingCode = document.querySelector("#callingCode");
const carSide = document.querySelector("#carSide");
const timezones = document.querySelector("#timezones");
const continent = document.querySelector("#continent");
const unMember = document.querySelector("#unMember");
const domain = document.querySelector("#domain");
const map = document.querySelector("#map");

async function fetchAPIData() {
  try {
    const API_URL = "https://restcountries.com/v3.1/all/";
    const res = await fetch(API_URL);
    const data = await res.json();

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "-- Choose country to explore --";
    defaultOption.value = "";
    selectOptions.appendChild(defaultOption);

    const dataSorted = data.sort((a, b) => {
      return a.name.common.localeCompare(b.name.common);
    });

    dataSorted.forEach((country) => {
      const option = document.createElement("option");
      option.textContent = country.name.common;
      option.value = country.cca2;
      selectOptions.appendChild(option);
    });
    if (!countryFlag.complete || countryFlag.naturalWidth === 0) {
      countryFlag.classList.add("d-none");
    }
    return dataSorted;
  } catch (err) {
    console.log(err);
  }
}
let countriesDataPromise = fetchAPIData();

selectOptions.addEventListener("change", async () => {
  try {
    const countryData = await countriesDataPromise;
    const countryFullData = countryData.find(
      (country) => country.cca2 == selectOptions.value
    );

    countryFlag.classList.add("d-block");
    countryFlag.classList.remove("d-none");
    countryFlag.src = countryFullData.flags.png;
    country.textContent = countryFullData.name.common;
    officialName.textContent = countryFullData.name.official;
    capital.textContent = countryFullData.capital[0];
    region.textContent = countryFullData.region;
    population.textContent = countryFullData.population.toLocaleString("en-IN");
    area.textContent =
      countryFullData.area.toLocaleString("en-IN") + " (sq. Km)";
    for (lang in countryFullData.languages) {
      languages.textContent = countryFullData.languages[lang];
    }

    for (curr in countryFullData.currencies) {
      const getCurrency = countryFullData.currencies[curr];
      currenciesName.innerHTML = `${getCurrency.name}`;
      currencies.innerHTML = `${curr}, <span class="fw-normal">Symbol: </span> ${getCurrency["symbol"]}`;
    }

    callingCode.textContent =
      countryFullData.idd.root + countryFullData.idd.suffixes[0];
    carSide.textContent = countryFullData.car.side;
    timezones.textContent = countryFullData.timezones[0];
    continent.textContent = countryFullData.continents[0];
    if (countryFullData.unMember === true) {
      unMember.textContent = "Yes";
    } else {
      unMember.textContent = "No";
    }
    domain.textContent = countryFullData.tld[0];
    const mapIframe = `
    <iframe
      src="https://www.google.com/maps?q=${countryFullData.latlng.toString()}&z=6&output=embed"
      frameborder="0"
      width="100%"
      height="100%"
      style="border-radius: 10px"
    ></iframe>
  `;
    map.innerHTML = mapIframe;
  } catch (err) {
    console.log(err);
  }
});
