fetch('https://dictionary-dot-sse-2020.nw.r.appspot.com/get', {
    method: 'GET'
})
    .then(response => {
        if (response.ok) {
            console.log("sucess")
        }
        else {
            console.log("ERROR")
        }
        response.json()
    })
    .then(data => console.log(data));



async function getData(url = 'https://dictionary-dot-sse-2020.nw.r.appspot.com/get',)