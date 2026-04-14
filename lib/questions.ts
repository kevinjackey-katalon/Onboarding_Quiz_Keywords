export type QuestionType = 'Multiple Choice' | 'Fill in the Blank' | 'Spot the Bug' | 'Drag to Order';

export interface Question {
  id: number;
  category: string;
  type: QuestionType;
  question: string;
  options?: { letter: string; text: string }[];
  correctLetter?: string;
  correctAnswer?: string;
  orderedSteps?: string[];
}

export const questions: Question[] = [

  // ── BROWSER HANDLING ─────────────────────────────────────────────────────
  {
    id: 0, category: 'Browser Handling', type: 'Multiple Choice',
    question: 'Which keyword opens a new browser instance in Katalon Studio?',
    options: [
      { letter: 'A', text: 'WebUI.launchBrowser()' },
      { letter: 'B', text: 'WebUI.openBrowser()' },
      { letter: 'C', text: 'WebUI.startBrowser()' },
      { letter: 'D', text: 'WebUI.initBrowser()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 1, category: 'Browser Handling', type: 'Multiple Choice',
    question: 'What is the correct keyword to navigate to a URL after the browser is already open?',
    options: [
      { letter: 'A', text: 'WebUI.openBrowser(url)' },
      { letter: 'B', text: 'WebUI.goToUrl(url)' },
      { letter: 'C', text: 'WebUI.navigateToUrl(url)' },
      { letter: 'D', text: 'WebUI.loadPage(url)' },
    ],
    correctLetter: 'C',
  },
  {
    id: 2, category: 'Browser Handling', type: 'Multiple Choice',
    question: 'Which two keywords together make up the correct teardown sequence at the end of a web test?',
    options: [
      { letter: 'A', text: 'WebUI.quit() then WebUI.exit()' },
      { letter: 'B', text: 'WebUI.closeWindowIndex(0) then WebUI.quit()' },
      { letter: 'C', text: 'WebUI.closeBrowser() — no second keyword needed for a single window' },
      { letter: 'D', text: 'WebUI.refresh() then WebUI.closeBrowser()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 3, category: 'Browser Handling', type: 'Fill in the Blank',
    question: 'Complete the keyword that reloads the current page without changing the URL:\nWebUI.________()',
    correctAnswer: 'refresh',
  },
  {
    id: 4, category: 'Browser Handling', type: 'Fill in the Blank',
    question: 'Complete the keyword that makes the browser window fill the screen:\nWebUI.______________()',
    correctAnswer: 'maximizeWindow',
  },

  // ── UI INTERACTION ────────────────────────────────────────────────────────
  {
    id: 5, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'What distinguishes WebUI.enhancedClick() from WebUI.click()?',
    options: [
      { letter: 'A', text: 'enhancedClick() only works on buttons, click() works on all elements' },
      { letter: 'B', text: 'enhancedClick() scrolls to the element, waits, then falls back to a JS click if Selenium fails' },
      { letter: 'C', text: 'enhancedClick() is faster because it skips the wait for the element' },
      { letter: 'D', text: 'enhancedClick() triggers a double-click event' },
    ],
    correctLetter: 'B',
  },
  {
    id: 6, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'You need to populate a text field, but the field already has a value. Which keyword clears the existing content AND sets new text in a single call?',
    options: [
      { letter: 'A', text: 'WebUI.sendKeys()' },
      { letter: 'B', text: 'WebUI.clearText() then WebUI.sendKeys()' },
      { letter: 'C', text: 'WebUI.setText()' },
      { letter: 'D', text: 'WebUI.inputText()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 7, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'Which keyword would you use to hover the mouse over a navigation menu item to reveal a dropdown?',
    options: [
      { letter: 'A', text: 'WebUI.hoverElement()' },
      { letter: 'B', text: 'WebUI.mouseOver()' },
      { letter: 'C', text: 'WebUI.focusElement()' },
      { letter: 'D', text: 'WebUI.highlight()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 8, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'A test must upload a file via an <input type="file"> element. Which keyword handles this directly?',
    options: [
      { letter: 'A', text: 'WebUI.sendKeys() with the file path' },
      { letter: 'B', text: 'WebUI.dragAndDropToObject() targeting the input' },
      { letter: 'C', text: 'WebUI.uploadFile()' },
      { letter: 'D', text: 'WebUI.executeJavaScript() with a file reader' },
    ],
    correctLetter: 'C',
  },
  {
    id: 9, category: 'UI Interaction', type: 'Fill in the Blank',
    question: 'Complete the keyword that moves an element from one location and drops it onto another:\nWebUI._________________(sourceObject, destinationObject)',
    correctAnswer: 'dragAndDropToObject',
  },
  {
    id: 10, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'Which keyboard-level keyword would you use to press TAB or ENTER during a form interaction?',
    options: [
      { letter: 'A', text: 'WebUI.typeKey()' },
      { letter: 'B', text: 'WebUI.pressKey()' },
      { letter: 'C', text: 'WebUI.sendKeys()' },
      { letter: 'D', text: 'WebUI.keyPress()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 11, category: 'UI Interaction', type: 'Spot the Bug',
    question: 'This script sets text in a login form. One line uses the wrong keyword for setting text. Click the buggy line:\n(Hint: the keyword must clear existing text before typing)',
    options: [
      { letter: 'A', text: "WebUI.openBrowser('')" },
      { letter: 'B', text: "WebUI.navigateToUrl('https://app.example.com/login')" },
      { letter: 'C', text: "WebUI.sendKeys(findTestObject('txt_username'), 'admin')" },
      { letter: 'D', text: "WebUI.setText(findTestObject('txt_password'), 'secret')" },
    ],
    correctLetter: 'C',
    correctAnswer: "Line 3: WebUI.sendKeys() does not clear existing text — WebUI.setText() should be used for both fields",
  },

  // ── DROPDOWN / SELECTION ──────────────────────────────────────────────────
  {
    id: 12, category: 'UI Interaction', type: 'Multiple Choice',
    question: 'A dropdown\'s <option> elements have value="AU" but display "Australia". Which keyword selects by the hidden value attribute?',
    options: [
      { letter: 'A', text: 'WebUI.selectOptionByLabel()' },
      { letter: 'B', text: 'WebUI.selectOptionByIndex()' },
      { letter: 'C', text: 'WebUI.selectOptionByValue()' },
      { letter: 'D', text: 'WebUI.selectOptionByText()' },
    ],
    correctLetter: 'C',
  },

  // ── VERIFICATION ──────────────────────────────────────────────────────────
  {
    id: 13, category: 'Verification', type: 'Multiple Choice',
    question: 'What is the difference between WebUI.verifyElementPresent() and WebUI.verifyElementVisible()?',
    options: [
      { letter: 'A', text: 'They are identical — both check the DOM and visibility' },
      { letter: 'B', text: 'verifyElementPresent() checks the DOM exists; verifyElementVisible() checks it is also rendered on screen' },
      { letter: 'C', text: 'verifyElementPresent() is for text nodes; verifyElementVisible() is for input elements' },
      { letter: 'D', text: 'verifyElementVisible() throws an exception on failure; verifyElementPresent() returns false' },
    ],
    correctLetter: 'B',
  },
  {
    id: 14, category: 'Verification', type: 'Multiple Choice',
    question: 'Which keyword supports regular expressions when comparing two string values?',
    options: [
      { letter: 'A', text: 'WebUI.verifyEqual()' },
      { letter: 'B', text: 'WebUI.verifyTextPresent()' },
      { letter: 'C', text: 'WebUI.verifyMatch()' },
      { letter: 'D', text: 'WebUI.verifyContains()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 15, category: 'Verification', type: 'Multiple Choice',
    question: 'After a delete action you need to confirm an element is gone from the DOM. Which keyword is the correct choice?',
    options: [
      { letter: 'A', text: 'WebUI.verifyElementVisible()' },
      { letter: 'B', text: 'WebUI.verifyElementNotPresent()' },
      { letter: 'C', text: 'WebUI.verifyTextNotPresent()' },
      { letter: 'D', text: 'WebUI.verifyNotEqual()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 16, category: 'Verification', type: 'Fill in the Blank',
    question: 'Complete the keyword that reads visible text from a UI element and returns it as a String:\nString label = WebUI._______(findTestObject(\'lbl_status\'))',
    correctAnswer: 'getText',
  },
  {
    id: 17, category: 'Verification', type: 'Fill in the Blank',
    question: 'Complete the keyword that retrieves the value of an HTML attribute (e.g. "href" or "class") from an element:\nString href = WebUI.____________(findTestObject(\'lnk_home\'), \'href\')',
    correctAnswer: 'getAttribute',
  },
  {
    id: 18, category: 'Verification', type: 'Multiple Choice',
    question: 'A test asserts that a success banner contains the text "Order placed". Which keyword checks for a substring anywhere on the page?',
    options: [
      { letter: 'A', text: 'WebUI.verifyEqual()' },
      { letter: 'B', text: 'WebUI.verifyMatch()' },
      { letter: 'C', text: 'WebUI.verifyTextPresent()' },
      { letter: 'D', text: 'WebUI.getText()' },
    ],
    correctLetter: 'C',
  },

  // ── WAIT HANDLING ─────────────────────────────────────────────────────────
  {
    id: 19, category: 'Wait Handling', type: 'Multiple Choice',
    question: 'Which wait keyword should be preferred over WebUI.delay() for most dynamic pages, and why?',
    options: [
      { letter: 'A', text: 'WebUI.waitForPageLoad() — it\'s faster because it uses a fixed 1 s poll' },
      { letter: 'B', text: 'WebUI.waitForElementVisible() — it returns as soon as the condition is met, reducing unnecessary wait time' },
      { letter: 'C', text: 'WebUI.delay() — it is the only keyword that works cross-browser' },
      { letter: 'D', text: 'WebUI.waitForElementClickable() — it automatically retries the action after waiting' },
    ],
    correctLetter: 'B',
  },
  {
    id: 20, category: 'Wait Handling', type: 'Multiple Choice',
    question: 'What does WebUI.delay() do, and when is it acceptable to use it?',
    options: [
      { letter: 'A', text: 'It polls the DOM every 500 ms — acceptable for AJAX-heavy pages' },
      { letter: 'B', text: 'It pauses execution for a fixed number of seconds — acceptable only when no dynamic condition can be polled' },
      { letter: 'C', text: 'It delays the next browser request — acceptable before every navigation' },
      { letter: 'D', text: 'It is deprecated and should never be used' },
    ],
    correctLetter: 'B',
  },
  {
    id: 21, category: 'Wait Handling', type: 'Fill in the Blank',
    question: 'Complete the keyword that waits until the full page (HTML + resources) has finished loading:\nWebUI.___________________(timeout)',
    correctAnswer: 'waitForPageLoad',
  },

  // ── FRAME & WINDOW HANDLING ───────────────────────────────────────────────
  {
    id: 22, category: 'Frame & Window Handling', type: 'Multiple Choice',
    question: 'A test interacts with a payment widget inside an <iframe>. What keyword must be called before interacting with elements inside it?',
    options: [
      { letter: 'A', text: 'WebUI.switchToDefaultContent()' },
      { letter: 'B', text: 'WebUI.switchToFrame()' },
      { letter: 'C', text: 'WebUI.switchToWindowIndex()' },
      { letter: 'D', text: 'WebUI.focusFrame()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 23, category: 'Frame & Window Handling', type: 'Multiple Choice',
    question: 'After finishing interactions inside an iframe, which keyword returns focus to the main document?',
    options: [
      { letter: 'A', text: 'WebUI.switchToFrame(null)' },
      { letter: 'B', text: 'WebUI.exitFrame()' },
      { letter: 'C', text: 'WebUI.switchToDefaultContent()' },
      { letter: 'D', text: 'WebUI.switchToWindowIndex(0)' },
    ],
    correctLetter: 'C',
  },
  {
    id: 24, category: 'Frame & Window Handling', type: 'Multiple Choice',
    question: 'A click opens a new browser tab with a known page title "Checkout". Which keyword switches to that tab?',
    options: [
      { letter: 'A', text: 'WebUI.switchToWindowIndex(1)' },
      { letter: 'B', text: 'WebUI.switchToWindowTitle(\'Checkout\')' },
      { letter: 'C', text: 'WebUI.switchToWindowUrl(\'checkout\')' },
      { letter: 'D', text: 'WebUI.switchToFrame(\'Checkout\')' },
    ],
    correctLetter: 'B',
  },
  {
    id: 25, category: 'Frame & Window Handling', type: 'Drag to Order',
    question: 'Drag to arrange the correct sequence for interacting with an element inside an iframe:',
    orderedSteps: [
      'Navigate to the page containing the iframe',
      'Call WebUI.switchToFrame() targeting the iframe object',
      'Interact with elements inside the iframe',
      'Call WebUI.switchToDefaultContent() to return to the main document',
      'Continue interacting with elements in the main page',
    ],
  },

  // ── ALERT HANDLING ────────────────────────────────────────────────────────
  {
    id: 26, category: 'Alert Handling', type: 'Multiple Choice',
    question: 'A JavaScript confirm() dialog appears. You want to click "Cancel". Which keyword handles this?',
    options: [
      { letter: 'A', text: 'WebUI.acceptAlert()' },
      { letter: 'B', text: 'WebUI.closeAlert()' },
      { letter: 'C', text: 'WebUI.dismissAlert()' },
      { letter: 'D', text: 'WebUI.cancelAlert()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 27, category: 'Alert Handling', type: 'Fill in the Blank',
    question: 'Complete the keyword that reads the message text from a JavaScript alert before dismissing it:\nString msg = WebUI.______________()',
    correctAnswer: 'getAlertText',
  },

  // ── JAVASCRIPT & DYNAMIC OBJECTS ─────────────────────────────────────────
  {
    id: 28, category: 'Advanced Keywords', type: 'Multiple Choice',
    question: 'Which keyword lets you run arbitrary JavaScript directly in the browser context during a test?',
    options: [
      { letter: 'A', text: 'WebUI.runScript()' },
      { letter: 'B', text: 'WebUI.executeJavaScript()' },
      { letter: 'C', text: 'WebUI.injectJS()' },
      { letter: 'D', text: 'WebUI.evalJS()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 29, category: 'Advanced Keywords', type: 'Multiple Choice',
    question: 'Your test needs to change a test object\'s XPath at runtime without editing the Object Repository. Which keyword supports this?',
    options: [
      { letter: 'A', text: 'WebUI.updateObjectProperty()' },
      { letter: 'B', text: 'WebUI.modifyObjectProperty()' },
      { letter: 'C', text: 'WebUI.setLocator()' },
      { letter: 'D', text: 'WebUI.overrideXPath()' },
    ],
    correctLetter: 'B',
  },

  // ── API TESTING ───────────────────────────────────────────────────────────
  {
    id: 30, category: 'API Testing', type: 'Multiple Choice',
    question: 'Which WS keyword sends a REST request AND automatically runs a set of verifications in one call?',
    options: [
      { letter: 'A', text: 'WS.sendRequest()' },
      { letter: 'B', text: 'WS.sendRequestAndVerify()' },
      { letter: 'C', text: 'WS.callAndAssert()' },
      { letter: 'D', text: 'WS.verifyResponseStatusCode()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 31, category: 'API Testing', type: 'Multiple Choice',
    question: 'After calling WS.sendRequest(), which keyword confirms the HTTP response code is exactly 200?',
    options: [
      { letter: 'A', text: 'WS.verifyResponseStatusCodeInRange()' },
      { letter: 'B', text: 'WS.assertStatusCode()' },
      { letter: 'C', text: 'WS.verifyResponseStatusCode()' },
      { letter: 'D', text: 'WS.verifyElementPropertyValue()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 32, category: 'API Testing', type: 'Fill in the Blank',
    question: 'Complete the keyword that extracts a value from a JSON response body by property path:\nString token = WS.______________________(response, \'data.token\')',
    correctAnswer: 'getElementPropertyValue',
  },

  // ── MOBILE TESTING ────────────────────────────────────────────────────────
  {
    id: 33, category: 'Mobile Testing', type: 'Multiple Choice',
    question: 'Which Mobile keyword is the equivalent of WebUI.click() on a touchscreen device?',
    options: [
      { letter: 'A', text: 'Mobile.click()' },
      { letter: 'B', text: 'Mobile.touch()' },
      { letter: 'C', text: 'Mobile.tap()' },
      { letter: 'D', text: 'Mobile.press()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 34, category: 'Mobile Testing', type: 'Multiple Choice',
    question: 'A mobile test needs to simulate a long-press gesture to open a context menu. Which keyword is used?',
    options: [
      { letter: 'A', text: 'Mobile.tap()' },
      { letter: 'B', text: 'Mobile.pressAndHold()' },
      { letter: 'C', text: 'Mobile.tapAndHold()' },
      { letter: 'D', text: 'Mobile.longClick()' },
    ],
    correctLetter: 'C',
  },
  {
    id: 35, category: 'Mobile Testing', type: 'Multiple Choice',
    question: 'Which keyword scrolls a mobile screen until a specific text string comes into view?',
    options: [
      { letter: 'A', text: 'Mobile.swipe()' },
      { letter: 'B', text: 'Mobile.scrollToText()' },
      { letter: 'C', text: 'Mobile.scrollUntilVisible()' },
      { letter: 'D', text: 'Mobile.findAndScroll()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 36, category: 'Mobile Testing', type: 'Spot the Bug',
    question: 'This mobile test launches an app and taps a button. One line uses the wrong keyword. Click the buggy line:\n(Hint: check which keyword is correct for starting a mobile application)',
    options: [
      { letter: 'A', text: "Mobile.openBrowser('com.example.app')" },
      { letter: 'B', text: "Mobile.startApplication('com.example.app')" },
      { letter: 'C', text: "Mobile.tap(findTestObject('btn_login'), 0)" },
      { letter: 'D', text: "Mobile.verifyElementVisible(findTestObject('txt_welcome'), 5)" },
    ],
    correctLetter: 'A',
    correctAnswer: "Line 1: Mobile.openBrowser() is a WebUI keyword — the correct keyword is Mobile.startApplication()",
  },

  // ── DESKTOP TESTING ───────────────────────────────────────────────────────
  {
    id: 37, category: 'Desktop Testing', type: 'Multiple Choice',
    question: 'Which Windows keyword launches a native desktop application for automated testing?',
    options: [
      { letter: 'A', text: 'Windows.openApplication()' },
      { letter: 'B', text: 'Windows.launchApp()' },
      { letter: 'C', text: 'Windows.startApplication()' },
      { letter: 'D', text: 'WebUI.openBrowser() with the exe path' },
    ],
    correctLetter: 'C',
  },
  {
    id: 38, category: 'Desktop Testing', type: 'Multiple Choice',
    question: 'After a Windows desktop test completes, which keyword closes the application under test?',
    options: [
      { letter: 'A', text: 'Windows.quit()' },
      { letter: 'B', text: 'Windows.closeApplication()' },
      { letter: 'C', text: 'WebUI.closeBrowser()' },
      { letter: 'D', text: 'Windows.killProcess()' },
    ],
    correctLetter: 'B',
  },

  // ── CROSS-PLATFORM COMPARISON ─────────────────────────────────────────────
  {
    id: 39, category: 'Cross-Platform', type: 'Multiple Choice',
    question: 'Which statement correctly compares WebUI.setText(), Mobile.setText(), and Windows.setText()?',
    options: [
      { letter: 'A', text: 'All three are identical — they share the same underlying implementation' },
      { letter: 'B', text: 'They target different platforms (Web, Mobile, Desktop) but serve the same purpose: entering text into an input field' },
      { letter: 'C', text: 'Only WebUI.setText() clears existing text; Mobile and Windows setText() append to existing content' },
      { letter: 'D', text: 'Mobile.setText() and Windows.setText() are deprecated in favour of WebUI.setText()' },
    ],
    correctLetter: 'B',
  },
  {
    id: 40, category: 'Cross-Platform', type: 'Multiple Choice',
    question: 'Screenshot capture is available across multiple platforms. Which of the following is NOT a valid Katalon screenshot keyword?',
    options: [
      { letter: 'A', text: 'WebUI.takeScreenshot()' },
      { letter: 'B', text: 'WebUI.takeElementScreenshot()' },
      { letter: 'C', text: 'Mobile.takeScreenshot()' },
      { letter: 'D', text: 'WS.takeScreenshot()' },
    ],
    correctLetter: 'D',
  },

  // ── DRAG TO ORDER: FULL WEB TEST ──────────────────────────────────────────
  {
    id: 41, category: 'Browser Handling', type: 'Drag to Order',
    question: 'Drag to arrange the correct lifecycle order for a basic web UI test in Katalon Studio:',
    orderedSteps: [
      'WebUI.openBrowser(\'\') — launch the browser',
      'WebUI.navigateToUrl(url) — go to the target page',
      'WebUI.waitForPageLoad(timeout) — ensure the page is ready',
      'Interact with elements (click, setText, verify, etc.)',
      'WebUI.closeBrowser() — close the browser',
    ],
  },

  // ── SPOT THE BUG: VERIFICATION ────────────────────────────────────────────
  {
    id: 42, category: 'Verification', type: 'Spot the Bug',
    question: 'This verification block has one incorrect keyword. Click the buggy line:\n(Hint: one keyword is being used to check a negative condition but is the wrong choice)',
    options: [
      { letter: 'A', text: "WebUI.verifyElementPresent(findTestObject('msg_success'), 5)" },
      { letter: 'B', text: "WebUI.verifyTextPresent('Order confirmed')" },
      { letter: 'C', text: "WebUI.verifyElementVisible(findTestObject('msg_error'))" },
      { letter: 'D', text: "WebUI.verifyTextPresent('Error occurred')" },
    ],
    correctLetter: 'C',
    correctAnswer: "Line 3: verifyElementVisible() asserts the error message IS visible — to confirm no error, the correct keyword is WebUI.verifyElementNotPresent() or verifyTextNotPresent()",
  },

  // ── API SPOT THE BUG ──────────────────────────────────────────────────────
  {
    id: 43, category: 'API Testing', type: 'Spot the Bug',
    question: 'This API test sends a request and checks the response. Click the buggy line:\n(Hint: check whether the correct keyword is used to assert an exact HTTP status code)',
    options: [
      { letter: 'A', text: "def response = WS.sendRequest(findTestObject('POST_login'))" },
      { letter: 'B', text: "WS.verifyResponseStatusCodeInRange(response, 200, 200)" },
      { letter: 'C', text: "WS.verifyElementPropertyValue(response, 'data.role', 'admin')" },
      { letter: 'D', text: "String token = WS.getElementPropertyValue(response, 'data.token')" },
    ],
    correctLetter: 'B',
    correctAnswer: "Line 2: verifyResponseStatusCodeInRange(200, 200) works but is needlessly verbose — WS.verifyResponseStatusCode(response, 200) is the correct, direct keyword for an exact status code check",
  },
];

export const PASS_MARK = 0.75;
export const CATEGORIES = [...new Set(questions.map(q => q.category))];
