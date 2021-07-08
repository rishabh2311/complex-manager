
var mini = true;

function toggleSidebar() {
  if (mini) {
    console.log("opening sidebar");
    document.getElementById("mySidebar").style.width = "15%";
    // document.getElementById("main").style.marginLeft = "250px";
    this.mini = false;
  } else {
    console.log("closing sidebar");
    document.getElementById("mySidebar").style.width = "5%";

    // document.getElementById("main").style.marginLeft = "85px";
    this.mini = true;
  }
}
var dropdown = document.getElementsByClassName("dropdown-btn");
var i, j, dropdownContent;


// for (i = 0; i < dropdown.length; i++) {
//   dropdown[i].addEventListener("click", function () {
//     this.classList.toggle("active");
//     dropdownContent = this.nextElementSibling;
//     if (dropdownContent.style.display === "block") {
//       dropdownContent.style.display = "none";
//     } else {
//       dropdownContent.style.display = "block";
//     }
//   });
// }
