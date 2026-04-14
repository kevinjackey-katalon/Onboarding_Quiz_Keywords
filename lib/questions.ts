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
  {
    id: 0, category: "Configuration", type: "Multiple Choice",
    question: "What does the Smart Wait feature in Katalon Studio primarily help with?",
    options: [
      { letter: "A", text: "Slowing down test execution for debugging" },
      { letter: "B", text: "Handling AJAX-heavy pages without explicit delays" },
      { letter: "C", text: "Setting timeouts for custom keywords" },
      { letter: "D", text: "Configuring browser startup speed" }
    ],
    correctLetter: "B"
  },
  {
    id: 1, category: "Configuration", type: "Multiple Choice",
    question: "Where do you enable Self-Healing in Katalon Studio?",
    options: [
      { letter: "A", text: "Test Suite > Properties" },
      { letter: "B", text: "Project > Settings > Self-Healing" },
      { letter: "C", text: "Tools > Self-Healing Manager" },
      { letter: "D", text: "Run > Execution Options > Self-Healing" }
    ],
    correctLetter: "B"
  },
  {
    id: 2, category: "Configuration", type: "Multiple Choice",
    question: "Which integration provides centralized analytics, reporting, and execution history?",
    options: [
      { letter: "A", text: "JIRA Integration" },
      { letter: "B", text: "Azure DevOps Integration" },
      { letter: "C", text: "Katalon TestOps" },
      { letter: "D", text: "Selenium Grid" }
    ],
    correctLetter: "C"
  },
  {
    id: 3, category: "Locators", type: "Multiple Choice",
    question: "Which locator type is most stable when a unique HTML attribute is available?",
    options: [
      { letter: "A", text: "XPath" },
      { letter: "B", text: "CSS Selector" },
      { letter: "C", text: "Attributes (id, name, aria-*)" },
      { letter: "D", text: "Image-based matching" }
    ],
    correctLetter: "C"
  },
  {
    id: 4, category: "Locators", type: "Multiple Choice",
    question: "What is the recommended use case for the Smart Locator type?",
    options: [
      { letter: "A", text: "Lightweight CSS-based selections" },
      { letter: "B", text: "Visual element matching as a last resort" },
      { letter: "C", text: "Deep nested elements such as Shadow DOM or iFrames" },
      { letter: "D", text: "Elements with stable, unique IDs" }
    ],
    correctLetter: "C"
  },
  {
    id: 5, category: "Locators", type: "Multiple Choice",
    question: "What is the recommended Self-Healing locator fallback order?",
    options: [
      { letter: "A", text: "CSS > XPath > Image > Attributes > Smart Locator" },
      { letter: "B", text: "XPath > Smart Locator > Attributes > CSS > Image" },
      { letter: "C", text: "Attributes > XPath > CSS > Image > Smart Locator" },
      { letter: "D", text: "Smart Locator > XPath > CSS > Attributes > Image" }
    ],
    correctLetter: "B"
  },
  {
    id: 6, category: "Locators", type: "Multiple Choice",
    question: "Which custom HTML attribute do the training materials recommend for robust element targeting?",
    options: [
      { letter: "A", text: "id" },
      { letter: "B", text: "name" },
      { letter: "C", text: "data-test-id" },
      { letter: "D", text: "aria-label" }
    ],
    correctLetter: "C"
  },
  {
    id: 7, category: "Test Creation", type: "Multiple Choice",
    question: "After using the Web Recorder, where should captured objects initially be reviewed?",
    options: [
      { letter: "A", text: "The Object Repository root folder" },
      { letter: "B", text: "A temporary (Temp) folder" },
      { letter: "C", text: "The Test Data folder" },
      { letter: "D", text: "The Keywords folder" }
    ],
    correctLetter: "B"
  },
  {
    id: 8, category: "Test Creation", type: "Multiple Choice",
    question: "What is the primary benefit of Katalon's Studio Assist?",
    options: [
      { letter: "A", text: "Automatically runs regression suites on a schedule" },
      { letter: "B", text: "Generates test steps from natural language inputs or requirements" },
      { letter: "C", text: "Connects directly to Jira to import test cases" },
      { letter: "D", text: "Converts recorded tests to Groovy scripts" }
    ],
    correctLetter: "B"
  },
  {
    id: 9, category: "Test Creation", type: "Multiple Choice",
    question: "In Script Mode, how do you call a built-in keyword to click a web element?",
    options: [
      { letter: "A", text: "Keywords.click()" },
      { letter: "B", text: "WebUI.click()" },
      { letter: "C", text: "Katalon.clickElement()" },
      { letter: "D", text: "Test.perform('click')" }
    ],
    correctLetter: "B"
  },
  {
    id: 10, category: "Debugging", type: "Multiple Choice",
    question: "In which view is breakpoint-based debugging available in Katalon Studio?",
    options: [
      { letter: "A", text: "Manual Mode" },
      { letter: "B", text: "Script Mode" },
      { letter: "C", text: "Both Manual and Script Mode" },
      { letter: "D", text: "Debug Panel only" }
    ],
    correctLetter: "B"
  },
  {
    id: 11, category: "Debugging", type: "Multiple Choice",
    question: "Which debug control lets you step into the logic of a called keyword?",
    options: [
      { letter: "A", text: "Step Over" },
      { letter: "B", text: "Step Out" },
      { letter: "C", text: "Step Into" },
      { letter: "D", text: "Resume" }
    ],
    correctLetter: "C"
  },
  {
    id: 12, category: "Debugging", type: "Multiple Choice",
    question: "How does Object Spy differ from Self-Healing for fixing broken locators?",
    options: [
      { letter: "A", text: "Object Spy is automated; Self-Healing is manual" },
      { letter: "B", text: "Object Spy is manual locate-and-fix; Self-Healing is smart auto-correction" },
      { letter: "C", text: "Object Spy only works for API; Self-Healing is web-only" },
      { letter: "D", text: "They are identical features with different names" }
    ],
    correctLetter: "B"
  },
  {
    id: 13, category: "Test Data", type: "Multiple Choice",
    question: "What is the recommended maximum dataset size for Internal Data files?",
    options: [
      { letter: "A", text: "100-200 rows" },
      { letter: "B", text: "50-100 rows" },
      { letter: "C", text: "5-20 rows" },
      { letter: "D", text: "No limit recommended" }
    ],
    correctLetter: "C"
  },
  {
    id: 14, category: "Test Data", type: "Multiple Choice",
    question: "Where should Excel/CSV test data files be stored within a Katalon project?",
    options: [
      { letter: "A", text: "Root of the project directory" },
      { letter: "B", text: "Include > Resources > Test Data" },
      { letter: "C", text: "Test Cases > Data" },
      { letter: "D", text: "Object Repository > Data" }
    ],
    correctLetter: "B"
  },
  {
    id: 15, category: "Test Data", type: "Multiple Choice",
    question: "Which data binding strategy executes every data row exactly once?",
    options: [
      { letter: "A", text: "One-to-One" },
      { letter: "B", text: "Range" },
      { letter: "C", text: "All Combinations" },
      { letter: "D", text: "All" }
    ],
    correctLetter: "D"
  },
  {
    id: 16, category: "Test Data", type: "Multiple Choice",
    question: "What is the main purpose of Execution Profiles in Katalon Studio?",
    options: [
      { letter: "A", text: "Recording browser interactions automatically" },
      { letter: "B", text: "Storing Global Variables for different environments (Dev, QA, UAT, Prod)" },
      { letter: "C", text: "Packaging test cases for deployment" },
      { letter: "D", text: "Configuring locator strategies per environment" }
    ],
    correctLetter: "B"
  },
  {
    id: 17, category: "Test Data", type: "Multiple Choice",
    question: "What syntax is used to reference a Global Variable inside a test case?",
    options: [
      { letter: "A", text: "GlobalVariable.VARIABLE_NAME" },
      { letter: "B", text: "${GlobalVariable.VARIABLE_NAME}" },
      { letter: "C", text: "@GlobalVariable.VARIABLE_NAME" },
      { letter: "D", text: "Profiles.get('VARIABLE_NAME')" }
    ],
    correctLetter: "B"
  },
  {
    id: 18, category: "Test Execution", type: "Multiple Choice",
    question: "What key capability do Test Suite Collections add over a single Test Suite?",
    options: [
      { letter: "A", text: "Support for data binding" },
      { letter: "B", text: "Parallel execution and cross-browser/multi-profile testing" },
      { letter: "C", text: "CLI execution support" },
      { letter: "D", text: "API test support" }
    ],
    correctLetter: "B"
  },
  {
    id: 19, category: "Test Execution", type: "Multiple Choice",
    question: "Where do you configure browser-specific capabilities such as args, prefs, and WebDriver settings?",
    options: [
      { letter: "A", text: "Test Suite > Execution Settings" },
      { letter: "B", text: "Project > Settings > Desired Capabilities > Web UI > [Browser Type]" },
      { letter: "C", text: "Tools > WebDriver > Browser Config" },
      { letter: "D", text: "Run > Advanced Options > Capabilities" }
    ],
    correctLetter: "B"
  },
  {
    id: 20, category: "Test Execution", type: "Multiple Choice",
    question: "Which browser argument runs the browser in headless mode for faster execution?",
    options: [
      { letter: "A", text: "--no-gui" },
      { letter: "B", text: "--disable-display" },
      { letter: "C", text: "--headless" },
      { letter: "D", text: "--silent" }
    ],
    correctLetter: "C"
  },
  {
    id: 21, category: "Test Execution", type: "Multiple Choice",
    question: "What is required to activate the Katalon Runtime Engine when generating a CLI command?",
    options: [
      { letter: "A", text: "A valid Katalon license file (.lic)" },
      { letter: "B", text: "A Katalon API key" },
      { letter: "C", text: "A Jenkins integration token" },
      { letter: "D", text: "A TestOps project ID" }
    ],
    correctLetter: "B"
  },
  {
    id: 22, category: "Test Execution", type: "Multiple Choice",
    question: "In the Linux cron expression 0 2 * * *, when does the job run?",
    options: [
      { letter: "A", text: "Every 2 minutes" },
      { letter: "B", text: "At 2:00 AM every day" },
      { letter: "C", text: "At 2:00 PM on weekdays" },
      { letter: "D", text: "Every hour at minute 2" }
    ],
    correctLetter: "B"
  },
  {
    id: 23, category: "Test Creation", type: "Fill in the Blank",
    question: "Complete the Script Mode call to click the element stored at Page_Login/btn_login:\nWebUI.______(findTestObject('Page_Login/btn_login'))",
    correctAnswer: "click"
  },
  {
    id: 24, category: "Test Data", type: "Fill in the Blank",
    question: "Complete the line that reads the APP_URL Global Variable from an Execution Profile in Script Mode:\nWebUI.navigateToUrl(__________________)",
    correctAnswer: "GlobalVariable.APP_URL"
  },
  {
    id: 25, category: "Test Creation", type: "Fill in the Blank",
    question: "Complete the custom keyword call using the full path common.utils.LoginHelper.loginAs:\nCustomKeywords._______________________________('admin', 'pass123')",
    correctAnswer: "'common.utils.LoginHelper.loginAs'"
  },
  {
    id: 26, category: "Debugging", type: "Spot the Bug",
    question: "This login script has a bug that causes a runtime error. Click the line containing the mistake:\n(Hint: Groovy method names are case-sensitive.)",
    options: [
      { letter: "A", text: "WebUI.openBrowser('')" },
      { letter: "B", text: "WebUI.navigateToUrl('https://app.example.com')" },
      { letter: "C", text: "WebUI.setText(findTestObject('Page_Login/txt_username'), 'admin')" },
      { letter: "D", text: "WebUI.SetText(findTestObject('Page_Login/txt_password'), 'pass123')" }
    ],
    correctLetter: "D",
    correctAnswer: "Line 4: WebUI.SetText(findTestObject('Page_Login/txt_password'), 'pass123')"
  },
  {
    id: 27, category: "Test Data", type: "Spot the Bug",
    question: "This data-driven test silently returns null for one field. Click the problematic line:\n(Hint: CSV column header names are case-sensitive.)",
    options: [
      { letter: "A", text: "def username = data.getValue('username', index)" },
      { letter: "B", text: "def password = data.getValue('Password', index)" },
      { letter: "C", text: "WebUI.setText(findTestObject('txt_username'), username)" },
      { letter: "D", text: "WebUI.setText(findTestObject('txt_password'), password)" }
    ],
    correctLetter: "B",
    correctAnswer: "Line 2: def password = data.getValue('Password', index)"
  },
  {
    id: 28, category: "Test Execution", type: "Spot the Bug",
    question: "This CLI command has one incorrect flag. Click the line containing the error:\n(Hint: Check the flag used to specify the test suite path.)",
    options: [
      { letter: "A", text: "katalon \\" },
      { letter: "B", text: "-noSplash -runMode=console \\" },
      { letter: "C", text: '-projectPath="/projects/MyApp/MyApp.prj" \\' },
      { letter: "D", text: '-suitePath="Test Suites/LoginTests" \\' }
    ],
    correctLetter: "D",
    correctAnswer: 'Line 4: -suitePath="Test Suites/LoginTests" \\'
  },
  {
    id: 29, category: "Test Creation", type: "Drag to Order",
    question: "Drag to arrange these steps in the correct order for a Web Recorder session:",
    orderedSteps: [
      "Configure default locator strategy in Project Settings",
      "Launch Record Web from toolbar and enter the target URL",
      "Perform actions manually - Katalon records each step",
      "Add synchronization and verification points during recording",
      "Choose object merging strategy and save the Test Case",
      "Review objects in Temp folder and move to repository"
    ]
  },
  {
    id: 30, category: "Debugging", type: "Drag to Order",
    question: "Drag to arrange the correct sequence for debugging a failing test in Katalon Studio:",
    orderedSteps: [
      "Switch the test case to Script Mode",
      "Set breakpoints by clicking in the gutter next to suspect lines",
      "Launch debug mode using the bug icon in the toolbar",
      "Step through execution using Step Over or Step Into",
      "Inspect values in the Watch Variables panel",
      "Apply the fix and re-run to confirm resolution"
    ]
  }
];

export const PASS_MARK = 0.75;
export const CATEGORIES = [...new Set(questions.map(q => q.category))];
