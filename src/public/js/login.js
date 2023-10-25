const form = document.getElementById('loginForm');

form.addEventListener('submit',e=>{
    console.log(e);
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    try {
        fetch('/api/sessions/login',{
            method:'POST',
            body:JSON.stringify(obj),
            headers:{
                'Content-Type':'application/json'
            }
        }).then(result=>{
            if(result.status===200){
                console.log(result.status);
                window.location.replace('/products');
            }else{
                alert("El usuario no existe, intente nuevamente")
            }
        })
    } catch (error) {
        console.log(error);
    }
    
})