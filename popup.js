function injectTheScript() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["content_script.js"]
      }, () => {
          // After injecting, send message to content script
          chrome.tabs.sendMessage(tabs[0].id, { action: 'sendListName' });
      });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const button = document.getElementById("clickactivity");

button.addEventListener("click", async function () {
  // Disable the button immediately
  button.disabled = true;
  button.style.cursor = 'not-allowed';
  button.style.filter='blur(1px)'

  let listName = document.getElementById('listName').value.trim();
  if (listName && listName !== "") {
      chrome.storage.local.set({ listName: listName }, function () {
          console.log('Value is set to ' + listName);
          // Simulate a delay before injecting the script
          setTimeout(() => {
              injectTheScript();
              // Enable the button after injection (assuming this is when automation starts)
              button.disabled = true;
              button.style.cursor = 'not-allowed';
              button.style.filter='blur(1px)' // Restore cursor style
          }, 3000); // Adjust delay as needed
      });
  } else {
      alert("Please enter a list name");
      button.disabled = false; // Enable button on error
      button.style.cursor = 'pointer'; // Restore cursor style
      button.style.filter='blur(0px)'
  }
});
