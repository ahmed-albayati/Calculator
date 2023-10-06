/*
TODO:
    Limit number input
*/

(function() {
    "use strict";
    let theNum = ""; 

    let el = function(element) {
      if (element.charAt(0) === "#") { // If passed an ID...
        return document.querySelector(element); 
      }
  
      return document.querySelectorAll(element);
    };
    function triggerValueAnimation(value) {
      const animationField = document.querySelector('.animation-field');
      animationField.textContent = value;
      animationField.style.animation = 'none'; // Reset animation
      void animationField.offsetWidth; // Trigger reflow to restart the animation
      animationField.style.animation = null;
    }
  
    // Variables
    let viewer = el("#viewer"),
      equals = el("#equals"), 
      nums = el(".num"), 
      ops = el(".ops"), 
      oldNum = "", 
      resultNum, 
      operator;
  
    // When: Number is clicked. Get the current number selected
    let setNum = function() {
      if (resultNum) { // If a result was displayed, reset number
        theNum = this.getAttribute("data-num");
        resultNum = "";
      } else { // Otherwise, add digit to previous number (this is a string!)
        if (String(theNum).length >= 9) { // not working !!!
          //console.log("Limit reached. theNum: " + theNum); // Debugging
          return;
        }
        if (this.getAttribute("data-num") === "." && String(theNum).indexOf(".") !== -1 ) {
          return; // Ignore additional decimal points
        }
        theNum = String(theNum) + this.getAttribute("data-num");
      }
  
      viewer.innerHTML = theNum;
      triggerValueAnimation(theNum); 
    };
  
    // When: Operator is clicked. Pass number to oldNum and save operator
    let moveNum = function() {
      oldNum = theNum;
      theNum = "";
      operator = this.getAttribute("data-ops");
  
      equals.setAttribute("data-result", ""); 
      viewer.innerHTML = operator;
      triggerValueAnimation(operator);
    };
  
    // When: Equals is clicked. Calculate result
    let displayNum = function() {
      // Convert string input to numbers
      oldNum = parseFloat(oldNum);
      theNum = parseFloat(theNum);  
      switch (operator) {
        case "plus":
          resultNum = oldNum + theNum;
          break; 
        case "minus":
          resultNum = oldNum - theNum;
          break;
        case "times":
          resultNum = oldNum * theNum;
          break;
        case "divided by":
          resultNum = oldNum / theNum;
          break;
          // If equal is pressed without an operator, keep number and continue
        default:
          resultNum = theNum;
          triggerValueAnimation(resultNum);
      }
  
      // If NaN or Infinity returned
      if (!isFinite(resultNum)) {
        if (isNaN(resultNum)) { // If result is not a number; set off by, eg, double-clicking operators
          resultNum = "You broke it!";
        } else { // If result is infinity, set off by dividing by zero
          resultNum = "Look at what you've done";
          el('#calculator').classList.add("broken"); // Break calculator
          el('#reset').classList.add("show"); // And show reset button
        }
      }
      if (resultNum === parseInt(resultNum, 10)) { // display resutls
        viewer.innerHTML = resultNum;
      } else {
        viewer.innerHTML = resultNum.toFixed(2);
      }
      triggerValueAnimation(resultNum);
      oldNum = 0;
      theNum = resultNum;
    };
  
    // When: Clear button is pressed.
    let clearAll = function() {
      oldNum = "";
      theNum = "";
      viewer.innerHTML = "0";
      //equals.setAttribute("data-result", resultNum);
      triggerValueAnimation("reset!");
    };
    
    let handleBackspace = function() {
      theNum = String(theNum); // Ensure theNum is a string
      theNum = theNum.slice(0, -1);
      viewer.innerHTML = theNum;
      triggerValueAnimation("Backspace");
    };

    // Handle keyboard input
    document.addEventListener("keydown", function (event) {
      var key = event.key;
      
      if (key >= "0" && key <= "9") {
        theNum += key;
        viewer.innerHTML = theNum;
        triggerValueAnimation(theNum);
      } else if (key === "." && theNum.indexOf(".") === -1) {
        theNum += key;
        viewer.innerHTML = theNum;
        triggerValueAnimation(theNum);
      }  else if (key === "+" || key === "-" || key === "*" || key === "/" || key === "Enter") {
        var operatorValue;
    
        switch (key) {
          case "+":
            operatorValue = "plus";
            triggerValueAnimation(operatorValue);
            break;
          case "-":
            operatorValue = "minus";
            triggerValueAnimation(operatorValue);
            break;
          case "*":
            operatorValue = "times";
            triggerValueAnimation(operatorValue);
            break;
          case "/":
            operatorValue = "divided by";
            triggerValueAnimation(operatorValue);
            break;
          case "Enter":
            if (oldNum && theNum && operator) {
              displayNum();
            }
            return;
          default:
            return; // Return for other keys that are not operators
        }
        if (theNum !== "") {
          oldNum = theNum;
          theNum = "";
          operator = operatorValue;  
          viewer.innerHTML = key;
          equals.setAttribute("data-result", "");
        }
      } else if (key === "Enter" || key === "=") {
        if (oldNum && theNum && operator) {
          displayNum();
        }
      } else if (key === "Backspace") {
        handleBackspace();
      } else if (key === "Escape") {
        clearAll();
      }
  });

    /* The click events */
    for (var i = 0, l = nums.length; i < l; i++) {
      nums[i].onclick = setNum;
    }
  
    for (var i = 0, l = ops.length; i < l; i++) {
      ops[i].onclick = moveNum;
    } 

    equals.onclick = displayNum;

    el("#clear").onclick = clearAll;

    el("#reset").onclick = function() {
      triggerValueAnimation("Reset!");
      window.location = window.location;
    };
  }());