// pending.js
import { auth, db } from "./firebase.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await loadSwapRequests();
  } else {
    alert("Please login first.");
    window.location.href = "index.html";
  }
});

async function loadSwapRequests() {
  const allRequests = await getDocs(collection(db, "swapRequests"));
  const usersSnapshot = await getDocs(collection(db, "users"));

  const userMap = {};
  usersSnapshot.forEach(u => userMap[u.id] = u.data());

  const sentDiv = document.getElementById("sentRequests");
  const receivedDiv = document.getElementById("receivedRequests");

  sentDiv.innerHTML = "";
  receivedDiv.innerHTML = "";

  allRequests.forEach((docSnap) => {
    const req = docSnap.data();
    const id = docSnap.id;

    if (req.fromUid === currentUser.uid) {
      // You sent this request
      const toUser = userMap[req.toUid];
      if (toUser) {
        sentDiv.innerHTML += `
          <div>
            <strong>To:</strong> ${toUser.name} (${toUser.email})<br>
            <strong>Status:</strong> ${req.status}<br><br>
          </div>
        `;
      }
    }

    if (req.toUid === currentUser.uid) {
      // You received this request
      const fromUser = userMap[req.fromUid];
      if (fromUser && req.status === "pending") {
        const card = document.createElement("div");
        card.innerHTML = `
          <strong>From:</strong> ${fromUser.name} (${fromUser.email})<br>
          <strong>Status:</strong> ${req.status}<br>
          <button onclick="acceptRequest('${id}')">Accept</button>
          <button onclick="rejectRequest('${id}')">Reject</button><br><br>
        `;
        receivedDiv.appendChild(card);
      }
    }
  });
}

window.acceptRequest = async function (id) {
  await updateDoc(doc(db, "swapRequests", id), {
    status: "accepted"
  });
  alert("Request accepted ✅");
  location.reload();
};

window.rejectRequest = async function (id) {
  await updateDoc(doc(db, "swapRequests", id), {
    status: "rejected"
  });
  alert("Request rejected ❌");
  location.reload();
};
