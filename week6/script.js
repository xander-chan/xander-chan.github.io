const topHeading = document.querySelector("h1");
// console.log(topHeading);
// console.log(topHeading.textContent);
topHeading.textContent = "This is my new heading";
topHeading.style.color = "red";

const header = document.querySelector("header");
console.log(header);
console.log(header.textContent);
console.log(header.innerHTML);
let course = "HIHIHI";
header.innerHTML = `<h1>Top Heading gg, my course is ${course} </h1>`;

const allParas = document.querySelectorAll("p");
// console.log(allParas);
// console.log(allParas.textContent);
for (let i = 0; i < allParas.length; i++) {
  //   console.log(allParas[i].textContent);
  allParas[i].style.border = "1px solid blue";
}

const mySubHeading = document.querySelector("#first-subheading");
// console.log(mySubHeading);
// console.log(mySubHeading.textContent);

const allSubHeadings = document.querySelectorAll("h2");
// console.log(allSubHeadings);
for (let i = 0; i < allSubHeadings.length; i++) {
  //   console.log(allSubHeadings[i].textContent);
}
