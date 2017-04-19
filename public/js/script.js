var slideIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("poster");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    if (slideIndex > x.length - 1) {slideIndex = 0} 
    x[slideIndex].style.display = "block"; 
    slideIndex++;
    setTimeout(carousel, 4000); // Change image every 2 seconds
}


function myFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName("store-name");
    for (i = 0; i < li.length; i++) {
        if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].parentElement.style.display = "";
        } else {
            li[i].parentElement.style.display = "none";

        }
    }
}

