const dropDown = document.getElementById('class');
const dropDown_subject = document.getElementById('Subjects');
const dropDown_study = document.getElementById('mode');




let choice = "";
let choice_subject = "";
let choice_study = "";

dropDown.addEventListener('change', (event) => {
    choice = event.target.value;
    console.log("Choice updated to: " + choice);
});

dropDown_subject.addEventListener('change', (event) => {
    choice_subject = event.target.value;
    console.log("Subject updated to: " + choice_subject);
});

dropDown_study.addEventListener('change', (event) => {
    choice_study = event.target.value;
    console.log("Study updated to: " + choice_study);
});



alert("Test check ");




