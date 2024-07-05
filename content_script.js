chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'sendListName') {
    chrome.storage.local.get(['listName'], function(result) {
      if (result.listName) {
        console.log('Received list name from extension storage:', result.listName);
        runScript(result.listName);
      } else {
        console.error('No list name found in extension storage.');
      }
    });
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let counter = 1;

function runScript(listName) {
  console.log("Page: ", counter, " starts");

  document.querySelector(
    '[class="zp-button zp_zUY3r zp_B5hnZ zp_rhXT_ zp_FVbJk finder-select-multiple-entities-button"]'
  ).click();
  document.querySelector('[class="zp-menu-item zp_fZtsJ zp_pEvFx zp_tEPsU"]').click();
  document.querySelector("#lists").click();
  document.querySelector('[class="zp-menu-item zp_fZtsJ zp_pEvFx"]').click();

  if (listName) {
    typeText(listName);
  } else {
    console.error("List name is null or empty.");
  }
}

async function typeText(text) {
  await sleep(3000);
  console.log("Typing start");
  const inputElement = document.querySelector("input.Select-input");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    inputElement.value += char; // Append character to input's value

    // Dispatch input event after setting the value 
    inputElement.dispatchEvent(new Event("input", { bubbles: true }));

    // Optional delay to simulate typing speed
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  // Simulate pressing Enter key
  const enterKeyEvent = new KeyboardEvent("keydown", {
    key: "Enter",
    bubbles: true,
    cancelable: true,
    keyCode: 13, // Optional, some older browsers may need this
  });

  // Dispatch the Enter key event to the input element
  inputElement.dispatchEvent(enterKeyEvent);
  console.log("Typing done");
  document.querySelector('[data-cy="confirm"]').click();
  await sleep(3000);
  console.log("clicked");
  console.log("Page: ", counter, " ends");
  counter++;
  const button = document.querySelector('button[aria-label="right-arrow"]');
  if (button && button.hasAttribute("disabled")) {
    console.log("Last Page");
  } else {
    button.click();
    await sleep(3000);
    runScript(text);  // Continue with the next page using the same list name
  }
}
