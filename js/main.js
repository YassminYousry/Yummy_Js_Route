let section = document.getElementById("allSections");
let search = document.getElementById("search");
let submitBtn;

$(document).ready(function () {
  // =================== Loading ==================
  searchByName("").then(() => {
    $(".spinner").fadeOut(10, function () {
      $("#loading").fadeOut(10, function () {
        $("body").css("overflow", "auto");
      })
    });
  });

  closeNav();
  $("#allSections").click(500, function () {
    closeNav()
  });

  $(".logo").click(500, function () {
    search.innerHTML = "";
    searchByName("");
  })
  // ====================== SideBar Links Functions =================
  // ==========Search=============
  $(".search").click(500, function () {
    closeNav();
    searchInputs();
  })
  // ==========Category=============
  $(".category").click(500, function () {
    loadFadeIn();
    closeNav();
    getCategories()
  })
  // ==========Area=============
  $(".area").click(500, function () {
    closeNav();

    getArea();

  })
  // ==========Ingredient=============
  $(".ingredient").click(500, function () {
    loadFadeIn();
    closeNav();
    getIngredients();
  })
  // ==========Contact=============
  $(".contact").click(500, function () {
    closeNav();
    showContacts();
  })
  // ==================== Global Functions ===================
  function loadFadeIn() {
    $(".spinner").fadeIn(100, function () {
      $("#loading").css("zIndex", 999).fadeIn(100)
    })
  }

  function loadFadeOut() {
    $(".spinner").fadeOut(500, function () {
      $("#loading").fadeOut(500)
    })
  }
  // ==================== Image Layer =================
  // function imgHover() {
  //   let imgDivHeight = $(".mealImg").height();

  //   $(".mealImg").hover(function () {
  //     $(this).children(".layer").animate({ top: 0 }, 500)

  //   }, function () {
  //     $(this).children(".layer").animate({ top: imgDivHeight }, 500)
  //   });
  // }

  // =================== Close NavBar ==================
  function closeNav() {
    let navWidth = $("#innerSideBar").outerWidth();
    $("#sideBar").animate({ left: -navWidth }, 500);

    $(".navIcon").addClass("fa-bars");
    $(".navIcon").removeClass("fa-x");

    $(".navList li").animate({ top: 200 }, 500);
  }
  // =================== Open NavBar ==================
  function openNav() {
    $("#sideBar").animate({ left: 0 }, 500);

    $(".navIcon").removeClass("fa-bars");
    $(".navIcon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
      $(".navList li")
        .eq(i)
        .animate({ top: 0 }, (i + 5) * 100);
    }
  }
  // =================== Click Icon NavBar ==================
  $(".navIcon").click(() => {
    if ($("#sideBar").css("left") == "0px") {
      closeNav();
    } else {
      openNav();
    }
  });
  // =================== Search By Name ==================
  async function searchByName(name) {
    section.innerHTML = "";
    if (name != "") {
      loadFadeIn()
    }

    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    let data = await response.json();

    data.meals ? displayMeals(data.meals) : displayMeals([]);

    if (name != "") {
      loadFadeOut()
    }
  }

  // =================== Display Meals =================
  function displayMeals(mealsList) {
    section.innerHTML = "";
    let divs = ``;
    for (let i = 0; i < mealsList.length; i++) {
      divs += `
    <div class="col-8 col-md-3 mb-4 m-auto " >
      <div mealId ='${mealsList[i].idMeal}' class = "mealImg p-0 position-relative rounded-2 overflow-hidden cursor-pointer" > 
        <img src="${mealsList[i].strMealThumb}" alt="meal" />
        <div class="layer d-flex align-items-center fs-3 fw-semibold px-3">
        <p>${mealsList[i].strMeal}</p>
        </div>
    </div>
  </div>
    `
    }
    section.innerHTML = divs;
    // imgHover();
    $(".mealImg").click(500, function () {
      let mealId = $(this).attr("mealId");
      mealDetails(mealId);
    })
  }

  // =================== Display Meal Details =================
  function displayMealDetails(mealsList) {
    search.innerHTML = "";

    // =================== Ingredients ==================
    let ingredient = ``;
    for (let i = 1; i <= 20; i++) {
      if (mealsList[`strIngredient${i}`]) {
        ingredient += `
      <li class="alert alert-info m-2 p-1">${mealsList[`strMeasure${i}`]} ${mealsList[`strIngredient${i}`]}</li>
      `
      }
    }
    // =================== Tags ==================
    let tags = mealsList.strTags;
    tags ? tags = tags.split(",") : tags = [];

    let tagsLi = ``;
    for (let i = 0; i < tags.length; i++) {
      tagsLi += `
    <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`

    }

    // ====================== Display Meal's Details ======================
    let divs = `
    <div class="col-md-4 text-white text-center">
                <img class="w-100 rounded-3" src="${mealsList.strMealThumb}"
                    alt="">
                    <h2 class="mt-2">${mealsList.strMeal}</h2>
            </div>
            <div class="col-md-8 text-white">
                <h2>Instructions</h2>
                <p class = "fw-lighter">${mealsList.strInstructions}</p>
                <h5 class = "fw-lighter"><span class="fw-bolder">Area : </span>${mealsList.strArea}</h5>
                <h5 class = "fw-lighter"><span class="fw-bolder">Category : </span>${mealsList.strCategory}</h5>
                <h5 class = "fw-lighter"><span class="fw-bolder">Recipes : </span></h5>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${ingredient}
                </ul>

                <h4>Tags :</h4>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsLi}
                </ul>

                <h4>Sources :</h4>
                <a target="_blank" href="${mealsList.strSource}" class="btn btn-success ms-2 mt-1">Source</a>
                <a target="_blank" href="${mealsList.strYoutube}" class="btn btn-danger ms-2 mt-1">Youtube</a>
            </div>`

    section.innerHTML = divs;
  }

  // =================== Meal Details =================
  async function mealDetails(mealId) {
    section.innerHTML = "";
    loadFadeIn()

    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    let data = await response.json();

    displayMealDetails(data.meals[0]);
    loadFadeOut();
  }

  // =================== Search Inputs =================
  function searchInputs() {
    search.innerHTML = `
  <div class="container p-5">
    <div class="row">
      <div class="row py-4 ">
        <div class="col-md-6 text-white">
          <input id="searchName" class="form-control bg-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
          <input  maxlength="1" class="form-control bg-white " type="text" placeholder="Search By First Letter">
      </div>
        </div>
    </div>
  </div>
  `
    $("#searchName").keyup(function (e) {
      let keyValue = e.target.value;
      if (keyValue === "") {
        section.innerHTML = ""
      } else {
        searchByName(keyValue);
      }
    })

    section.innerHTML = ""
  }

  // ====================== Category =================
  async function getCategories() {

    section.innerHTML = ""
    search.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json()

    displayCategories(data.categories)
    loadFadeOut();

  }

  // ====================== Display Category =================
  function displayCategories(mealsList) {
    let divs = "";

    for (let i = 0; i < mealsList.length; i++) {
      divs += `
        <div class="col-8 col-md-3 mb-3 m-auto">
                <div strCat = '${mealsList[i].strCategory}' class="mealImg position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${mealsList[i].strCategoryThumb}" alt="" srcset="">
                    <div class="layer position-absolute text-center text-black p-2">
                        <h3>${mealsList[i].strCategory}</h3>
                        <p class="fw-lighter">${mealsList[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
    }
    section.innerHTML = divs;
    // imgHover();

    $(".mealImg").click(500, function () {
      strCat = $(this).attr("strCat");
      console.log(strCat);
      getCategoryMeals(strCat)
    })
  }
  // ====================== Category Meals =================
  async function getCategoryMeals(category) {
    section.innerHTML = ""
    loadFadeIn();
    console.log(category);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let data = await response.json()

    displayMeals(data.meals.slice(0, 20))
    loadFadeOut();
  }

  // ====================== Area =================
  async function getArea() {
    loadFadeIn();

    section.innerHTML = ""
    search.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let data = await response.json()

    displayArea(data.meals)
    loadFadeOut()

  }

  // ====================== Display Area =================
  function displayArea(mealsList) {
    let divs = "";

    for (let i = 0; i < mealsList.length; i++) {
      divs += `
        <div class="col-md-3 col-6 m-auto mb-3">
                <div strArea = '${mealsList[i].strArea}' class="rounded-2 text-center cursor-pointer areaDiv text-white m-3">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${mealsList[i].strArea}</h3>
                </div>
        </div>
        `
    }
    section.innerHTML = divs;

    $(".areaDiv").click(500, function () {
      strArea = $(this).attr("strArea");
      getAreaMeals(strArea)
    })
  }
  // ====================== Area Meals =================
  async function getAreaMeals(area) {
    section.innerHTML = ""
    loadFadeIn();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let data = await response.json()

    displayMeals(data.meals.slice(0, 20))
    loadFadeOut();
  }

  // ====================== Ingredients =================
  async function getIngredients() {

    section.innerHTML = ""
    search.innerHTML = "";

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let data = await response.json()

    displayIngredients(data.meals.slice(0, 20))
    loadFadeOut();
  }

  // ====================== Display Ingredients =================
  function displayIngredients(mealsList) {
    let divs = "";

    for (let i = 0; i < mealsList.length; i++) {
      divs += `
        <div class="col-md-3 col-8 m-auto mb-3">
                <div strIngredient='${mealsList[i].strIngredient}' class="rounded-2 text-center cursor-pointer text-white m-3 ingredientsDiv">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${mealsList[i].strIngredient}</h3>
                        <p>${(mealsList[i].strDescription).split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }
    section.innerHTML = divs;

    $(".ingredientsDiv").click(500, function () {
      strIngredient = $(this).attr("strIngredient");
      getIngredientsMeals(strIngredient)
    })
    // onclick="getIngredientsMeals('${arr[i].strIngredient}')"
  }
  // ====================== Ingredients Meals =================
  async function getIngredientsMeals(area) {
    section.innerHTML = ""
    loadFadeIn();

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${area}`)
    let data = await response.json()

    displayMeals(data.meals.slice(0, 20))
    loadFadeOut();
  }

  // ===========================================Contact Us =================================
  function showContacts() {
    search.innerHTML = "";
    section.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput"  type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
    })
    $("#nameInput").keyup(function () {
      inputsValidation();
    })
    document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
    })
    $("#emailInput").keyup(function () {
      inputsValidation();
    })
    document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
    })
    $("#phoneInput").keyup(function () {
      inputsValidation();
    })
    document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
    })
    $("#ageInput").keyup(function () {
      inputsValidation();
    })
    document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
    })
    $("#passwordInput").keyup(function () {
      inputsValidation();
    })
    document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
    })
    $("#repasswordInput").keyup(function () {
      inputsValidation();
    })
  }

  let nameInputTouched = false;
  let emailInputTouched = false;
  let phoneInputTouched = false;
  let ageInputTouched = false;
  let passwordInputTouched = false;
  let repasswordInputTouched = false;


  function inputsValidation() {
    if (nameInputTouched) {
      if (nameValidation()) {
        document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
        document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
    }
    if (emailInputTouched) {

      if (emailValidation()) {
        document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
        document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
    }

    if (phoneInputTouched) {
      if (phoneValidation()) {
        document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
        document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
    }

    if (ageInputTouched) {
      if (ageValidation()) {
        document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
        document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
    }

    if (passwordInputTouched) {
      if (passwordValidation()) {
        document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
        document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
    }
    if (repasswordInputTouched) {
      if (repasswordValidation()) {
        document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
        document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
    }


    if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
    } else {
      submitBtn.setAttribute("disabled", true)
    }
  }

  function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
  }

  function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
  }

  function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
  }

  function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
  }

  function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
  }

  function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
  }
});