// dashboard.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Get the current logged-in user
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User is logged in:", user.email);
  } else {
    alert("You must be logged in to access this page.");
    window.location.href = "index.html"; // redirect to login if not logged in
  }
});

// Save profile to Firestore
window.saveProfile = async function () {
  const name = document.getElementById("name").value;
  const location = document.getElementById("location").value;
  const skillsOffered = document.getElementById("skillsOffered").value.split(",").map(s => s.trim());
  const skillsWanted = document.getElementById("skillsWanted").value.split(",").map(s => s.trim());
  const availability = document.getElementById("availability").value;
  const isPublic = document.getElementById("publicProfile").checked;

  if (!name || skillsOffered.length === 0 || skillsWanted.length === 0) {
    alert("Please fill in all required fields.");
    return;
  }

  try {
    await setDoc(doc(db, "users", currentUser.uid), {
      uid: currentUser.uid,
      email: currentUser.email,
      name,
      location,
      skillsOffered,
      skillsWanted,
      availability,
      isPublic
    });

    alert("Profile saved successfully!");
  } catch (error) {
    alert("Failed to save profile: " + error.message);
  }
};
