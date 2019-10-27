/******************************************
Treehouse Techdegree:
FSJS project 2 - List Filter and Pagination
******************************************/


// Create variable containing global student list
const list = document.getElementsByClassName('student-item');

// By default, hide everything in that list
for (var i = 0; i <= list.length -1; i++) {
  list[i].style.display = 'none';
}

// By default, set listing to the first page of returns.
let page = 0;


/*** 
   Show Page - determine which students to show based on the selected page
***/

const showPage = (list, page) => {
  // Set how many records should appear on each page
  const recordsPerPage = 10;

  // If we're on the first page (data-attr 0), set the default start and endIndex
  let startIndex = 0;
  let endIndex = 9;

  //if we're on a page greater than 1, run some math to get updated Start and end indexes
  if(page >=1){
      startIndex = (page * recordsPerPage);
      endIndex = startIndex + (recordsPerPage-1)
  } 

  // Loop through the list (removing 1 to account for 0 start) and show/hide based on start and endIndexes
  for (var i = 0; i <= list.length-1; i++) {
    if(i >= startIndex && i <= endIndex){
        list[i].style.display = 'block';
    } else {
      list[i].style.display = 'none';
    }
  }
}

/*** 
   Create the `appendPageLinks function` to generate, append, and add 
   functionality to the pagination buttons.
***/


const appendPageLinks = (list) => {

  // First, determine how many pages we need
  // Get total number of students
  let listLength = list.length;

  // Divide list by ten, and round it up to get the total number of pages
  let noOfPages = Math.ceil(listLength/10);

  // Build the HTML elem with a link for each page
  // Get the elem we want the pagination appended to
  const listUl = document.getElementsByClassName('student-list');

  // Create the new pagination elem
  const createLinks = document.createElement('div');

  // Set up an array to hold a link for each page number. 
  const pageLink = [];

  for (var i = 0; i < noOfPages; i++) {
    pageLink[i] = `<a class="pagination" data-page=${i} href="#"> ${ i+1 } </a>`; 
  }

  //Give it a class
  createLinks.className = 'listPagination';

  // Flatten the array into page link markup
  createLinks.innerHTML = pageLink.join('|');

  // Add it to the bottom of the list
  listUl[0].appendChild(createLinks);

  // Grab all pagination links
  const paginationLinks = document.querySelectorAll('.pagination');

  //Add active class to the first pagination link
  paginationLinks[0].classList.add('active');

  // For each page, create a link and update the list
  for ( var i = 0; i < paginationLinks.length; i++) {
    paginationLinks[i].addEventListener('click', function(e){
      e.preventDefault();
      // Run function to remove all active classes to avoid repeats 
      removeActiveClass(paginationLinks);
      //Add active class to clicked element
      this.classList.add('active');
      // Get data-page value to dtermine which list to show
      let pageLink = this.getAttribute('data-page');      
      showPage(list, pageLink);
    });
  }
}

/***  
  Remove all active classes to avoid duplication
***/
const removeActiveClass = () => {
  const activeClasses = document.getElementsByClassName('active');
  for ( var i = 0; i < activeClasses.length; i++) {
    activeClasses[i].classList.remove('active');
  }
}

/*** 
  Add Search functionality
 ***/

 // Set up markup for search box
const generateSearch = () =>{
  //Create wrapper div to hold search elem
  const searchDiv = document.createElement('div');

  // Create search field
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Search for students...');
  searchDiv.className = 'student-search';
  
  // Create searchBtn 
  const searchBtn = document.createElement('button');
  searchBtn.innerHTML = 'Search';

  //Append search Input and Button to search wrapper
  searchDiv.appendChild(searchInput);
  searchDiv.appendChild(searchBtn);

  //append search wrapper and all children to page-header div in HTML
  const pageHeader = document.querySelector('.page-header');
  pageHeader.appendChild(searchDiv);

  captureSearch(searchBtn, searchInput);
}

/***
  Remove the default pagination so it can be replaced on search 
***/
const removePagination = ()=>{
  // Grab the pagination div so I can replace it on search submission
  const paginationDiv = document.getElementsByClassName('listPagination');

  //Clear out the contents of the default pagination
  paginationDiv[0].remove();
}

/***
  Generate pagination based on number of search returns
***/
const searchPagination = (searchReturns) => {
  removePagination();
  // Generate new page links, calculated using search returns
  appendPageLinks(searchReturns);
  showPage(searchReturns, page);
}

/***
  Capture search value
***/
const captureSearch = (searchBtn, searchInput) => {
  
  //bundle submission code for reuse in this function
  searchSubmit =(e)=>{
    //Before anything, check for an error message
    const findErrorMsg = document.querySelector('.search-error'); 
    
    //If it exists, remove it
    if(typeof(findErrorMsg)!= 'undefined' && findErrorMsg != null){
      findErrorMsg.remove();
    }

    //Get search string and pass to the run search function
    requestedString = searchInput.value;
    runSearch(list, requestedString);
    e.preventDefault();
  }
  
  // Run submission code on click
  searchBtn.addEventListener('click', function(e){
    searchSubmit(e);
  });

  // Run submission code on enter
  searchBtn.addEventListener("keyup", function(e) {
    console.log('works?');
    if (event.keyCode === 13) {
      searchSubmit(e);
    }
  });
}

/***
  Create and append a search error message
***/
const searchError = () =>{
   const pageHeader = document.querySelector('.student-list');
   const createErrorMsg = document.createElement('span');
   createErrorMsg.className = 'search-error';
   createErrorMsg.innerText = 'Sorry, No results. Please Try Again';
   createErrorMsg.style.color = 'red';
   pageHeader.appendChild(createErrorMsg);
}

/***
  Run search for requested string
***/
const runSearch = (list, requestedString) =>{
  let searchResults = [];
  // Convert list collection into array
  let listCollectionToArray = Array.prototype.slice.call( list );
  // Filter the array for search terms.
  let searchedList = listCollectionToArray.filter(function(obj){
    // hide everything by default
    obj.style.display = 'none';
    // if object matches search, show it and add it to results array
    if (obj.innerText.includes(requestedString)){
      obj.style.display = 'block';
      searchResults.push(obj);
    }

  });
  
  if(searchResults.length >0){
    searchPagination(searchResults);
  } else {
    searchError();
    searchPagination(0);
  }
}


/***
  Generate a button that allows the user to reset to default listings
***/
const generateResetBtn = ()=>{
  // Create reset button
  const resetBtn = document.createElement('button');
  resetBtn.innerText = 'Reset Listing';
  resetBtn.className = 'reset-listing'
  const pageHeader = document.querySelector('.page-header');
  pageHeader.appendChild(resetBtn);
  resetListings();
}

/***
  Add logic to reset to default listing
***/
const resetListings = () => {
  const resetBtn = document.querySelector('.reset-listing');
  // run submission code on click
  resetBtn.addEventListener('click', function(e){
    const list = document.getElementsByClassName('student-item');
    showPage(list, page);
    appendPageLinks(list);
    removePagination();
    e.preventDefault();
  });

  // run submission code on enter
  resetBtn.addEventListener("keyup", function(e) {
    if (event.keyCode === 13) {
      const list = document.getElementsByClassName('student-item');
      showPage(list, page);
      removePagination();
      appendPageLinks(list);
      e.preventDefault();
    }
  });
}

generateResetBtn();
showPage(list, page);
appendPageLinks(list);
generateSearch();