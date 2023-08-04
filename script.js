
  var lastProductIds = []
  var lastProductPrices = []
  var purchasePrices = [];
  var margins = [];
  var productsData = [];


const init = async function(){

  console.log("Kubartech BL gross margin extension launched");

  //wstępne policzenie
  await updateMarginListData()


  // Select the node that will be observed for mutations
  const targetNode = document.getElementById('edit_object_modal');

  // Options for the observer (which mutations to observe)
  const config = { attributes: true };
  const prevState = targetNode.classList.contains('in');

  // Callback function to execute when mutations are observed
  const callback = function(mutationList, observer) {
      for(const mutation of mutationList) {
          if (mutation.type === 'attributes') {
              console.log(mutation);
              if(mutation.attributeName === 'class') {
                let currentState = targetNode.classList.contains('in');
                if(currentState !== prevState) {       
                  setTimeout(updatePurchasePriceInArray, 500); //+
                  setTimeout(initGrossMarginFieldsModal, 500); //+
                } else {
                  console.log('Product modal closed');
                  launchGrossMarginTableCellsFrontPage();

                }
              } 
          }
      }
  };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);

    // Select the node that will be observed for mutations
  //const targetNode1 = document.getElementById('product_modal');
  let targetNode1 = document.querySelector(".panel");
  //var lastV = document.querySelector("ul.pager_container .active .item-sm ").textContent
 //console.log(lastV)
  //console.log(targetNode1)
  // Options for the observer (which mutations to observe)
  const config1 = { attributes: true, childList: true,subtree: true };
  const prevState1 = targetNode1.classList.contains('in');

  // Callback function to execute when mutations are observed
  const callback1 = async function(mutationList, observer) {
    if(checkiflistchangeed())
    {
      console.log("zmiana")
      await updateMarginListData()
    } else {
      // console.log('osjdfjsdf');
    }
  };

  // Create an observer instance linked to the callback function
  const observer1 = new MutationObserver(callback1);

  // Start observing the target node for configured mutations
  observer1.observe(targetNode1, config1);

  console.log(purchasePrices);
  console.log(margins);
  console.log('productData', productsData)
}

const updatePurchasePriceInArray = () => { //+
  let purchasePriceInput = document.getElementById('txt|5072|db|0|');
  purchasePriceInput.addEventListener('change', (event) => {
    let newPrice = event.target.value;
    let productName = document.querySelector('.modal-dialog li.breadcrumb_name.active').innerHTML;
    let productData = productsData.find(obj => obj.name === productName);
    productData.purchasePrice = Number.parseFloat(newPrice);
  })
}





///////////////////////////////////////////////////////////////
const checkiflistchangeed = () => 
{
  let productsInfo = document.querySelectorAll('.product-title .adt-info');
  let productIds = [];
  productsInfo.forEach(info => productIds.push(info.getElementsByClassName('clipboard_copy')[0].textContent));


  let productsPricesInfo = document.querySelectorAll('.tbl-order-7 .easy_edit_display_value');
  let productPrices = [];
  productsPricesInfo.forEach(info => productPrices.push(info.textContent));

  if(arraysEqual(lastProductIds,productIds) && arraysEqual(lastProductPrices,productPrices) ) {
    lastProductIds = productIds
    lastProductPrices = productPrices
    console.log(" nie zmieniono produkty")

    return false;
  } else {
    lastProductIds = productIds
    lastProductPrices = productPrices
    console.log("zmieniono produkty")

    return true;
  }
}


function sendMessagePromise() {
  return new Promise((resolve, reject) => {
    let productsInfo = document.querySelectorAll('.product-title .adt-info');
    let productsPricesInfo = document.querySelectorAll('.tbl-order-7 .easy_edit_display_value');
    let productPrices = [];
    productsPricesInfo.forEach(info => productPrices.push(info.textContent));
    let productIds = [];
    productsInfo.forEach(info => productIds.push(info.getElementsByClassName('clipboard_copy')[0].textContent));

    var margins = [];

      chrome.runtime.sendMessage({
        contentScriptQuery: "userLogin",
        data: productIds
      }, function(response) {

        console.log("Api call")
        index = 0
        productIds.forEach(el => {
          let price = Number.parseFloat(productPrices[index])
          let purchase_price = (Number.parseFloat(response.data.products[el].text_fields.extra_field_5072))
          let name = (response.data.products[el].text_fields.name);
          productsData.push({
            id: el,
            price: price,
            name: name,
            purchasePrice: purchase_price
          });
          index++;
        })
        resolve(margins);
      });
    })
}

const launchGrossMarginTableCellsFrontPage = () => {
  let tableHeader = document.querySelector('.table-sticky-header .getOffsetLeft');
  let grossMarginHeader = document.querySelectorAll('.gross-margin-table__header');
  if(!grossMarginHeader || grossMarginHeader.length === 0)
    tableHeader.insertAdjacentHTML('afterend', "<th class='gross-margin-table__header'>MARŻA</th>");

  let productsRow = document.querySelectorAll('tr.product_row');
  if(productsRow && productsRow.length > 0) {
    let quantityTds = [];
    productsRow.forEach(row => quantityTds.push(row.cells[4]));
    let grossMarginCells = document.querySelectorAll('.gross-margin-table__cell');
    if(!grossMarginCells || grossMarginCells.length != productsRow.length) {
      productsRow.forEach(row => {
        let prodId = row.id;
        let productData = productsData.find(prod => prodId.includes(prod.id.toString()));
        let marginVal = calculateGrossMarginValue(productData.price, productData.purchasePrice).toString() + '%';
        let quantityCell = row.querySelector('.tbl-order-6');
        if(row.cells.length <= 8)
          quantityCell.insertAdjacentHTML('afterend', '<td class="gross-margin-table__cell">' + marginVal + '</td>');
      })
    }
  }
}

