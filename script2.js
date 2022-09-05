
const init = function(){
  console.log("Kubartech BL gross margin extension launched");

  // Select the node that will be observed for mutations
  const targetNode = document.getElementById('product_modal');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };
  const prevState = targetNode.classList.contains('in');

  // Callback function to execute when mutations are observed
  const callback = function(mutationList, observer) {
    for(const mutation of mutationList) {
        if (mutation.type === 'attributes') {
            if(mutation.attributeName === 'class') {
              let currentState = targetNode.classList.contains('in');
              if(currentState !== prevState) { 
                setTimeout(initGrossMarginFields, 500);
              }
            }
        }
    }
  } 

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
}

  

const initGrossMarginFields = () => {
	let link = document.querySelector("a[href='#edit-sales']");
  if(link) {
    link.addEventListener("click", launchGrossMarginDiv, {once: true});

    registerSubmitChangesButtonObserver();
    registerEventListenersOnInputFields();
  }
}

const registerSubmitChangesButtonObserver = () => {
  let submitChangesButton = document.querySelector('.btn_product.btn-primary');
  if(submitChangesButton) {
    const submitChangesButtonObserver = new MutationObserver((mutationList, observer) => { 
      for(const mutation of mutationList) {
        if(mutation.attributeName === 'disabled' && mutation.oldValue === '') {
          if(document.getElementsByClassName('.gross-margin').length <= 0) {
            // launchGrossMarginDiv();
            registerEventListenersOnInputFields();
          }
        }
      }
    });
    submitChangesButtonObserver.observe(submitChangesButton, {attributes: true, childList: true, subtree: true, attributeOldValue: true, attributeName: true});
  }
}

const registerEventListenersOnInputFields = () => {
  let sellingPriceContainers = document.getElementsByClassName('price_container');
  if(sellingPriceContainers) {
    Array.from(sellingPriceContainers).forEach(
      function(sellingPriceContainer) {
        let sellingPriceInput = sellingPriceContainer.getElementsByTagName('input');
        if(sellingPriceInput) {
          sellingPriceInput[0].addEventListener('change', (event) => {
            let eventTarget = event.target;
            updateGrossMarginField(eventTarget);
          });
        }       
      }
    );
  }
  
  let purchasePriceInput = document.querySelector('.supplier_row .product_supplier_cost');
  if(purchasePriceInput) {
    purchasePriceInput.addEventListener('change', (event) => {
      let eventTarget = event.target;
      updateAllGrossMarginFields(eventTarget);
    });
  }
}


const launchGrossMarginDiv = () => {
  let purchasePriceValue = getPurchasePriceValue();
  let sellingPriceContainers = document.getElementsByClassName('price_container');
  if(sellingPriceContainers) {
    Array.from(sellingPriceContainers).forEach(
      function(sellingPriceContainer) {
        let sellingPriceValue = getSellingPriceValue(sellingPriceContainer);
        let grossMarginValue = calculateGrossMarginValue(sellingPriceValue, purchasePriceValue);
        let grossMarginDiv = '<div class="gross-margin"><span class="gross-margin__label" style="font-weight: bold;">Marża: </span><span class="gross-margin__value">' + grossMarginValue + '%</span></div>';
        sellingPriceContainer.querySelector('.input-group').insertAdjacentHTML('afterend', grossMarginDiv);
      }
    );
  }
}

const getSellingPriceValue = (container) => {
  let sellingPriceInput = container.getElementsByTagName('input');
  let sellingPriceValue = -1;
  if(sellingPriceValue) {
    sellingPriceValue = parseFloat(sellingPriceInput[0].value);
  }
  return sellingPriceValue;
}

const getPurchasePriceValue = () => {
  let purchasePriceInput = document.querySelector('.supplier_row .product_supplier_cost');
  let purchasePriceValue = -1;
  if(purchasePriceInput) {
    purchasePriceValue = parseFloat(purchasePriceInput.value);
  }
  return purchasePriceValue;
}

const updateGrossMarginField = (eventTarget) => {
  let sellingPriceValue = eventTarget.value;

  let purchasePriceValue = getPurchasePriceValue();

  let priceContainer = eventTarget.parentElement;
  priceContainer = priceContainer.parentElement;
  calculateGrossMarginValueAndUpdateSpan(priceContainer, sellingPriceValue, purchasePriceValue);
}

const updateAllGrossMarginFields = (eventTarget) => {
  let purchasePriceValue = parseFloat(eventTarget.value);
  let sellingPriceContainers = document.getElementsByClassName('price_container');
  if(sellingPriceContainers) {
    Array.from(sellingPriceContainers).forEach(
      function(sellingPriceContainer) {
        let sellingPriceValue = getSellingPriceValue(sellingPriceContainer);
        calculateGrossMarginValueAndUpdateSpan(sellingPriceContainer, sellingPriceValue, purchasePriceValue);
      }
    );
  }
}

const calculateGrossMarginValueAndUpdateSpan = (sellingPriceContainer, sellingPriceValue, purchasePriceValue) => {
  let grossMarginValue = calculateGrossMarginValue(sellingPriceValue, purchasePriceValue);
  updateGrossMarginSpan(sellingPriceContainer, grossMarginValue);
}

const updateGrossMarginSpan = (priceContainer, grossMarginValue) => {
  let grossMarginValueSpan = priceContainer.querySelector('.gross-margin__value');
  if(grossMarginValueSpan) {
    grossMarginValueSpan.innerHTML = grossMarginValue + '%';
  }
}

const calculateGrossMarginValue = (sellingPriceValue, purchasePriceValue) => {
  let grossMarginValue = (sellingPriceValue - purchasePriceValue) / sellingPriceValue * 100;
  grossMarginValue = parseFloat(grossMarginValue).toFixed(2);
  return grossMarginValue;
}

init();


