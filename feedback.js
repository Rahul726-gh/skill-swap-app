// feedback.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDocs,
  collection,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await showAcceptedSwaps();
  } else {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

async function showAcceptedSwaps() {
  const swapSnapshot = await getDocs(collection(db, "swapRequests"));
  const userSnapshot = await getDocs(collection(db, "users"));
  const userMap = {};
  userSnapshot.forEach(u => userMap[u.id] = u.data());

  const list = document.getElementById("feedbackList");
  list.innerHTML = "";

  swapSnapshot.forEach(docSnap => {
    const swap = docSnap.data();
    const id = docSnap.id;

    const isMyAcceptedSwap = 
      (swap.fromUid === currentUser.uid || swap.toUid === currentUser.uid) &&
      swap.status === "accepted";

    if (isMyAcceptedSwap) {
      const otherUid = swap.fromUid === currentUser.uid ? swap.toUid : swap.fromUid;
      const otherUser = userMap[otherUid];

      if (!otherUser) return;

      const card = document.createElement("div");
      card.style.border = "1px solid #ccc";
      card.style.padding = "10px";
      card.style.marginBottom = "10px";

      card.innerHTML = `
        <strong>${otherUser.name}</strong><br>
        <textarea id="fb_${id}" placeholder="Write your feedback here..." rows="3" cols="40"></textarea><br>
        <button onclick="submitFeedback('${id}', '${otherUid}')">Submit Feedback</button>
      `;

      list.appendChild(card);
    }
  });
}

window.submitFeedback = async function (swapId, toUid) {
  const feedbackText = document.getElementById(`fb_${swapId}`).value.trim();
  if (!feedbackText) {
    alert("Please write something.");
    return;
  }

  try {
    const feedbackId = `${swapId}_${currentUser.uid}`;
    await setDoc(doc(db, "feedback", feedbackId), {
      from: currentUser.uid,
      to: toUid,
      text: feedbackText,
      createdAt: new Date()
    });

    alert("Feedback submitted ✅");
    document.getElementById(`fb_${swapId}`).disabled = true;
  } catch (error) {
    alert("Error: " + error.message);
  }
};
