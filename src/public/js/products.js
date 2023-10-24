

async function agregarAlCarrito(productId,cartId) {
 console.log(cartId);
 console.log(productId);
  try {
      await fetch(`/api/carts/${cartId}/product/${productId}`,{
          method:'POST',
      }).then(result=>{
          if(result.status===200){
              console.log(result.status);
            //  window.location.replace('/');
          }else{
              alert("El usuario no existe, intente nuevamente")
          }
      })
  } catch (error) {
      console.log(error);
  }
  
}

function logout() {
  fetch('/api/sessions/logout',{
    method:'GET',
  }).then(result=>{
    if(result.status===200){
        window.location.replace('/login');
    }
  })
}



