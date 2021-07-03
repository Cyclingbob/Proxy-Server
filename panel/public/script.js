function format_request_params(data){

    var newdata = Object.keys(data)
    .map(key => `${key}=${data[key]}`)
    .join('&');

    return newdata

}

function send_data(data, url, method, callback){    

    const newdata = format_request_params(data)

    var xhr = new XMLHttpRequest()

    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {

            callback(xhr.responseText)

        }

    };

    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.send(newdata);
}

function get_form_data(data){

    data = Object.entries(data)

    var newdata = {}

    data.forEach(item => {

        item = item[1]

        if(item.name !== ''){

            newdata[item.name] = item.value

        }
    })

    return newdata

}

function login(e){

    e.preventDefault()    

    send_data(get_form_data(e.target), '/login', 'POST', function(response){
        
        if(response === 'ok'){

            window.location = '/'

        }

    })

}

var loginForm = document.getElementById('login-form')
if(loginForm) loginForm.addEventListener('submit', login)

function create_domain_record(data){

    var li = document.createElement('li')

    var domain = document.createElement('span')
    var ip = document.createElement('span')
    var port = document.createElement('span')

    domain.innerHTML = data.domain
    ip.innerHTML = data.ip
    port.innerHTML = data.port

    li.appendChild(domain)
    li.innerHTML = li.innerHTML + ' => '    
    li.appendChild(ip)
    li.innerHTML = li.innerHTML + ':'    
    li.appendChild(port)

    document.getElementById('logs').appendChild(li)

}

function add_domain(e){

    e.preventDefault()

    send_data(get_form_data(e.target), '/adddomain', 'POST', function(response){
        
        if(response === 'ok'){

            console.log(get_form_data(e.target))

            create_domain_record(get_form_data(e.target))

        }

    })

}

var addForm = document.getElementById('add-form')
if(addForm) addForm.addEventListener('submit', add_domain)

var list = []

Array.from(document.getElementById('logs').children).forEach(element => {

    var item = {}

    Array.from(element.children).forEach(inner_element => {
        
        item[inner_element.className] = inner_element.innerHTML

    })

    list.push(item)

})
