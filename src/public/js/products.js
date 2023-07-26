const socket = io();

socket.on("update-products", (products) => {

  products.docs.forEach(product => {
    const agregarBtn = document.getElementById(product._id)

    agregarBtn.addEventListener("click", (e) => {
      agregarAlCarrito(product._id, e)
    })

  });

})

function agregarAlCarrito(productId, e) {
  e.preventDefault()
  if (productId) {
    socket.emit("add-product-to-cart", productId);
    console.log("se agrego");
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



