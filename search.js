// search.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  query,
  getDocs,
  where,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

window.search = async function () {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Searching...";

  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);

  const matches = [];

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (
      data.isPublic &&
      data.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm)) &&
      data.uid !== currentUser.uid
    ) {
      matches.push(data);
    }
  });

  resultsDiv.innerHTML = "";

  if (matches.length === 0) {
    resultsDiv.innerHTML = "<p>No matching users found.</p>";
    return;
  }

  matches.forEach(user => {
    const card = document.createElement("div");
    card.style.border = "1px solid #aaa";
    card.style.padding = "10px";
    card.style.marginBottom = "10px";
    card.innerHTML = `
      <strong>${user.name}</strong> <br>
      <small>${user.location || "Location not provided"}</small> <br>
      <strong>Offers:</strong> ${user.skillsOffered.join(", ")} <br>
      <strong>Wants:</strong> ${user.skillsWanted.join(", ")} <br>
      <strong>Availability:</strong> ${user.availability} <br>
      <button onclick='sendRequest("${user.uid}", "${user.name}")'>Request Swap</button>
    `;
    resultsDiv.appendChild(card);
  });
};

window.sendRequest = async function (toUid, toName) {
  try {
    const swapId = `${currentUser.uid}_${toUid}_${Date.now()}`;
    await setDoc(doc(db, "swapRequests", swapId), {
      fromUid: currentUser.uid,
      toUid: toUid,
      status: "pending",
      createdAt: new Date()
    });
    alert(`Swap request sent to ${toName}`);
  } catch (error) {
    alert("Error sending request: " + error.message);
  }
};