const updateMarginListData = async () => {
  margins = await sendMessagePromise();
  console.log(margins);

  launchGrossMarginTableCellsFrontPage();
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}




const initGrossMarginFieldsModal = () => {
	let link = document.querySelector("a[href='#edit-sales']");
	// link.addEventListener("click", launchGrossMarginDiv, {once: true});
	link.addEventListener("click", launchGrossMarginDivModal);

  registerSubmitChangesButtonObserver();
  registerEventListenersOnInputFields();
}

const registerSubmitChangesButtonObserver = () => {
  let submitChangesButton = document.querySelector('.btn_product.btn-primary');
  const submitChangesButtonObserver = new MutationObserver((mutationList, observer) => { 
    for(const mutation of mutationList) {
      if(mutation.attributeName === 'disabled' && mutation.oldValue === '') {
        if(document.getElementsByClassName('.gross-margin').length <= 0) {
          launchGrossMarginDivModal();
          registerEventListenersOnInputFields();
        }
      }
    }
  });
  submitChangesButtonObserver.observe(submitChangesButton, {attributes: true, childList: true, subtree: true, attributeOldValue: true, attributeName: true});
}

const registerEventListenersOnInputFields = () => {
  let sellingPriceContainers = document.getElementsByClassName('price_container');
  Array.from(sellingPriceContainers).forEach(
		function(sellingPriceContainer) {
			let sellingPriceInput = sellingPriceContainer.getElementsByTagName('input');
      sellingPriceInput[0].addEventListener('change', (event) => {
        let eventTarget = event.target;
        let sellingPriceValue = eventTarget.value;
        let productName = document.querySelector('.modal-dialog li.breadcrumb_name.active').innerHTML;
        let purchasePriceValue = productsData.find(obj => obj.name === productName).purchasePrice;
        let grossMarginVal = calculateGrossMarginValue(sellingPriceValue, purchasePriceValue);
        let priceContainer = eventTarget.parentElement;
        priceContainer = priceContainer.parentElement;
        updateGrossMarginSpan(priceContainer, grossMarginVal);
        // updateGrossMarginField(eventTarget);
      });
		}
	);
}


const launchGrossMarginDivModal = () => {
  let purchasePriceValue = getPurchasePriceValue();
  let sellingPriceContainers = document.getElementsByClassName('price_container');
  console.log(sellingPriceContainers)
  Array.from(sellingPriceContainers).forEach(
		function(sellingPriceContainer) {
      let existingGrossMarginDivs = document.getElementsByClassName('gross-margin');
      let sellingPriceValue = getSellingPriceValueModal(sellingPriceContainer);
      let grossMarginValue = calculateGrossMarginValue(sellingPriceValue, purchasePriceValue);
      if(existingGrossMarginDivs.length < sellingPriceContainers.length) {
        let grossMarginDiv = '<div class="gross-margin"><span class="gross-margin__label" style="font-weight: bold;">Marża: </span><span class="gross-margin__value">' + grossMarginValue + '%</span></div>';
        sellingPriceContainer.querySelector('.input-group').insertAdjacentHTML('afterend', grossMarginDiv);
      } else {
        updateGrossMarginSpan(sellingPriceContainer.getElementsByClassName('gross-margin')[0], grossMarginValue);
      }
		}
	);
}

const getSellingPriceValueModal = (container) => {
  let sellingPriceInput = container.getElementsByTagName('input');
  let sellingPriceValue = parseFloat(sellingPriceInput[0].value);
  return sellingPriceValue;
}

const getPurchasePriceValue = () => {
  let purchasePriceInput = document.querySelector('.supplier_row .product_supplier_cost');
  let productNameContainer = document.querySelector('.modal-dialog li.breadcrumb_name.active');
  let productName = productNameContainer["innerText" in productNameContainer ? "innerText" : "textContent"].replace(/ *\[[^)]*\] */g, "");
  let purchasePriceValue = productsData.find(obj => obj.name === productName).purchasePrice;

  return purchasePriceValue;
}

const updateGrossMarginSpan = (priceContainer, grossMarginValue) => {
  let grossMarginValueSpan = priceContainer.querySelector('.gross-margin__value');
  grossMarginValueSpan.innerHTML = grossMarginValue + '%';
}

const calculateGrossMarginValue = (sellingPriceValue, purchasePriceValue) => {
  // let margin =((price - purchase_price * 1.23) / price * 100).toFixed(2);
  let grossMarginValue = (sellingPriceValue - (purchasePriceValue * 1.23)) / sellingPriceValue * 100;
  grossMarginValue = parseFloat(grossMarginValue).toFixed(2);
  return grossMarginValue;
}

init();


