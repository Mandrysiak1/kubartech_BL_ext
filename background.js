chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.contentScriptQuery) {
        case "userLogin":
        {
            let params = {
                "inventory_id": 4745,
                "products": request.data
            };

            let data = {
                'method': 'getInventoryProductsData',
                'parameters': JSON.stringify(params)
            };
            const formData  = new FormData();

            
            for(const name in data) {
                formData.append(name, data[name]);
              }

              console.log(formData)

                    const url = 'https://api.baselinker.com/connector.php '

       


                const options = {
                method: "POST",
                body: formData,
                headers: new Headers( {
                    'X-BLToken': '3005243-3013293-7NMX38KMPB6S5AGQ87WAQ0KE8D735MPWRET1I8AWQ7BNNS7KOQ577X03CYIPMNZM',
                   
                    //'Content-Type': 'application/json'
                })
                }

                fetch(url,options).then((response)=>response.json()).then((data)=>{
                
                console.log("success:",  data)


                sendResponse({
                    response: "Message received",
                    data:data
                });

        

                }).catch((error) => {
                    console.log("errror", error)
                })
                        console.log("es tego ")
                        break;
         }}
              return true;
});