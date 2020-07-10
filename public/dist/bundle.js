/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./public/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./public/db.js":
/*!**********************!*\
  !*** ./public/db.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("let db;\n// Create a new db request for a \"budget\" database.\nconst request = indexedDB.open(\"budget\", 1);\n\n// When database is created or db version updated\nrequest.onupgradeneeded = function (event) {\n    // Create object store called \"pending\" and set autoIncrement to true\n    const db = event.target.result;\n    db.createObjectStore(\"pending\", { autoIncrement: true });\n};\n\n// If indexedDB is not created successfully, log error\nrequest.onerror = function (event) {\n    console.log(\"Whoops! \" + event.target.errorCode);\n};\n\n// When indexedDB is successfully connected,\nrequest.onsuccess = function (event) {\n    db = event.target.result;\n\n    // If app is online, check indexedDB and POST \"pending\" records to MongoDB\n    // navigator.onLine is a property that maintains a true/false value and updates whenever a browser is no longer capable of connecting to the network\n    if (navigator.onLine) {\n        checkDatabase();\n    }\n};\n\nfunction checkDatabase() {\n    // Open a transaction on your pending db\n    const transaction = db.transaction([\"pending\"], \"readwrite\");\n    // Access your pending object store\n    const store = transaction.objectStore(\"pending\");\n    // Get all records from store and set to a variable\n    const getAll = store.getAll();\n\n    // Upon successfully getting all pending records in store\n    getAll.onsuccess = function () {\n\n        // Then if there are any pending results, and POST to the MongoDB\n        if (getAll.result.length > 0) {\n            fetch(\"/api/transaction/bulk\", {\n                method: \"POST\",\n                body: JSON.stringify(getAll.result),\n                headers: {\n                    Accept: \"application/json, text/plain, */*\",\n                    \"Content-Type\": \"application/json\"\n                }\n            })\n                .then(response => response.json())\n                .then(() => {\n                    // If successful, open a transaction on your pending db\n                    const transaction = db.transaction([\"pending\"], \"readwrite\");\n\n                    // Access your \"pending\" object store\n                    const store = transaction.objectStore(\"pending\");\n\n                    // And clear all items in your \"pending\" store\n                    store.clear();\n                });\n        }\n    };\n}\n\n// saveRecord() is called in index.js if POST to MongoDB fails \nfunction saveRecord(record) {\n    // Create a transaction on the \"pending\" IndexedDB with readwrite access\n    const transaction = db.transaction([\"pending\"], \"readwrite\");\n\n    // Access your \"pending\" object store\n    const store = transaction.objectStore(\"pending\");\n\n    // And add the transaction record (name, value, date) to your store\n    store.add(record);\n}\n\nmodule.exports = {\n    checkDatabase,\n    saveRecord\n}\n\n\n//# sourceURL=webpack:///./public/db.js?");

/***/ }),

/***/ "./public/index.js":
/*!*************************!*\
  !*** ./public/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// Require db.js file so that it gets bundled with webpack\nconst indexedDB = __webpack_require__(/*! ./db */ \"./public/db.js\");\n\n// Whenever app comes online, check indexedDB and POST \"pending\" records to MongoDB\nwindow.addEventListener(\"online\", checkDatabase);\n\nlet transactions = [];\nlet myChart;\n\nfetch(\"/api/transaction\")\n  .then(response => {\n    return response.json();\n  })\n  .then(data => {\n    // save db data on global variable\n    transactions = data;\n\n    populateTotal();\n    populateTable();\n    populateChart();\n  });\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  let total = transactions.reduce((total, t) => {\n    return total + parseInt(t.value);\n  }, 0);\n\n  let totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  let tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n\n  transactions.forEach(transaction => {\n    // create and populate a table row\n    let tr = document.createElement(\"tr\");\n    tr.innerHTML = `\n      <td>${transaction.name}</td>\n      <td>${transaction.value}</td>\n    `;\n\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  let reversed = transactions.slice().reverse();\n  let sum = 0;\n\n  // create date labels for chart\n  let labels = reversed.map(t => {\n    let date = new Date(t.date);\n    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;\n  });\n\n  // create incremental values for chart\n  let data = reversed.map(t => {\n    sum += parseInt(t.value);\n    return sum;\n  });\n\n  // remove old chart if it exists\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  let ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data\n      }]\n    }\n  });\n}\n\nfunction sendTransaction(isAdding) {\n  let nameEl = document.querySelector(\"#t-name\");\n  let amountEl = document.querySelector(\"#t-amount\");\n  let errorEl = document.querySelector(\".form .error\");\n\n  // validate form\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  }\n  else {\n    errorEl.textContent = \"\";\n  }\n\n  // create record\n  let transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  };\n\n  // if subtracting funds, convert amount to negative number\n  if (!isAdding) {\n    transaction.value *= -1;\n  }\n\n  // add to beginning of current array of data\n  transactions.unshift(transaction);\n\n  // re-run logic to populate ui with new record\n  populateChart();\n  populateTable();\n  populateTotal();\n\n  // also send to server - POST transaction to MongoDB\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  })\n    .then(response => {\n      return response.json();\n    })\n    .then(data => {\n      if (data.errors) {\n        errorEl.textContent = \"Missing Information\";\n      }\n      else {\n        // clear form\n        nameEl.value = \"\";\n        amountEl.value = \"\";\n      }\n    })\n    .catch(err => {\n      // POST failed, so save in indexed db\n      saveRecord(transaction);\n\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    });\n}\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n};\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\n\n//# sourceURL=webpack:///./public/index.js?");

/***/ })

/******/ });